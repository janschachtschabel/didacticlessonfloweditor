import { useTemplateStore } from '../store/templateStore';
import { useState } from 'react';
import type { Actor } from '../store/templateStore';
import { ActorForm } from '../components/ActorForm';
import { ActorCard } from '../components/ActorCard';
import { SaveLoad } from '../components/SaveLoad';

const defaultActor: Actor = {
  id: '',
  name: '',
  type: 'Einzelperson',
  demographic_data: {
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

export function Actors() {
  const { actors = [], addActor, updateActor, removeActor } = useTemplateStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddActor = () => {
    const actorNumber = actors.length + 1;
    const actorId = `actor-${actorNumber}`;
    
    const newActor: Actor = {
      ...defaultActor,
      id: actorId
    };

    addActor(newActor);
    setEditingId(actorId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Akteure</h1>
        <SaveLoad />
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-lg shadow-sm mb-8">
        <p className="text-teal-900">
          Definieren Sie hier die verschiedenen Akteure Ihres Unterrichtsszenarios. Dies können Einzelpersonen (z.B. Lehrkräfte), 
          Gruppen (z.B. Lernende) oder auch KI-Systeme sein. Für jeden Akteur können Sie detaillierte Profile mit Lernvoraussetzungen, 
          Kompetenzen und spezifischen Bedürfnissen erstellen. Diese Informationen ermöglichen es, personalisierte und inklusive 
          Unterrichtsabläufe zu gestalten, die optimal auf die Beteiligten abgestimmt sind. Definieren Sie sowohl die lehrenden 
          als auch die lernenden Akteure - von der einzelnen Lehrkraft bis hin zu verschiedenen Lerngruppen mit unterschiedlichen 
          Voraussetzungen.
        </p>
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

      <button
        onClick={handleAddActor}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Akteur hinzufügen
      </button>
    </div>
  );
}