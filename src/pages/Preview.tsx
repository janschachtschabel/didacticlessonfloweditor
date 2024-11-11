import { FlowGraph } from '../components/preview/FlowGraph';
import { TableView } from '../components/preview/TableView';
import { RawData } from '../components/preview/RawData';

export function Preview() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Preview</h1>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Graph View</h2>
        <FlowGraph />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Table View</h2>
        <TableView />
      </div>

      <RawData />
    </div>
  );
}