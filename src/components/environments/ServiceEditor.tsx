import { useState } from 'react';
import type { Service } from '../../store/templateStore';
import { FilterEditor } from './FilterEditor';

interface ServiceEditorProps {
  service: Service;
  onUpdate: (updates: Partial<Service>) => void;
  onDelete: () => void;
  isNew?: boolean;
}

export function ServiceEditor({ service, onUpdate, onDelete, isNew = false }: ServiceEditorProps) {
  const [isEditing, setIsEditing] = useState(isNew);

  if (!isEditing) {
    return (
      <div className="border rounded-lg p-4 mb-4 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{service.name || 'Unbenannter Dienst'}</h4>
            <p className="text-sm text-gray-600">{service.service_type}</p>
            <p className="text-sm text-gray-500">Quelle: {service.source}</p>
            {service.access_link && (
              <p className="text-sm text-gray-500">Link: {service.access_link}</p>
            )}
            {service.source === 'database' && service.database_id && (
              <p className="text-sm text-gray-500">Datenbank-ID: {service.database_id}</p>
            )}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-blue-100 rounded hover:bg-blue-200"
            >
              Bearbeiten
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-100 rounded hover:bg-red-200"
            >
              Löschen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={service.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full p-2 border rounded"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Typ</label>
        <input
          type="text"
          value={service.service_type}
          onChange={(e) => onUpdate({ service_type: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="z.B. Förderung, Beratung, Cloud-Dienst, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Zugangslink</label>
        <input
          type="text"
          value={service.access_link}
          onChange={(e) => onUpdate({ access_link: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Quelle</label>
        <select
          value={service.source}
          onChange={(e) => onUpdate({ source: e.target.value as Service['source'] })}
          className="w-full p-2 border rounded"
        >
          <option value="manual">Manuell</option>
          <option value="database">Datenbank</option>
          <option value="filter">Filter</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Datenbank-ID</label>
        <input
          type="text"
          value={service.database_id || ''}
          onChange={(e) => onUpdate({ database_id: e.target.value })}
          className="w-full p-2 border rounded"
          disabled={service.source !== 'database'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Filterkriterien</label>
        <FilterEditor
          filter={service.filter_criteria || {}}
          onChange={(filter) => onUpdate({ filter_criteria: filter })}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => {
            if (isNew) {
              onDelete();
            } else {
              setIsEditing(false);
            }
          }}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Abbrechen
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Speichern
        </button>
      </div>
    </div>
  );
}