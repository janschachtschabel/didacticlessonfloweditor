import { FlowGraph } from './FlowGraph';
import { TableView } from './TableView';
import { RawData } from './RawData';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { generatePDF } from '../../lib/pdfGenerator';
import { useTemplateStore } from '../../store/templateStore';

export function Preview() {
  const state = useTemplateStore();

  const handleGeneratePDF = async () => {
    await generatePDF(state);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vorschau</h1>
        <button
          onClick={handleGeneratePDF}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <DocumentTextIcon className="w-5 h-5" />
          PDF generieren
        </button>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Graphansicht</h2>
        <FlowGraph />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Tabellenansicht</h2>
        <TableView />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Rohdaten</h2>
        <RawData />
      </div>
    </div>
  );
}