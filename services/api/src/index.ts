import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { store } from './store';
import { ReportRecord } from './types';

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.resolve(process.cwd(), 'data', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
const upload = multer({ dest: uploadsDir });

const PORT = parseInt(process.env.PORT || '4000', 10);
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'api' });
});

app.post('/upload', upload.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }]), async (req: Request, res: Response) => {
  try {
    const userId = (req.body?.userId as string) || 'demo';
    store.upsertUser(userId);
    const front = (req.files as any)?.front?.[0];
    const back = (req.files as any)?.back?.[0];

    if (!front || !back) {
      return res.status(400).json({ error: 'front and back images are required' });
    }

    const form = new FormData();
    form.append('front', fs.createReadStream(front.path), { filename: front.originalname, contentType: front.mimetype });
    form.append('back', fs.createReadStream(back.path), { filename: back.originalname, contentType: back.mimetype });

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    const analysis = aiResponse.data;
    const report: ReportRecord = {
      userId,
      createdAtIso: new Date().toISOString(),
      srs: analysis.skinRecoveryScore ?? 0,
      analysis,
      images: { frontPath: front.path, backPath: back.path },
    };
    store.addReport(report);
    res.json({ analysis });
  } catch (error: any) {
    console.error('Upload error', error?.message);
    res.status(500).json({ error: 'Failed to analyze images' });
  }
});

app.get('/report/:userId/latest', async (req: Request, res: Response) => {
  const report = store.getLatestReport(req.params.userId);
  if (!report) return res.status(404).json({ error: 'No report' });
  res.json(report);
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

app.get('/reports/:userId', (req: Request, res: Response) => {
  const limit = Number(req.query.limit || 10);
  res.json(store.getReports(req.params.userId, limit));
});

app.post('/habits/:userId', (req: Request, res: Response) => {
  const { dateIso, hydrationLiters, proteinGrams, collagenTaken, coreDone } = req.body || {};
  if (!dateIso) return res.status(400).json({ error: 'dateIso required (YYYY-MM-DD)' });
  const entry = store.upsertHabit(req.params.userId, { dateIso, hydrationLiters, proteinGrams, collagenTaken, coreDone });
  res.json(entry);
});

app.get('/habits/:userId', (req: Request, res: Response) => {
  res.json(store.getHabits(req.params.userId));
});

app.post('/overlay', upload.fields([{ name: 'front', maxCount: 1 }, { name: 'back', maxCount: 1 }]), async (req: Request, res: Response) => {
  try {
    const front = (req.files as any)?.front?.[0];
    const back = (req.files as any)?.back?.[0];
    if (!front || !back) return res.status(400).json({ error: 'front and back images are required' });

    const form = new FormData();
    form.append('front', fs.createReadStream(front.path), { filename: front.originalname, contentType: front.mimetype });
    form.append('back', fs.createReadStream(back.path), { filename: back.originalname, contentType: back.mimetype });
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/overlay`, form, { headers: form.getHeaders(), maxBodyLength: Infinity });
    res.json({ overlay: aiResponse.data });
  } catch (e: any) {
    console.error('Overlay error', e?.message);
    res.status(500).json({ error: 'Failed to generate overlay' });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});

