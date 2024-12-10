import React from 'react';
import { useTemplateStore } from '../../store/templateStore';
import type { Actor, Role, Activity, WLOMetadata } from '../../store/templateStore';

interface RoleInfo {
  role: Role;
  environmentName: string;
  materials: {
    name: string;
    metadata?: WLOMetadata;
    wwwUrl?: string | null;
    access_link?: string;
  }[];
  tools: {
    name: string;
    metadata?: WLOMetadata;
    wwwUrl?: string | null;
    access_link?: string;
  }[];
  services: {
    name: string;
    metadata?: WLOMetadata;
    wwwUrl?: string | null;
    access_link?: string;
  }[];
}

interface ActorRoles {
  [actorId: string]: RoleInfo[];
}

export function TableView() {
  const state = useTemplateStore();
  const sequences = state.solution?.didactic_template?.learning_sequences || [];
  const actors = state.actors || [];
  const environments = state.environments || [];

  if (!sequences.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Keine Lernsequenzen verfügbar.</p>
      </div>
    );
  }

  const getEnvironmentName = (environmentId: string) => {
    const environment = environments.find(env => env.id === environmentId);
    return environment?.name || 'Unbekannte Lernumgebung';
  };

  const getResourceNames = (environmentId: string, selectedIds: string[] = [], type: 'materials' | 'tools' | 'services') => {
    const environment = environments.find(env => env.id === environmentId);
    if (!environment) return [];
    
    return selectedIds
      .map(id => {
        const resource = environment[type].find(r => r.id === id);
        if (!resource) return null;
        return {
          name: resource.name,
          metadata: resource.wlo_metadata,
          wwwUrl: resource.wlo_metadata?.wwwUrl,
          access_link: resource.access_link
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  };

  const renderResourceLink = (name: string, url?: string | null) => {
    if (!url) return name;
    return (
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {name}
      </a>
    );
  };

  const renderWLORecommendations = (resources: { name: string; metadata?: WLOMetadata; wwwUrl?: string | null; access_link?: string }[]) => {
    const hasWLOMetadata = resources.some(r => r.metadata);
    if (!hasWLOMetadata) return null;

    return (
      <div className="mt-2">
        <div className="font-medium text-sm text-blue-600">WLO empfiehlt:</div>
        <ul className="list-inside text-sm space-y-1">
          {resources.map((resource, idx) => {
            if (!resource.metadata) return null;
            return (
              <li key={idx}>
                {renderResourceLink(
                  resource.metadata.title || resource.name,
                  resource.metadata.wwwUrl || resource.access_link
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktivitätsdetails
            </th>
            {actors.map(actor => (
              <th 
                key={actor.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {actor.name || 'Unbenannter Akteur'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sequences.map((sequence) => (
            <React.Fragment key={sequence.sequence_id}>
              <tr className="bg-blue-50">
                <td 
                  colSpan={actors.length + 1} 
                  className="px-6 py-4"
                >
                  <div className="font-medium">
                    {sequence.sequence_name || sequence.sequence_id}
                  </div>
                  <div className="text-sm text-gray-500">
                    Zeit: {sequence.time_frame}
                  </div>
                </td>
              </tr>

              {(sequence.phases || []).map((phase) => (
                <React.Fragment key={phase.phase_id}>
                  <tr className="bg-green-50">
                    <td 
                      colSpan={actors.length + 1} 
                      className="px-6 py-4 pl-8"
                    >
                      <div className="font-medium">
                        {phase.phase_name || phase.phase_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Zeit: {phase.time_frame}
                      </div>
                    </td>
                  </tr>

                  {(phase.activities || []).map((activity) => {
                    const actorRoles: ActorRoles = {};
                    
                    (activity.roles || []).forEach(role => {
                      if (!actorRoles[role.actor_id]) {
                        actorRoles[role.actor_id] = [];
                      }
                      
                      const env = role.learning_environment;
                      if (env) {
                        actorRoles[role.actor_id].push({
                          role,
                          environmentName: getEnvironmentName(env.environment_id),
                          materials: getResourceNames(env.environment_id, env.selected_materials, 'materials'),
                          tools: getResourceNames(env.environment_id, env.selected_tools, 'tools'),
                          services: getResourceNames(env.environment_id, env.selected_services, 'services')
                        });
                      }
                    });

                    return (
                      <tr key={activity.activity_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 pl-12">
                          <div className="font-medium">
                            {activity.name || activity.activity_id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            Dauer: {activity.duration} min
                          </div>
                        </td>
                        
                        {actors.map(actor => (
                          <td key={actor.id} className="px-6 py-4">
                            {actorRoles[actor.id]?.map((roleInfo, index) => (
                              <div key={`${roleInfo.role.role_name}-${index}`} className="mb-4">
                                <div className="font-medium">
                                  {roleInfo.role.role_name || 'Unbenannte Rolle'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {roleInfo.role.task_description}
                                </div>
                                <div className="mt-2 space-y-1">
                                  <div className="text-sm text-gray-600">
                                    Lernumgebung: {roleInfo.environmentName}
                                  </div>
                                  
                                  {roleInfo.materials.length > 0 && (
                                    <>
                                      <div className="text-sm text-gray-600">
                                        Lernressourcen: {roleInfo.materials.map((m, idx) => (
                                          <React.Fragment key={idx}>
                                            {idx > 0 && ', '}
                                            {renderResourceLink(m.name, m.wwwUrl || m.access_link)}
                                          </React.Fragment>
                                        ))}
                                      </div>
                                      {renderWLORecommendations(roleInfo.materials)}
                                    </>
                                  )}
                                  
                                  {roleInfo.tools.length > 0 && (
                                    <>
                                      <div className="text-sm text-gray-600">
                                        Werkzeuge: {roleInfo.tools.map((t, idx) => (
                                          <React.Fragment key={idx}>
                                            {idx > 0 && ', '}
                                            {renderResourceLink(t.name, t.wwwUrl || t.access_link)}
                                          </React.Fragment>
                                        ))}
                                      </div>
                                      {renderWLORecommendations(roleInfo.tools)}
                                    </>
                                  )}
                                  
                                  {roleInfo.services.length > 0 && (
                                    <>
                                      <div className="text-sm text-gray-600">
                                        Dienste: {roleInfo.services.map((s, idx) => (
                                          <React.Fragment key={idx}>
                                            {idx > 0 && ', '}
                                            {renderResourceLink(s.name, s.wwwUrl || s.access_link)}
                                          </React.Fragment>
                                        ))}
                                      </div>
                                      {renderWLORecommendations(roleInfo.services)}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}