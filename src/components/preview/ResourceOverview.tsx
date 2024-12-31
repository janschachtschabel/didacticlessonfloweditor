import React from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { ResourceGrid } from './ResourceGrid';
import { ResourceCard } from './components/ResourceCard';

export function ResourceOverview() {
  const state = useTemplateStore();

  // Group resources by type
  const groupResources = () => {
    const groups = {
      materials: [] as any[],
      tools: [] as any[],
      services: [] as any[]
    };
    
    state.environments?.forEach(env => {
      env.materials?.forEach(material => {
        if (material.wlo_metadata) {
          groups.materials.push(material);
        }
      });

      env.tools?.forEach(tool => {
        if (tool.wlo_metadata) {
          groups.tools.push(tool);
        }
      });

      env.services?.forEach(service => {
        if (service.wlo_metadata) {
          groups.services.push(service);
        }
      });
    });

    return groups;
  };

  const resourceGroups = groupResources();
  const hasResources = Object.values(resourceGroups).some(group => group.length > 0);

  if (!hasResources) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">WLO Ressourcen</h2>
        <p className="text-gray-500">Keine WLO Ressourcen verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-6">WLO Ressourcen</h2>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Lernressourcen</h3>
          <div className="space-y-4">
            {resourceGroups.materials.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Werkzeuge</h3>
          <div className="space-y-4">
            {resourceGroups.tools.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dienste</h3>
          <div className="space-y-4">
            {resourceGroups.services.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}