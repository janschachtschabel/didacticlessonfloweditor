import cors from 'cors';
import express from 'express';
import { CORS_OPTIONS } from './config';

export function setupMiddleware(app: express.Application) {
  // Enable CORS
  app.use(cors(CORS_OPTIONS));
  
  // Parse JSON bodies
  app.use(express.json());
  
  // Basic logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}