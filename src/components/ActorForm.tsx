import { useState } from 'react';
import type { Actor, ActorType, MotivationType, MotivationLevel } from '../store/templateStore';

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
        return !value ? 'Name ist erforderlich' : '';
      case 'age':
        return value && (isNaN(value) || value < 0) ? 'Alter muss eine positive Zahl sein' : '';
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
          <label className="block text-sm font-medium mb-1">Typ</label>
          <select
            value={actor.type}
            onChange={(e) => onUpdate({ type: e.target.value as ActorType })}
            className="w-full p-2 border rounded"
          >
            <option value="Einzelperson">Einzelperson</option>
            <option value="Gruppe">Gruppe</option>
            <option value="KI">KI</option>
          </select>
        </div>
      </div>

      {/* Demografische Daten */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Demografische Daten</h3>
        <div className="grid grid-cols-2 gap-4">
          {actor.type === 'Gruppe' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Altersbereich</label>
                <input
                  type="text"
                  value={actor.demographic_data.age_range || ''}
                  onChange={(e) => handleInputChange(e, 'age_range', 'demographic_data')}
                  className="w-full p-2 border rounded"
                  placeholder="z.B. 14-16"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Geschlechterverteilung</label>
                <input
                  type="text"
                  value={actor.demographic_data.gender_distribution || ''}
                  onChange={(e) => handleInputChange(e, 'gender_distribution', 'demographic_data')}
                  className="w-full p-2 border rounded"
                  placeholder="z.B. gemischt"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Alter</label>
                <input
                  type="number"
                  value={actor.demographic_data.age || ''}
                  onChange={(e) => handleInputChange(e, 'age', 'demographic_data')}
                  className={`w-full p-2 border rounded ${errors.age ? 'border-red-500' : ''}`}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Geschlecht</label>
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
            <label className="block text-sm font-medium mb-1">Ethnischer Hintergrund</label>
            <input
              type="text"
              value={actor.demographic_data.ethnic_background}
              onChange={(e) => handleInputChange(e, 'ethnic_background', 'demographic_data')}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Bildung */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Bildung</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bildungsniveau</label>
            <input
              type="text"
              value={actor.education.education_level}
              onChange={(e) => handleInputChange(e, 'education_level', 'education')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Klassenstufe</label>
            <input
              type="text"
              value={actor.education.class_level}
              onChange={(e) => handleInputChange(e, 'class_level', 'education')}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Fachlicher Schwerpunkt</label>
            <input
              type="text"
              value={actor.education.subject_focus}
              onChange={(e) => handleInputChange(e, 'subject_focus', 'education')}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Kompetenzen */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Kompetenzen</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fachkompetenzen</label>
            <input
              type="text"
              value={actor.competencies.subject_competencies.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'subject_competencies', 'competencies')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kognitive Kompetenzen</label>
            <input
              type="text"
              value={actor.competencies.cognitive_competencies.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'cognitive_competencies', 'competencies')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Methodische Kompetenzen</label>
            <input
              type="text"
              value={actor.competencies.methodical_competencies.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'methodical_competencies', 'competencies')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Affektive Kompetenzen</label>
            <input
              type="text"
              value={actor.competencies.affective_competencies.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'affective_competencies', 'competencies')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Digitale Kompetenzen</label>
            <input
              type="text"
              value={actor.competencies.digital_competencies.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'digital_competencies', 'competencies')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
          
          {/* Sprachkenntnisse */}
          <div>
            <label className="block text-sm font-medium mb-1">Sprachen</label>
            <input
              type="text"
              value={actor.competencies.language_skills.languages.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'languages', 'language_skills')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste der Sprachen"
            />
          </div>
        </div>
      </div>

      {/* Lernanforderungen */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Lernanforderungen</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Lernpräferenzen</label>
            <input
              type="text"
              value={actor.learning_requirements.learning_preferences.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'learning_preferences', 'learning_requirements')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Besondere Bedürfnisse</label>
            <input
              type="text"
              value={actor.learning_requirements.special_needs.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'special_needs', 'learning_requirements')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Technische Anforderungen</label>
            <input
              type="text"
              value={actor.learning_requirements.technical_requirements.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'technical_requirements', 'learning_requirements')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
        </div>
      </div>

      {/* Interessen und Ziele */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Interessen und Ziele</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Interessen</label>
            <input
              type="text"
              value={actor.interests_and_goals.interests.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'interests', 'interests_and_goals')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ziele</label>
            <input
              type="text"
              value={actor.interests_and_goals.goals.join(', ')}
              onChange={(e) => handleArrayInput(e.target.value, 'goals', 'interests_and_goals')}
              className="w-full p-2 border rounded"
              placeholder="Kommagetrennte Liste"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Motivationstyp</label>
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
                <option value="intrinsic">Intrinsisch</option>
                <option value="extrinsic">Extrinsisch</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Motivationsniveau</label>
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
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sozialstruktur */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Sozialstruktur</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Gruppengröße</label>
            <input
              type={actor.type === 'Gruppe' ? 'text' : 'number'}
              value={actor.social_structure.group_size}
              onChange={(e) => onUpdate({
                social_structure: {
                  ...actor.social_structure,
                  group_size: actor.type === 'Gruppe' ? e.target.value : parseInt(e.target.value)
                }
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Heterogenität</label>
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
          Abbrechen
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={Object.keys(errors).some(key => errors[key])}
        >
          Speichern
        </button>
      </div>
    </div>
  );
}