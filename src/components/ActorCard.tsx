import { Actor } from '../store/templateStore';

interface ActorCardProps {
  actor: Actor;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActorCard({ actor, onEdit, onDelete }: ActorCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{actor.name || 'Unnamed Actor'}</h3>
          <p className="text-sm text-gray-500 capitalize">{actor.type}</p>
          <div className="mt-2 space-y-2">
            <p className="text-sm">
              <span className="font-medium">Education:</span> {actor.education.education_level}
            </p>
            <p className="text-sm">
              <span className="font-medium">Languages:</span>{' '}
              {actor.competencies.language_skills.languages.join(', ')}
            </p>
          </div>
        </div>
        <div className="space-x-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm bg-blue-100 rounded hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm bg-red-100 rounded hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}