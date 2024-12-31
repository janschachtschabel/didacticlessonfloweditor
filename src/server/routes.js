import express from 'express';
import axios from 'axios';
import { REQUEST_TIMEOUT, DEFAULT_HEADERS } from './config.js';
import { sanitizeUrl, logRequest, handleError } from './utils.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main proxy endpoint
router.all('/proxy', async (req, res) => {
  try {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const sanitizedUrl = sanitizeUrl(targetUrl);
    logRequest(req.method, sanitizedUrl, req.body);

    const axiosConfig = {
      method: req.method,
      url: sanitizedUrl,
      headers: DEFAULT_HEADERS,
      timeout: REQUEST_TIMEOUT
    };

    // Add body for POST requests
    if (req.method === 'POST') {
      axiosConfig.data = req.body;
    }

    const response = await axios(axiosConfig);
    res.json(response.data);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(500).json(errorResponse);
  }
});

export default router;