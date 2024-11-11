import { useTemplateStore } from '../store/templateStore';
import { PhaseEditor } from '../components/course/PhaseEditor';

export function CourseFlow() {
  const { 
    solution, 
    setSolution,
    actors,
    environments
  } = useTemplateStore();

  const handleAddSequence = () => {
    const sequences = solution.didactic_template.learning_sequences || [];
    setSolution({
      ...solution,
      didactic_template: {
        ...solution.didactic_template,
        learning_sequences: [
          ...sequences,
          {
            sequence_id: `LS${sequences.length + 1}`,
            sequence_name: '',
            time_frame: '',
            learning_goal: '',
            phases: [],
            prerequisite_learningsequence: null,
            transition_type: 'sequential',
            condition_description: null,
            next_learningsequence: []
          }
        ]
      }
    });
  };

  const handleUpdateSequence = (index: number, updates: any) => {
    const newSolution = { ...solution };
    const sequence = newSolution.didactic_template.learning_sequences[index];
    Object.assign(sequence, updates);
    setSolution(newSolution);
  };

  const handleAddPhase = (sequenceIndex: number) => {
    const newSolution = { ...solution };
    const sequence = newSolution.didactic_template.learning_sequences[sequenceIndex];
    sequence.phases = sequence.phases || [];
    sequence.phases.push({
      phase_id: `P${sequence.phases.length + 1}`,
      phase_name: '',
      time_frame: '',
      learning_goal: '',
      activities: [],
      prerequisite_phase: null,
      transition_type: 'sequential',
      condition_description: null,
      next_phase: null
    });
    setSolution(newSolution);
  };

  const handleUpdatePhase = (sequenceIndex: number, phaseIndex: number, updates: any) => {
    const newSolution = { ...solution };
    const phase = newSolution.didactic_template.learning_sequences[sequenceIndex].phases[phaseIndex];
    Object.assign(phase, updates);
    setSolution(newSolution);
  };

  const handleDeletePhase = (sequenceIndex: number, phaseIndex: number) => {
    const newSolution = { ...solution };
    const sequence = newSolution.didactic_template.learning_sequences[sequenceIndex];
    sequence.phases.splice(phaseIndex, 1);
    setSolution(newSolution);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Course Flow</h1>

      <div className="space-y-6">
        {solution.didactic_template?.learning_sequences?.map((sequence, sequenceIndex) => (
          <div key={sequence.sequence_id} className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              {/* Learning Sequence Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sequence Name</label>
                  <input
                    type="text"
                    value={sequence.sequence_name}
                    onChange={(e) => handleUpdateSequence(sequenceIndex, { sequence_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Frame</label>
                  <input
                    type="text"
                    value={sequence.time_frame}
                    onChange={(e) => handleUpdateSequence(sequenceIndex, { time_frame: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Learning Goal</label>
                <textarea
                  value={sequence.learning_goal}
                  onChange={(e) => handleUpdateSequence(sequenceIndex, { learning_goal: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prerequisite Sequence</label>
                  <select
                    value={sequence.prerequisite_learningsequence || ''}
                    onChange={(e) => handleUpdateSequence(sequenceIndex, { 
                      prerequisite_learningsequence: e.target.value || null 
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">None</option>
                    {solution.didactic_template.learning_sequences
                      .filter((_, idx) => idx !== sequenceIndex)
                      .map(seq => (
                        <option key={seq.sequence_id} value={seq.sequence_id}>
                          {seq.sequence_name || seq.sequence_id}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Transition Type</label>
                  <select
                    value={sequence.transition_type}
                    onChange={(e) => handleUpdateSequence(sequenceIndex, { transition_type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="sequential">Sequential</option>
                    <option value="parallel">Parallel</option>
                    <option value="conditional">Conditional</option>
                    <option value="all_completed">All Completed</option>
                    <option value="one_of">One Of</option>
                  </select>
                </div>
              </div>

              {sequence.transition_type === 'conditional' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Condition Description</label>
                  <textarea
                    value={sequence.condition_description || ''}
                    onChange={(e) => handleUpdateSequence(sequenceIndex, { 
                      condition_description: e.target.value || null 
                    })}
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Phases */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Phases</h3>
                  <button
                    onClick={() => handleAddPhase(sequenceIndex)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Phase
                  </button>
                </div>

                <div className="space-y-4">
                  {sequence.phases?.map((phase, phaseIndex) => (
                    <PhaseEditor
                      key={phase.phase_id}
                      phase={phase}
                      actors={actors}
                      environments={environments}
                      onUpdate={(updates) => handleUpdatePhase(sequenceIndex, phaseIndex, updates)}
                      onDelete={() => handleDeletePhase(sequenceIndex, phaseIndex)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddSequence}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Learning Sequence
      </button>
    </div>
  );
}