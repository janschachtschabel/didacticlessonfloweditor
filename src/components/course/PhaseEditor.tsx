import { useState } from 'react';
import { Phase, Actor, LearningEnvironment } from '../../store/templateStore';
import { ActivityEditor } from './ActivityEditor';

interface PhaseEditorProps {
  phase: Phase;
  actors: Actor[];
  environments: LearningEnvironment[];
  onUpdate: (updates: Partial<Phase>) => void;
  onDelete: () => void;
}

export function PhaseEditor({
  phase,
  actors,
  environments,
  onUpdate,
  onDelete
}: PhaseEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddActivity = () => {
    const newActivity = {
      activity_id: `A${(phase.activities?.length || 0) + 1}`,
      name: '',
      description: '',
      duration: 0,
      roles: [],
      goal: '',
      prerequisite_activity: null,
      transition_type: 'sequential',
      condition_description: null,
      next_activity: [],
      assessment: {
        type: 'formative',
        methods: [],
        criteria: []
      }
    };

    onUpdate({
      activities: [...(phase.activities || []), newActivity]
    });
  };

  const handleUpdateActivity = (index: number, updates: any) => {
    const newActivities = [...(phase.activities || [])];
    newActivities[index] = { ...newActivities[index], ...updates };
    onUpdate({ activities: newActivities });
  };

  const handleDeleteActivity = (index: number) => {
    const newActivities = [...(phase.activities || [])];
    newActivities.splice(index, 1);
    onUpdate({ activities: newActivities });
  };

  return (
    <div className="border-l-2 border-blue-500 pl-4 mb-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-lg font-semibold"
          >
            <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
            {phase.phase_name || 'Unnamed Phase'}
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phase Name</label>
                <input
                  type="text"
                  value={phase.phase_name}
                  onChange={(e) => onUpdate({ phase_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time Frame</label>
                <input
                  type="text"
                  value={phase.time_frame}
                  onChange={(e) => onUpdate({ time_frame: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Learning Goal</label>
              <textarea
                value={phase.learning_goal}
                onChange={(e) => onUpdate({ learning_goal: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prerequisite Phase</label>
                <input
                  type="text"
                  value={phase.prerequisite_phase || ''}
                  onChange={(e) => onUpdate({ prerequisite_phase: e.target.value || null })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Next Phase</label>
                <input
                  type="text"
                  value={phase.next_phase || ''}
                  onChange={(e) => onUpdate({ next_phase: e.target.value || null })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Activities Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">Activities</h4>
                <button
                  onClick={handleAddActivity}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Activity
                </button>
              </div>

              <div className="space-y-4">
                {phase.activities?.map((activity, index) => (
                  <ActivityEditor
                    key={activity.activity_id}
                    activity={activity}
                    actors={actors}
                    environments={environments}
                    onUpdate={(updates) => handleUpdateActivity(index, updates)}
                    onDelete={() => handleDeleteActivity(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}