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
  try {
    // Construct the search criteria array
    const criteria = [];
    
    // Add title/search word as first criterion
    if (properties.includes('cclom:title') && values[0]) {
      criteria.push({
        property: 'ngsearchword',
        values: [values[0]]
      });
    }

    // Map old property names to new ones
    const propertyMapping: Record<string, string> = {
      'ccm:oeh_lrt_aggregated': 'ccm:oeh_lrt_aggregated',
      'ccm:taxonid': 'virtual:taxonid',
      'ccm:educationalcontext': 'ccm:educationalcontext'
    };

    // Add remaining criteria with mapped properties
    for (let i = 0; i < properties.length; i++) {
      if (properties[i] !== 'cclom:title' && values[i]) {
        criteria.push({
          property: propertyMapping[properties[i]] || properties[i],
          values: [values[i]]
        });
      }
    }

    const searchParams = new URLSearchParams({
      contentType: 'FILES',
      maxItems: maxItems.toString(),
      skipCount: skipCount.toString(),
      propertyFilter
    });

    const targetUrl = `${endpoint}/search/v1/queries/-home-/mds_oeh/ngsearch?${searchParams.toString()}`;
    const proxyUrl = `${getProxyUrl()}?url=${encodeURIComponent(targetUrl)}`;

    const response = await axios.post(proxyUrl, 
      { criteria },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error searching WLO:', error);
    throw error;
  }
}