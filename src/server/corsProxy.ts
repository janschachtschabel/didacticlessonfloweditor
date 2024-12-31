import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Sanitize URL by replacing commas with spaces
function sanitizeUrl(url: string): string {
  return url.replace(/,/g, ' ');
}

// Main proxy endpoint
app.get('/proxy', async (req, res) => {
  try {
    const targetUrl = req.query.url as string;
    
    if (!targetUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const sanitizedUrl = sanitizeUrl(targetUrl);
    console.log('Proxying request to:', sanitizedUrl);

    const response = await axios.get(sanitizedUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WLO-KI-Editor'
      },
      timeout: 60000 // 60 seconds timeout
    });

    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy request failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});