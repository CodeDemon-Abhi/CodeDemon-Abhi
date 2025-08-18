import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const PORT = parseInt(process.env.PORT || '4000', 10);
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'api' });
});

app.post('/upload', upload.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }]), async (req: Request, res: Response) => {
  try {
    const front = (req.files as any)?.front?.[0];
    const back = (req.files as any)?.back?.[0];

    if (!front || !back) {
      return res.status(400).json({ error: 'front and back images are required' });
    }

    const form = new FormData();
    form.append('front', front.buffer, { filename: front.originalname, contentType: front.mimetype });
    form.append('back', back.buffer, { filename: back.originalname, contentType: back.mimetype });

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    res.json({ analysis: aiResponse.data });
  } catch (error: any) {
    console.error('Upload error', error?.message);
    res.status(500).json({ error: 'Failed to analyze images' });
  }
});

app.get('/report/:userId/latest', async (_req: Request, res: Response) => {
  // Placeholder: in MVP we return a mock report
  res.json({
    userId: 'demo',
    srs: 72,
    notes: 'Mild lower belly skin laxity; prioritize core and hydration.',
    date: new Date().toISOString(),
  });
});

app.post('/plan', async (req: Request, res: Response) => {
  const { goal } = req.body || {};
  const plan = {
    goal: goal || 'balanced',
    workouts: [
      { day: 'Mon', focus: 'Core + Cardio', exercises: ['Dead bug', 'Pallof press', 'RKC plank', 'Incline walk 20 min'] },
      { day: 'Wed', focus: 'Upper Push/Pull', exercises: ['Push-ups (tempo)', '1-arm row', 'Face pulls', 'Side planks'] },
      { day: 'Fri', focus: 'Lower + Glutes', exercises: ['Goblet squat', 'Romanian deadlift', 'Hip thrust', 'Hanging knee raises'] },
    ],
    habits: ['Hydration 3L/day', 'Protein 1.6–2.2 g/kg', 'Collagen + Vitamin C pre-training']
  };
  res.json(plan);
});

app.listen(PORT, () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});

