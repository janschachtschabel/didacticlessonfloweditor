import { useTemplateStore } from '../store/templateStore';

export function GeneralSettings() {
  const { metadata, setMetadata } = useTemplateStore();

  const handleKeywordsChange = (value: string) => {
    setMetadata({
      ...metadata,
      keywords: value.split(',').map(k => k.trim()).filter(k => k)
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Allgemeine Einstellungen</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titel</label>
            <input
              type="text"
              value={metadata.title || ''}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
            <textarea
              value={metadata.description || ''}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Schlüsselwörter (durch Komma getrennt)</label>
            <input
              type="text"
              value={(metadata.keywords || []).join(', ')}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Autor</label>
            <input
              type="text"
              value={metadata.author || ''}
              onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Version</label>
            <input
              type="text"
              value={metadata.version || '1.0'}
              onChange={(e) => setMetadata({ ...metadata, version: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}