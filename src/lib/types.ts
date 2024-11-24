import { z } from 'zod';

// Add WLO metadata type
export interface WLOMetadata {
  title: string;
  keywords: string[];
  description: string;
  subject: string;
  educationalContext: string[];
  wwwUrl: string | null;
  previewUrl: string | null;
}

// Update existing types to include WLO metadata
export interface Material {
  id: string;
  name: string;
  material_type: string;
  source: 'manual' | 'database' | 'filter';
  access_link: string;
  database_id?: string;
  filter_criteria?: Record<string, string>;
  wlo_metadata?: WLOMetadata;
}

export interface Tool {
  id: string;
  name: string;
  tool_type: string;
  source: 'manual' | 'database' | 'filter';
  access_link: string;
  database_id?: string;
  filter_criteria?: Record<string, string>;
  wlo_metadata?: WLOMetadata;
}

export interface Service {
  id: string;
  name: string;
  service_type: string;
  source: 'manual' | 'database' | 'filter';
  access_link: string;
  database_id?: string;
  filter_criteria?: Record<string, string>;
  wlo_metadata?: WLOMetadata;
}