import { useState } from 'react';
import { Actor, ActorType, MotivationType, MotivationLevel } from '../store/templateStore';

interface ActorFormProps {
  actor: Actor;
  onUpdate: (updates: Partial<Actor>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function ActorForm({ actor, onUpdate, onCancel, onSave }: ActorFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        return !value ? 'Name is required' : '';
      case 'age':
        return value && (isNaN(value) || value < 0) ? 'Age must be a positive number' : '';
      default:
        return '';
    }
  };

  const handleArrayInput = (value: string, field: string, parentField?: string) => {
    const array = value.split(',').map(item => item.trim()).filter(Boolean);
    if (parentField) {
      onUpdate({
        [parentField]: {
          ...actor[parentField as keyof Actor],
          [field]: array
        }
      });
    } else {
      onUpdate({ [field]: array });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: string,
    parentField?: string
  ) => {
    const { value } = e.target;
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));

    if (parentField) {
      onUpdate({
        [parentField]: {
          ...actor[parentField as keyof Actor],
          [field]: value
        }
      });
    } else {
      onUpdate({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={actor.name}
            onChange={(e) => handleInputChange(e, 'name')}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={actor.type}
            onChange={(e) => onUpdate({ type: e.target.value as ActorType })}
            className="w-full p-2 border rounded"
          >
            <option value="human">Human</option>
            <option value="group">Group</option>
            <option value="ai">AI</option>
          </select>
        </div>
      </div>

      {/* Demographic Data */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Demographic Data</h3>
        <div className="grid grid-cols-2 gap-4">
          {actor.type === 'group' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Age Range</label>
                <input
                  type="text"
                  value={actor.demographic_data.age_range || ''}
                  onChange={(e) => handleInputChange(e, 'age_range', 'demographic_data')}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 14-16"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender Distribution</label>
                <input
                  type="text"
                  value={actor.demographic_data.gender_distribution || ''}
                  onChange={(e) => handleInputChange(e, 'gender_distribution', 'demographic_data')}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., mixed"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={actor.demographic_data.age || ''}
                  onChange={(e) => handleInputChange(e, 'age', 'demographic_data')}
                  className={`w-full p-2 border rounded ${errors.age ? 'border-red-500' : ''}`}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <input
                  type="text"
                  value={actor.demographic_data.gender || ''}
                  onChange={(e) => handleInputChange(e, 'gender', 'demographic_data')}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          )}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Ethnic Background</label>
            <input
              type="text"
              value={actor.demographic_data.ethnic_background}
              onChange={(e) => handleInputChange(e, 'ethnic_background', 'demographic_data')}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Education</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Education Level</label>
            <input
              type="text"
              value={actor.education.education_level}
              onChange={(e) => handleInputChange(e, 'education_level', 'education')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Class Level</label>
            <input
              type="text"
              value={actor.education.class_level}
              onChange={(e) => handleInputChange(e, 'class_level', 'education')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Subject Focus</label>
            <input
              type="text"
              value={actor.education.subject_focus}
              onChange={(e) => handleInputChange(e, 'subject_focus', 'education')}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Competencies */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Competencies</h3>
        <div className="space-y-4">
          {['subject', 'cognitive', 'methodical', 'affective', 'digital'].map((type) => (
            <div key={type}>
              <label className="block text-sm font-medium mb-1">
                {type.charAt(0).toUpperCase() + type.slice(1)} Competencies
              </label>
              <input
                type="text"
                value={actor.competencies[`${type}_competencies` as keyof typeof actor.competencies].join(', ')}
                onChange={(e) => handleArrayInput(e.target.value, `${type}_competencies`, 'competencies')}
                className="w-full p-2 border rounded"
                placeholder="Enter comma-separated values"
              />
            </div>
          ))}
          
          {/* Language Skills */}
          <div>
            <label className="block text-sm font-medium mb-1">Languages</label>
            <input
              type="text"
              value={actor.competencies.language_skills.languages.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'languages', 'language_skills')}
              className="w-full p-2 border rounded"
              placeholder="Enter comma-separated languages"
            />
          </div>
        </div>
      </div>

      {/* Learning Requirements */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Learning Requirements</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Learning Preferences</label>
            <input
              type="text"
              value={actor.learning_requirements.learning_preferences.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'learning_preferences', 'learning_requirements')}
              className="w-full p-2 border rounded"
              placeholder="Enter comma-separated preferences"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Special Needs</label>
            <input
              type="text"
              value={actor.learning_requirements.special_needs.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'special_needs', 'learning_requirements')}
              className="w-full p-2 border rounded"
              placeholder="Enter comma-separated needs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Technical Requirements</label>
            <input
              type="text"
              value={actor.learning_requirements.technical_requirements.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'technical_requirements', 'learning_requirements')}
              className="w-full p-2 border rounded"
              placeholder="Enter comma-separated requirements"
            />
          </div>
        </div>
      </div>

      {/* Interests and Goals */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Interests and Goals</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Interests</label>
            <input
              type="text"
              value={actor.interests_and_goals.interests.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'interests', 'interests_and_goals')}
              className="w-full p-2 border rounded"
              placeholder="Enter comma-separated interests"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Goals</label>
            <input
              type="text"
              value={actor.interests_and_goals.goals.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'goals', 'interests_and_goals')}
              className="w-full p-2 border rounded"
              placeholder="Enter comma-separated goals"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Motivation Type</label>
              <select
                value={actor.interests_and_goals.motivation.type}
                onChange={(e) => onUpdate({
                  interests_and_goals: {
                    ...actor.interests_and_goals,
                    motivation: {
                      ...actor.interests_and_goals.motivation,
                      type: e.target.value as MotivationType
                    }
                  }
                })}
                className="w-full p-2 border rounded"
              >
                <option value="intrinsic">Intrinsic</option>
                <option value="extrinsic">Extrinsic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Motivation Level</label>
              <select
                value={actor.interests_and_goals.motivation.level}
                onChange={(e) => onUpdate({
                  interests_and_goals: {
                    ...actor.interests_and_goals,
                    motivation: {
                      ...actor.interests_and_goals.motivation,
                      level: e.target.value as MotivationLevel
                    }
                  }
                })}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Social Structure */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Social Structure</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Group Size</label>
            <input
              type={actor.type === 'group' ? 'text' : 'number'}
              value={actor.social_structure.group_size}
              onChange={(e) => onUpdate({
                social_structure: {
                  ...actor.social_structure,
                  group_size: actor.type === 'group' ? e.target.value : parseInt(e.target.value)
                }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Heterogeneity</label>
            <input
              type="text"
              value={actor.social_structure.heterogeneity}
              onChange={(e) => onUpdate({
                social_structure: {
                  ...actor.social_structure,
                  heterogeneity: e.target.value
                }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={Object.keys(errors).some(key => errors[key])}
        >
          Save
        </button>
      </div>
    </div>
  );
}