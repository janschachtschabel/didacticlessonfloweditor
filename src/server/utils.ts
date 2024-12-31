export function sanitizeUrl(url: string): string {
  return url.replace(/,/g, ' ');
}

export function logRequest(method: string, url: string, body?: any) {
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  if (body) {
    console.log('Request body:', JSON.stringify(body, null, 2));
  }
}

export function handleError(error: any) {
  console.error('Proxy error:', error);
  return {
    error: 'Proxy request failed',
    details: error instanceof Error ? error.message : 'Unknown error'
  };
}