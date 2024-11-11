import { useTemplateStore } from '../store/templateStore';
import { useState } from 'react';
import type { Actor } from '../store/templateStore';
import { ActorForm } from '../components/ActorForm';
import { ActorCard } from '../components/ActorCard';

export function Actors() {
  const { actors, addActor, updateActor, removeActor } = useTemplateStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddActor = () => {
    const newActor: Actor = {
      id: `actor-${Date.now()}`,
      name: '',
      type: 'human',
      demographic_data: {
        age: '',
        gender: '',
        ethnic_background: '',
      },
      education: {
        education_level: '',
        class_level: '',
        subject_focus: '',
      },
      competencies: {
        subject_competencies: [],
        cognitive_competencies: [],
        methodical_competencies: [],
        affective_competencies: [],
        digital_competencies: [],
        language_skills: {
          languages: [],
          proficiency_levels: {},
        },
      },
      social_form: '',
      learning_requirements: {
        learning_preferences: [],
        special_needs: [],
        technical_requirements: [],
      },
      interests_and_goals: {
        interests: [],
        goals: [],
        motivation: {
          type: 'intrinsic',
          level: 'medium',
        },
      },
      social_structure: {
        group_size: 1,
        heterogeneity: 'n/a',
      },
    };
    addActor(newActor);
    setEditingId(newActor.id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Actors</h1>
        <button
          onClick={handleAddActor}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Actor
        </button>
      </div>

      <div className="space-y-6">
        {actors.map((actor) => (
          <div key={actor.id}>
            {editingId === actor.id ? (
              <ActorForm
                actor={actor}
                onUpdate={(updates) => updateActor(actor.id, updates)}
                onCancel={() => setEditingId(null)}
                onSave={() => setEditingId(null)}
              />
            ) : (
              <ActorCard
                actor={actor}
                onEdit={() => setEditingId(actor.id)}
                onDelete={() => removeActor(actor.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}