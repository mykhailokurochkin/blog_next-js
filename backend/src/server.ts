import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import authRouter from './auth/auth.controller.js';
import postsRouter from './posts/posts.controller.js';
import { initializeDatabase } from './db/sequelize.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

const port = Number(process.env.PORT ?? 4000);

const start = async () => {
  try {
    await initializeDatabase();
    app.listen(port);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void start();
