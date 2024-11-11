import { FC } from 'react';
import { useTemplateStore } from '../../store/templateStore';
import { Editor } from '../Editor';

export const RawData: FC = () => {
  const state = useTemplateStore();
  
  const currentTemplate = {
    metadata: state.metadata,
    problem: state.problem,
    context: state.context,
    influence_factors: state.influence_factors,
    solution: state.solution,
    consequences: state.consequences,
    implementation_notes: state.implementation_notes,
    related_patterns: state.related_patterns,
    feedback: state.feedback,
    sources: state.sources,
    actors: state.actors,
    environments: state.environments
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Raw Data</h2>
      <div className="h-[500px] border rounded-lg overflow-hidden">
        <Editor
          value={JSON.stringify(currentTemplate, null, 2)}
          onChange={() => {}}
        />
      </div>
    </div>
  );
};