import { z } from 'zod';

const WLONodeSchema = z.object({
  properties: z.record(z.array(z.string())).optional(),
  preview: z.object({
    url: z.string().optional()
  }).optional()
});

const WLOResponseSchema = z.object({
  nodes: z.array(WLONodeSchema).optional(),
  pagination: z.object({
    total: z.number(),
    from: z.number(),
    count: z.number()
  }).optional()
});

export type WLOSearchParams = {
  properties: string[];
  values: string[];
  maxItems?: number;
  skipCount?: number;
  propertyFilter?: string;
  endpoint: string;
  combineMode?: 'OR' | 'AND';
};

const TIMEOUT = 60000; // 60 seconds timeout

export async function searchWLO({
  properties,
  values,
  maxItems = 5,
  skipCount = 0,
  propertyFilter = '-all-',
  endpoint,
  combineMode = 'OR'
}: WLOSearchParams) {
  const params = new URLSearchParams();
  params.append('contentType', 'FILES');
  params.append('combineMode', combineMode);
  
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    console.log('Making WLO API request:', {
      properties,
      values,
      maxItems,
      skipCount,
      propertyFilter,
      combineMode,
      endpoint
    });

    // Direkter API-Aufruf
    const response = await fetch(`${endpoint}/search/v1/custom/-home-?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('WLO API Response:', data);

    const parsed = WLOResponseSchema.safeParse(data);
    if (!parsed.success) {
      console.error('WLO API Response Parse Error:', parsed.error);
      throw new Error(`Invalid response format: ${parsed.error.message}`);
    }

    const nodes = parsed.data.nodes?.map(node => {
      const nodeId = node.properties?.['sys:node-uuid']?.[0];
      if (!nodeId) {
        console.warn('Node missing sys:node-uuid:', node);
        return null;
      }
      return {
        ...node,
        nodeId
      };
    }).filter((node): node is NonNullable<typeof node> => node !== null) || [];

    return {
      ...parsed.data,
      nodes
    };
  } catch (error) {
    console.error('Error searching WLO:', error);
    throw error;
  }
}