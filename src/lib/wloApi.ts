import axios from 'axios';

export interface WLOSearchParams {
  properties: string[];
  values: string[];
  maxItems?: number;
  skipCount?: number;
  propertyFilter?: string;
  endpoint: string;
  combineMode?: 'OR' | 'AND';
  signal?: AbortSignal;
}

function getProxyUrl(): string {
  return 'http://localhost:3001/proxy';
}

export async function searchWLO({
  properties,
  values,
  maxItems = 5,
  skipCount = 0,
  propertyFilter = '-all-',
  endpoint,
  combineMode = 'AND',
  signal
}: WLOSearchParams) {
  const params = new URLSearchParams();
  params.append('contentType', 'FILES');
  params.append('combineMode', combineMode);
  
  // Add properties and values individually to avoid comma issues
  properties.forEach((prop) => {
    params.append('property', prop);
  });
  values.forEach((value) => {
    params.append('value', value);
  });
  
  params.append('maxItems', maxItems.toString());
  params.append('skipCount', skipCount.toString());
  params.append('propertyFilter', propertyFilter);

  try {
    const proxyUrl = getProxyUrl();
    const targetUrl = `${endpoint}/search/v1/custom/-home-?${params.toString()}`;
    const fullUrl = `${proxyUrl}?url=${encodeURIComponent(targetUrl)}`;

    console.log('Making WLO request:', fullUrl);

    const response = await axios.get(fullUrl, {
      headers: {
        'Accept': 'application/json'
      },
      signal
    });

    return response.data;
  } catch (error) {
    console.error('Error searching WLO:', error);
    throw error;
  }
}