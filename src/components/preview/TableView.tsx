import React from 'react';
import { useTemplateStore } from '../../store/templateStore';
import type { Actor, Role, Activity } from '../../store/templateStore';

interface RoleInfo {
  role: Role;
  environmentName: string;
  materials: string[];
  tools: string[];
  services: string[];
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
        return resource?.name || '';
      })
      .filter(Boolean);
  };

  const getTransitionInfo = (type: string, description: string | null) => {
    const transitionTypes: Record<string, string> = {
      'sequential': 'Sequenziell',
      'parallel': 'Parallel',
      'conditional': 'Bedingt',
      'branching': 'Verzweigung',
      'looping': 'Wiederholung',
      'optional': 'Optional',
      'feedback_loops': 'Feedback-Schleife',
      'all_completed': 'Alle abgeschlossen',
      'one_of': 'Eine von'
    };

    let info = transitionTypes[type] || type;
    if (description) {
      info += ` (${description})`;
    }
    return info;
  };

  const getSequenceName = (sequenceId: string) => {
    const sequence = sequences.find(s => s.sequence_id === sequenceId);
    return sequence?.sequence_name || sequence?.sequence_id || sequenceId;
  };

  const getPhaseName = (phaseId: string, currentSequence: typeof sequences[0]) => {
    const phase = currentSequence.phases?.find(p => p.phase_id === phaseId);
    return phase?.phase_name || phase?.phase_id || phaseId;
  };

  const findActivityById = (activityId: string): Activity | undefined => {
    for (const sequence of sequences) {
      for (const phase of sequence.phases || []) {
        const activity = phase.activities?.find(a => a.activity_id === activityId);
        if (activity) return activity;
      }
    }
    return undefined;
  };

  const getActivityName = (activityId: string) => {
    const activity = findActivityById(activityId);
    return activity?.name || activity?.activity_id || activityId;
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
                  <div className="text-sm text-gray-500">
                    Übergang: {getTransitionInfo(sequence.transition_type, sequence.condition_description)}
                  </div>
                  {sequence.prerequisite_learningsequences?.length > 0 && (
                    <div className="text-sm text-gray-500">
                      Voraussetzungen: {sequence.prerequisite_learningsequences
                        .map(prereqId => getSequenceName(prereqId))
                        .join(', ')}
                    </div>
                  )}
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
                      <div className="text-sm text-gray-500">
                        Übergang: {getTransitionInfo(phase.transition_type, phase.condition_description)}
                      </div>
                      {phase.prerequisite_phase && (
                        <div className="text-sm text-gray-500">
                          Voraussetzung: {getPhaseName(phase.prerequisite_phase, sequence)}
                        </div>
                      )}
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
                          <div className="text-sm text-gray-500">
                            Übergang: {getTransitionInfo(activity.transition_type, activity.condition_description)}
                          </div>
                          {activity.prerequisite_activity && (
                            <div className="text-sm text-gray-500">
                              Voraussetzung: {getActivityName(activity.prerequisite_activity)}
                            </div>
                          )}
                          {activity.is_optional && (
                            <div className="text-sm text-gray-500">
                              Optional
                            </div>
                          )}
                          {activity.repeat_until && (
                            <div className="text-sm text-gray-500">
                              Wiederholung bis: {activity.repeat_until}
                            </div>
                          )}
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
                                    <div className="text-sm text-gray-600">
                                      Lernressourcen: {roleInfo.materials.join(', ')}
                                    </div>
                                  )}
                                  {roleInfo.tools.length > 0 && (
                                    <div className="text-sm text-gray-600">
                                      Werkzeuge: {roleInfo.tools.join(', ')}
                                    </div>
                                  )}
                                  {roleInfo.services.length > 0 && (
                                    <div className="text-sm text-gray-600">
                                      Dienste: {roleInfo.services.join(', ')}
                                    </div>
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