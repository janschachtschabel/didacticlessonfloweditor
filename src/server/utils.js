export function sanitizeUrl(url) {
  return url.replace(/,/g, ' ');
}

export function logRequest(method, url, body) {
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  if (body) {
    console.log('Request body:', JSON.stringify(body, null, 2));
  }
}

export function handleError(error) {
  console.error('Proxy error:', error);
  return {
    error: 'Proxy request failed',
    details: error instanceof Error ? error.message : 'Unknown error'
  };
}