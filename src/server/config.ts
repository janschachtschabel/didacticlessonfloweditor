export const PORT = process.env.PORT || 3001;

export const CORS_OPTIONS = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept']
};

export const REQUEST_TIMEOUT = 60000; // 60 seconds

export const DEFAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': 'WLO-KI-Editor'
};