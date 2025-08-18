from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import cv2 as cv

app = FastAPI()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ai"}


def compute_basic_skin_metrics(img: np.ndarray) -> dict:
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    blur = cv.GaussianBlur(gray, (5, 5), 0)
    lap = cv.Laplacian(blur, cv.CV_64F)
    texture_var = float(lap.var())

    # Edge density
    edges = cv.Canny(blur, 50, 150)
    edge_density = float((edges > 0).mean())

    # Simple heuristic score (placeholder for ML)
    elasticity_score = max(0.0, min(100.0, 60 + (texture_var * 0.02) - (edge_density * 30)))

    return {
        "textureVariance": texture_var,
        "edgeDensity": edge_density,
        "elasticityScore": round(elasticity_score, 1),
    }


@app.post("/analyze")
async def analyze(front: UploadFile = File(...), back: UploadFile = File(...)):
    try:
        front_img = Image.open(front.file).convert("RGB")
        back_img = Image.open(back.file).convert("RGB")

        front_np = cv.cvtColor(np.array(front_img), cv.COLOR_RGB2BGR)
        back_np = cv.cvtColor(np.array(back_img), cv.COLOR_RGB2BGR)

        front_metrics = compute_basic_skin_metrics(front_np)
        back_metrics = compute_basic_skin_metrics(back_np)

        # Naive fat vs skin heuristic
        def fat_vs_skin(metrics: dict) -> str:
            if metrics["elasticityScore"] < 55 and metrics["edgeDensity"] < 0.05:
                return "more likely skin laxity"
            if metrics["textureVariance"] < 30:
                return "more likely subcutaneous fat"
            return "mixed"

        srs = round((front_metrics["elasticityScore"] + back_metrics["elasticityScore"]) / 2, 1)

        return JSONResponse(
            content={
                "skinRecoveryScore": srs,
                "front": {**front_metrics, "assessment": fat_vs_skin(front_metrics)},
                "back": {**back_metrics, "assessment": fat_vs_skin(back_metrics)},
                "recommendations": {
                    "habits": [
                        "Hydration 3L/day",
                        "Protein 1.6–2.2 g/kg",
                        "Collagen with Vitamin C pre-training",
                    ],
                    "training": [
                        "3x/week core stability (dead bug, pallof, plank)",
                        "2x/week full body strength",
                        "Zone 2 cardio 90–150 min/week",
                    ],
                },
            }
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

