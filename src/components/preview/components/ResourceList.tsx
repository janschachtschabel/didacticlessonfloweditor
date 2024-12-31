import React from 'react';
import { ResourceLink } from './ResourceLink';
import { HoverCard } from './HoverCard';

interface ResourceListProps {
  resources: any[];
  type: string;
  onResourceClick: (resources: any[]) => void;
}

export function ResourceList({ 
  resources, 
  type,
  onResourceClick
}: ResourceListProps) {
  // Group resources by whether they have metadata
  const resourcesWithMetadata = resources.filter(r => r.wlo_metadata);
  const regularResources = resources.filter(r => !r.wlo_metadata);
  const hasMetadata = resourcesWithMetadata.length > 0;

  return (
    <div className="relative">
      <div className={`text-sm ${hasMetadata ? 'cursor-pointer' : ''}`}>
        <span className="text-gray-600">{type}:</span>{' '}
        {resources.map((resource, idx) => (
          <span key={`${resource.id}-${idx}`}>
            {idx > 0 && ', '}
            <ResourceLink 
              resource={resource} 
              onClick={() => resource.wlo_metadata && onResourceClick([resource])} 
            />
          </span>
        ))}
      </div>
    </div>
  );
}