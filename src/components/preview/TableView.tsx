import React, { useState, useCallback } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { RoleCell } from './components/RoleCell';
import { ResourceOverview } from './ResourceOverview';
import { ResourceCard } from './components/ResourceCard';

export function TableView() {
  const state = useTemplateStore();
  const sequences = state.solution?.didactic_template?.learning_sequences || [];
  const actors = state.actors || [];
  const environments = state.environments || [];
  const [selectedResources, setSelectedResources] = useState<any[]>([]);

  const handleResourceClick = useCallback((resources: any[]) => {
    setSelectedResources(resources);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <div className="flex-1 bg-white p-6 rounded-lg shadow overflow-x-auto">
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
              {sequences.map(sequence => (
                <React.Fragment key={sequence.sequence_id}>
                  {/* Sequence row */}
                  <tr className="bg-blue-50">
                    <td colSpan={actors.length + 1} className="px-6 py-4">
                      <div className="font-medium">
                        {sequence.sequence_name || sequence.sequence_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Zeit: {sequence.time_frame}
                      </div>
                    </td>
                  </tr>

                  {sequence.phases?.map(phase => (
                    <React.Fragment key={phase.phase_id}>
                      {/* Phase row */}
                      <tr className="bg-green-50">
                        <td colSpan={actors.length + 1} className="px-6 py-4 pl-8">
                          <div className="font-medium">
                            {phase.phase_name || phase.phase_id}
                          </div>
                          <div className="text-sm text-gray-500">
                            Zeit: {phase.time_frame}
                          </div>
                        </td>
                      </tr>

                      {/* Activity rows */}
                      {phase.activities?.map(activity => {
                        const actorRoles = {};
                        
                        // Process roles for each actor
                        activity.roles?.forEach(role => {
                          if (!actorRoles[role.actor_id]) {
                            actorRoles[role.actor_id] = [];
                          }

                          const env = environments.find(e => 
                            e.id === role.learning_environment?.environment_id
                          );

                          if (env) {
                            actorRoles[role.actor_id].push({
                              role,
                              environmentName: env.name,
                              materials: role.learning_environment?.selected_materials?.map(id => 
                                env.materials.find(m => m.id === id)
                              ).filter(Boolean) || [],
                              tools: role.learning_environment?.selected_tools?.map(id => 
                                env.tools.find(t => t.id === id)
                              ).filter(Boolean) || [],
                              services: role.learning_environment?.selected_services?.map(id => 
                                env.services.find(s => s.id === id)
                              ).filter(Boolean) || []
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
                                  <RoleCell
                                    key={`${roleInfo.role.role_name}-${index}`}
                                    roleInfo={roleInfo}
                                    onResourceClick={handleResourceClick}
                                  />
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

        {/* WLO Content Preview Panel */}
        <div className="w-[300px] bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">WLO Inhalte</h3>
          <div className="space-y-3">
            {selectedResources.length > 0 ? (
              selectedResources.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))
            ) : (
              <p className="text-gray-500">Klicken Sie auf einen WLO-Inhalt in der Tabelle, um Details anzuzeigen.</p>
            )}
          </div>
        </div>
      </div>

      <ResourceOverview />
    </div>
  );
}