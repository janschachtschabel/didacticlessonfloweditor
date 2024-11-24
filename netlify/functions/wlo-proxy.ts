import { Handler } from '@netlify/functions';
import axios from 'axios';

const API_ENDPOINTS = {
  PRODUCTION: 'https://redaktion.openeduhub.net/edu-sharing/rest',
  STAGING: 'https://repository.staging.openeduhub.net/edu-sharing/rest'
};

function sanitizeUrl(url: string): string {
  return url.replace(/,/g, ' ');
}

export const handler: Handler = async (event) => {
  // Only proceed if WLO_PROXY_ENABLED is true
  if (process.env.WLO_PROXY_ENABLED !== 'true') {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: 'WLO proxy is not enabled. Please enable it in your Netlify environment variables.'
      })
    };
  }

  try {
    const targetUrl = event.queryStringParameters?.url;
    
    if (!targetUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'URL parameter is required' })
      };
    }

    const sanitizedUrl = sanitizeUrl(targetUrl);

    const response = await axios.get(sanitizedUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'WLO-KI-Editor'
      },
      timeout: 60000
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Proxy request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};