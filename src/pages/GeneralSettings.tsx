import { useTemplateStore } from '../store/templateStore';
import { SaveLoad } from '../components/SaveLoad';

const defaultMetadata = {
  title: '',
  description: '',
  keywords: [],
  author: '',
  version: '1.0'
};

export function GeneralSettings() {
  const { metadata = defaultMetadata, setMetadata } = useTemplateStore();

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({
      ...metadata,
      keywords: e.target.value.split(',').map(k => k.trim())
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Allgemeines</h1>
        <SaveLoad />
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm mb-8">
        <p className="text-blue-800">
          Hier können Sie die allgemeinen Informationen Ihres didaktischen Templates festlegen. 
          Diese Metadaten helfen bei der Organisation und dem Auffinden des Templates.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titel</label>
            <input
              type="text"
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Geben Sie einen aussagekräftigen Titel ein"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
            <textarea
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Beschreiben Sie das Template und seine Ziele"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Schlüsselwörter (durch Komma getrennt)</label>
            <input
              type="text"
              value={metadata.keywords.join(', ')}
              onChange={handleKeywordsChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="z.B. Mathematik, Inklusion, Differenzierung"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Autor</label>
            <input
              type="text"
              value={metadata.author}
              onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Name oder Institution"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Version</label>
            <input
              type="text"
              value={metadata.version}
              onChange={(e) => setMetadata({ ...metadata, version: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="z.B. 1.0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}