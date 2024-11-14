import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/api/wlo/search', async (req, res) => {
  try {
    const { endpoint, ...params } = req.query;
    const searchParams = new URLSearchParams(params);
    
    const response = await fetch(
      `${endpoint}/search/v1/custom/-home-?${searchParams.toString()}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});