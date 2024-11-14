import { FlowGraph } from './FlowGraph';
import { TableView } from './TableView';
import { RawData } from './RawData';
import { SaveLoad } from '../SaveLoad';

export function Preview() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Vorschau</h1>
        <SaveLoad />
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