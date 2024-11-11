import { useState } from 'react';
import { Activity, Assessment, Actor, LearningEnvironment } from '../../store/templateStore';
import { RoleEditor } from './RoleEditor';

interface ActivityEditorProps {
  activity: Activity;
  actors: Actor[];
  environments: LearningEnvironment[];
  onUpdate: (updates: Partial<Activity>) => void;
  onDelete: () => void;
}

const defaultAssessment: Assessment = {
  type: 'formative',
  methods: [],
  criteria: []
};

export function ActivityEditor({ 
  activity, 
  actors, 
  environments,
  onUpdate, 
  onDelete 
}: ActivityEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddRole = () => {
    const newRole = {
      role_name: '',
      actor_id: '',
      task_description: '',
      learning_environment: {
        environment_id: '',
        selected_materials: [],
        selected_tools: [],
        selected_services: []
      }
    };

    onUpdate({
      roles: [...(activity.roles || []), newRole]
    });
  };

  const handleUpdateRole = (index: number, updates: any) => {
    const newRoles = [...(activity.roles || [])];
    newRoles[index] = { ...newRoles[index], ...updates };
    onUpdate({ roles: newRoles });
  };

  const handleDeleteRole = (index: number) => {
    const newRoles = [...(activity.roles || [])];
    newRoles.splice(index, 1);
    onUpdate({ roles: newRoles });
  };

  const handleUpdateAssessment = (updates: Partial<Assessment>) => {
    onUpdate({
      assessment: {
        ...(activity.assessment || defaultAssessment),
        ...updates
      }
    });
  };

  const assessment = activity.assessment || defaultAssessment;

  return (
    <div className="border-l-2 border-green-500 pl-4 mb-4">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-lg font-semibold"
          >
            <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
            {activity.name || 'Unnamed Activity'}
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
                <label className="block text-sm font-medium text-gray-700">Activity Name</label>
                <input
                  type="text"
                  value={activity.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <input
                  type="number"
                  value={activity.duration}
                  onChange={(e) => onUpdate({ duration: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={activity.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Goal</label>
              <textarea
                value={activity.goal}
                onChange={(e) => onUpdate({ goal: e.target.value })}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prerequisite Activity</label>
                <input
                  type="text"
                  value={activity.prerequisite_activity || ''}
                  onChange={(e) => onUpdate({ prerequisite_activity: e.target.value || null })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Transition Type</label>
                <select
                  value={activity.transition_type}
                  onChange={(e) => onUpdate({ transition_type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="sequential">Sequential</option>
                  <option value="parallel">Parallel</option>
                  <option value="conditional">Conditional</option>
                  <option value="all_completed">All Completed</option>
                  <option value="one_of">One Of</option>
                </select>
              </div>
            </div>

            {activity.transition_type === 'conditional' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Condition Description</label>
                <textarea
                  value={activity.condition_description || ''}
                  onChange={(e) => onUpdate({ condition_description: e.target.value || null })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Assessment Section */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-medium mb-4">Assessment</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={assessment.type}
                    onChange={(e) => handleUpdateAssessment({ type: e.target.value as 'formative' | 'summative' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="formative">Formative</option>
                    <option value="summative">Summative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Methods (comma-separated)</label>
                  <input
                    type="text"
                    value={assessment.methods.join(', ')}
                    onChange={(e) => handleUpdateAssessment({
                      methods: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Criteria (comma-separated)</label>
                  <input
                    type="text"
                    value={assessment.criteria.join(', ')}
                    onChange={(e) => handleUpdateAssessment({
                      criteria: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Roles Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">Roles</h4>
                <button
                  onClick={handleAddRole}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Role
                </button>
              </div>

              <div className="space-y-4">
                {activity.roles?.map((role, index) => (
                  <RoleEditor
                    key={index}
                    role={role}
                    actors={actors}
                    environments={environments}
                    onUpdate={(updates) => handleUpdateRole(index, updates)}
                    onDelete={() => handleDeleteRole(index)}
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