import axios from 'axios';

export interface WLOSearchParams {
  properties: string[];
  values: string[];
  maxItems?: number;
  skipCount?: number;
  propertyFilter?: string;
  combineMode?: 'OR' | 'AND';
  signal?: AbortSignal;
}

export async function searchWLO({
  properties,
  values,
  maxItems = 5,
  skipCount = 0,
  propertyFilter = '-all-',
  combineMode = 'AND',
  signal
}: WLOSearchParams) {
  console.log('Starting WLO search with params:', {
    properties,
    values,
    maxItems,
    skipCount,
    propertyFilter,
    combineMode
  });

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

    console.log('Constructed search criteria:', criteria);

    const searchParams = new URLSearchParams({
      contentType: 'FILES',
      maxItems: maxItems.toString(),
      skipCount: skipCount.toString(),
      propertyFilter
    });

    const url = `/api/edu-sharing/rest/search/v1/queries/-home-/mds_oeh/ngsearch?${searchParams}`;
    console.log('Making request to:', url);

    // Helper function to fix preview URLs
    const fixPreviewUrl = (node: any) => {
      if (node.preview?.url) {
        // Check if URL already starts with http(s)
        if (!node.preview.url.startsWith('http')) {
          // Add base URL only if needed
          node.preview.url = `https://redaktion.openeduhub.net${node.preview.url}`;
        }
      }
      return node;
    };

    const response = await axios.post(
      url,
      { criteria },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'WLO-KI-Editor'
        },
        signal
      }
    );

    // Fix preview URLs in response
    if (response.data.nodes) {
      response.data.nodes = response.data.nodes.map(fixPreviewUrl);
    }

    console.log('Received response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          previewUrl: node.preview?.url || null,
          resourceType: node.properties['ccm:oeh_lrt_aggregated_DISPLAYNAME']?.[0] || 
                       node.properties['ccm:resourcetype_DISPLAYNAME']?.[0] || 
                       node.properties['ccm:oeh_lrt_aggregated']?.[0]?.split('/').pop() || 
                       'Lernressource'
        }
      });
      // Throw a more descriptive error
      throw new Error(`WLO API request failed: ${error.message} (${error.response?.status} ${error.response?.statusText})`);
    } else {
      console.error('Non-Axios error:', error);
      throw new Error('WLO API request failed: Unknown error occurred');
    }
  }
}