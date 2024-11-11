import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Actor Types
export type ActorType = 'Einzelperson' | 'Gruppe' | 'KI';
export type MotivationType = 'intrinsisch' | 'extrinsisch';
export type MotivationLevel = 'niedrig' | 'mittel' | 'hoch';

// ... rest of type definitions remain the same ...

const initialState: TemplateState = {
  metadata: {
    title: '',
    description: '',
    keywords: [],
    author: '',
    version: '1.0'
  },
  problem: {
    problem_description: '',
    learning_goals: [],
    didactic_keywords: []
  },
  context: {
    target_group: '',
    subject: '',
    educational_level: '',
    prerequisites: '',
    time_frame: ''
  },
  influence_factors: [],
  solution: {
    solution_description: '',
    didactic_approach: '',
    didactic_template: {
      learning_sequences: []
    }
  },
  consequences: {
    advantages: [],
    disadvantages: []
  },
  implementation_notes: [],
  related_patterns: [],
  feedback: {
    comments: []
  },
  sources: [],
  actors: [],
  environments: []
};

export const useTemplateStore = create<TemplateState & TemplateActions>()(
  persist(
    (set) => ({
      ...initialState,
      setMetadata: (metadata) => set({ metadata }),
      setProblem: (problem) => set({ problem }),
      setContext: (context) => set({ context }),
      setInfluenceFactors: (influence_factors) => set({ influence_factors }),
      setSolution: (solution) => set({ solution }),
      setConsequences: (consequences) => set({ consequences }),
      setImplementationNotes: (implementation_notes) => set({ implementation_notes }),
      setRelatedPatterns: (related_patterns) => set({ related_patterns }),
      setFeedback: (feedback) => set({ feedback }),
      setSources: (sources) => set({ sources }),
      setActors: (actors) => set({ actors }),
      addActor: (actor) => set((state) => ({ actors: [...state.actors, actor] })),
      updateActor: (id, updates) => set((state) => ({
        actors: state.actors.map((actor) =>
          actor.id === id ? { ...actor, ...updates } : actor
        )
      })),
      removeActor: (id) => set((state) => ({
        actors: state.actors.filter((actor) => actor.id !== id)
      })),
      setEnvironments: (environments) => set({ environments }),
      addEnvironment: (environment) => set((state) => ({
        environments: [...state.environments, environment]
      })),
      updateEnvironment: (id, updates) => set((state) => ({
        environments: state.environments.map((env) =>
          env.id === id ? { ...env, ...updates } : env
        )
      })),
      removeEnvironment: (id) => set((state) => ({
        environments: state.environments.filter((env) => env.id !== id)
      }))
    }),
    {
      name: 'template-store'
    }
  )
);