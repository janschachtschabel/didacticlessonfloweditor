import { useTemplateStore } from '../store/templateStore';
import { PhaseEditor } from '../components/course/PhaseEditor';
import type { LearningSequence, Phase } from '../store/templateStore';
import { SaveLoad } from '../components/SaveLoad';

export function CourseFlow() {
  const { 
    solution, 
    setSolution,
    actors,
    environments
  } = useTemplateStore();

  const handleAddSequence = () => {
    const sequences = solution.didactic_template.learning_sequences || [];
    const sequenceNumber = sequences.length + 1;
    const sequenceId = `LS${sequenceNumber}`;

    const newSequence: LearningSequence = {
      sequence_id: sequenceId,
      sequence_name: '',
      time_frame: '',
      learning_goal: '',
      phases: [],
      prerequisite_learningsequences: [],
      transition_type: 'sequential',
      condition_description: null,
      next_learningsequence: []
    };

    setSolution({
      ...solution,
      didactic_template: {
        ...solution.didactic_template,
        learning_sequences: [...sequences, newSequence]
      }
    });
  };

  const handleUpdateSequence = (index: number, updates: Partial<LearningSequence>) => {
    const newSolution = { ...solution };
    const sequences = newSolution.didactic_template.learning_sequences;
    const sequence = sequences[index];

    // If prerequisite sequences are being updated
    if ('prerequisite_learningsequences' in updates) {
      const oldPrereqs = sequence.prerequisite_learningsequences;
      const newPrereqs = updates.prerequisite_learningsequences || [];

      // Remove this sequence from old prerequisites' next list
      oldPrereqs.forEach(prereqId => {
        const oldPrereqSeq = sequences.find(s => s.sequence_id === prereqId);
        if (oldPrereqSeq) {
          oldPrereqSeq.next_learningsequence = oldPrereqSeq.next_learningsequence.filter(
            id => id !== sequence.sequence_id
          );
        }
      });

      // Add this sequence to new prerequisites' next list
      newPrereqs.forEach(prereqId => {
        const newPrereqSeq = sequences.find(s => s.sequence_id === prereqId);
        if (newPrereqSeq && !newPrereqSeq.next_learningsequence.includes(sequence.sequence_id)) {
          newPrereqSeq.next_learningsequence.push(sequence.sequence_id);
        }
      });
    }

    Object.assign(sequence, updates);
    setSolution(newSolution);
  };

  const handleAddPhase = (sequenceIndex: number) => {
    const newSolution = { ...solution };
    const sequence = newSolution.didactic_template.learning_sequences[sequenceIndex];
    const phaseNumber = sequence.phases.length + 1;
    const phaseId = `${sequence.sequence_id}-P${phaseNumber}`;

    const newPhase: Phase = {
      phase_id: phaseId,
      phase_name: '',
      time_frame: '',
      learning_goal: '',
      activities: [],
      prerequisite_phase: null,
      transition_type: 'sequential',
      condition_description: null,
      next_phase: null
    };
    sequence.phases = [...sequence.phases, newPhase];
    setSolution(newSolution);
  };

  const handleUpdatePhase = (sequenceIndex: number, phaseIndex: number, updates: Partial<Phase>) => {
    const newSolution = { ...solution };
    const sequence = newSolution.didactic_template.learning_sequences[sequenceIndex];
    const phases = sequence.phases;
    const phase = phases[phaseIndex];

    // If prerequisite phase is being updated
    if ('prerequisite_phase' in updates) {
      const oldPrereq = phase.prerequisite_phase;
      const newPrereq = updates.prerequisite_phase;

      // Remove this phase from old prerequisite's next phase
      if (oldPrereq) {
        const oldPrereqPhase = phases.find(p => p.phase_id === oldPrereq);
        if (oldPrereqPhase) {
          oldPrereqPhase.next_phase = null;
        }
      }

      // Set this phase as next phase for new prerequisite
      if (newPrereq) {
        const newPrereqPhase = phases.find(p => p.phase_id === newPrereq);
        if (newPrereqPhase) {
          newPrereqPhase.next_phase = phase.phase_id;
        }
      }
    }

    Object.assign(phase, updates);
    setSolution(newSolution);
  };

  const handleDeletePhase = (sequenceIndex: number, phaseIndex: number) => {
    const newSolution = { ...solution };
    const sequence = newSolution.didactic_template.learning_sequences[sequenceIndex];
    const phase = sequence.phases[phaseIndex];

    // Update relationships when deleting a phase
    if (phase.prerequisite_phase) {
      const prereqPhase = sequence.phases.find(p => p.phase_id === phase.prerequisite_phase);
      if (prereqPhase) {
        prereqPhase.next_phase = phase.next_phase;
      }
    }

    sequence.phases.splice(phaseIndex, 1);
    setSolution(newSolution);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Unterrichtsablauf</h1>
        <SaveLoad />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Elemente des Lernablaufs</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-blue-800">Lernsequenzen</h4>
              <p className="text-blue-700">
                Übergeordnete methodische Einheiten, die meist eine gesamte Lerneinheit umfassen. 
                Sie können flexibel verknüpft werden für Methodenwechsel oder parallele Lernpfade.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-blue-800">Phasen</h4>
              <p className="text-blue-700">
                Einzelne Abschnitte innerhalb einer Sequenz. Sie laufen immer nacheinander ab und 
                müssen abgeschlossen sein, bevor die nächste Phase beginnt.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-blue-800">Aktivitäten</h4>
              <p className="text-blue-700">
                Die kleinsten Einheiten im Prozessablauf. Sie können frei kombiniert werden und 
                enthalten die konkreten Lernhandlungen.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-blue-800">Rollen</h4>
              <p className="text-blue-700">
                Beschreiben die Aufgaben der Akteure in den Aktivitäten und sind mit Lernumgebungen 
                und Ressourcen verknüpft.
              </p>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-blue-800">Ablaufoptionen</h4>
              
              <div className="mt-2">
                <p className="text-blue-700 font-medium">Für Lernsequenzen:</p>
                <ul className="list-disc list-inside text-blue-600 ml-2">
                  <li>Sequenziell (nacheinander)</li>
                  <li>Parallel (gleichzeitig)</li>
                  <li>Bedingt (mit Bedingung)</li>
                </ul>
              </div>

              <div className="mt-2">
                <p className="text-blue-700 font-medium">Für Phasen:</p>
                <ul className="list-disc list-inside text-blue-600 ml-2">
                  <li>Sequenziell (nacheinander)</li>
                </ul>
              </div>

              <div className="mt-2">
                <p className="text-blue-700 font-medium">Für Aktivitäten:</p>
                <ul className="list-disc list-inside text-blue-600 ml-2">
                  <li>Sequenziell</li>
                  <li>Parallel</li>
                  <li>Bedingt</li>
                  <li>Verzweigung</li>
                  <li>Wiederholung</li>
                  <li>Optional</li>
                  <li>Feedback-Schleife</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-emerald-900 mb-4">Beispiel: Galeriemethode</h3>
          
          <div className="space-y-4">
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-800">Phase 1: Gruppenbildung</h4>
              <div className="mt-2 space-y-2">
                <p className="text-emerald-700 font-medium">Aktivität: Teams bilden</p>
                
                <div className="ml-4">
                  <div className="text-emerald-700">
                    <p className="font-medium">Rolle: Lehrkraft</p>
                    <ul className="list-disc list-inside ml-2 text-sm">
                      <li>Akteur: Frau Schmidt</li>
                      <li>Lernumgebung: Klassenzimmer</li>
                      <li>Ressourcen: Gruppeneinteilungskarten</li>
                    </ul>
                  </div>

                  <div className="mt-2 text-emerald-700">
                    <p className="font-medium">Rolle: Lernende</p>
                    <ul className="list-disc list-inside ml-2 text-sm">
                      <li>Akteur: Hauptlerngruppe</li>
                      <li>Lernumgebung: Klassenzimmer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-white bg-opacity-30 p-2 rounded">
                <p className="text-emerald-800">Phase 2: Input</p>
              </div>
              <div className="bg-white bg-opacity-30 p-2 rounded">
                <p className="text-emerald-800">Phase 3: Aufgabenstellung</p>
              </div>
              <div className="bg-white bg-opacity-30 p-2 rounded">
                <p className="text-emerald-800">Phase 4: Gruppenarbeit & Ausstellung</p>
              </div>
              <div className="bg-white bg-opacity-30 p-2 rounded">
                <p className="text-emerald-800">Phase 5: Auswertung</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {solution.didactic_template?.learning_sequences?.map((sequence, sequenceIndex) => (
          <div key={sequence.sequence_id} className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name der Sequenz</label>
                  <input
                    type="text"
                    value={sequence.sequence_name}
                    onChange={(e) => handleUpdateSequence(sequenceIndex, { sequence_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Zeitrahmen</label>
                  <input
                    type="text"
                    value={sequence.time_frame}
                    onChange={(e) => handleUpdateSequence(sequenceIndex, { time_frame: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Lernziel</label>
                <textarea
                  value={sequence.learning_goal}
                  onChange={(e) => handleUpdateSequence(sequenceIndex, { learning_goal: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Voraussetzende Sequenzen</label>
                <select
                  multiple
                  value={sequence.prerequisite_learningsequences}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    handleUpdateSequence(sequenceIndex, { 
                      prerequisite_learningsequences: selectedOptions
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  size={3}
                >
                  {solution.didactic_template.learning_sequences
                    .filter((_, idx) => idx !== sequenceIndex)
                    .map(seq => (
                      <option key={seq.sequence_id} value={seq.sequence_id}>
                        {seq.sequence_name || seq.sequence_id}
                      </option>
                    ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Strg/Cmd gedrückt halten für Mehrfachauswahl
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Übergangstyp</label>
                <select
                  value={sequence.transition_type}
                  onChange={(e) => handleUpdateSequence(sequenceIndex, { 
                    transition_type: e.target.value as LearningSequence['transition_type']
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="sequential">Sequenziell</option>
                  <option value="parallel">Parallel</option>
                  <option value="conditional">Bedingt</option>
                  <option value="all_completed">Alle abgeschlossen</option>
                  <option value="one_of">Eine von</option>
                </select>
              </div>

              {sequence.transition_type === 'conditional' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedingungsbeschreibung</label>
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

              {sequence.next_learningsequence?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nächste Sequenzen</label>
                  <div className="mt-1 text-sm text-gray-500">
                    {sequence.next_learningsequence.map(nextId => {
                      const nextSeq = solution.didactic_template.learning_sequences.find(
                        s => s.sequence_id === nextId
                      );
                      return nextSeq ? (nextSeq.sequence_name || nextSeq.sequence_id) : nextId;
                    }).join(', ')}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Phasen</h3>
                  <button
                    onClick={() => handleAddPhase(sequenceIndex)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Phase hinzufügen
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
                      availablePhases={sequence.phases.filter((_, idx) => idx !== phaseIndex)}
                      sequenceId={sequence.sequence_id}
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
        Lernsequenz hinzufügen
      </button>
    </div>
  );
}