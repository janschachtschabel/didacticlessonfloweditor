import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { exampleTemplate } from '../data/exampleTemplate';

// ... rest of the type definitions remain the same ...

const initialState: TemplateState = {
  metadata: exampleTemplate.metadata,
  problem: exampleTemplate.problem,
  context: exampleTemplate.context,
  influence_factors: exampleTemplate.influence_factors,
  solution: exampleTemplate.solution,
  consequences: exampleTemplate.consequences,
  implementation_notes: exampleTemplate.implementation_notes,
  related_patterns: exampleTemplate.related_patterns,
  feedback: exampleTemplate.feedback,
  sources: exampleTemplate.sources,
  actors: exampleTemplate.actors,
  environments: exampleTemplate.environments
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