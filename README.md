import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'atlas-server' });
});

app.get('/api/assets', async (_req, res) => {
  const assets = await prisma.asset.findMany({
    orderBy: { name: 'asc' },
  });

  res.json(assets);
});

app.get('/api/portfolio', async (_req, res) => {
  const assets = await prisma.asset.findMany();
  const total = assets.reduce((sum, asset) => sum + Number(asset.price) * Number(asset.quantity || 0), 10000);

  res.json({
    cash: 10000,
    total,
    assets,
    invested: assets.reduce((sum, asset) => sum + Number(asset.price) * Number(asset.quantity || 0), 0),
  });
});

app.post('/api/assets', async (req, res) => {
  const { name, ticker, price, kind } = req.body ?? {};

  if (!name || !ticker || !price || !kind) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const asset = await prisma.asset.upsert({
    where: { ticker },
    update: { name, price, kind },
    create: { name, ticker, price, kind },
  });

  return res.status(201).json(asset);
});

app.listen(port, () => {
  console.log(`Atlas API listening on http://localhost:${port}`);
});
