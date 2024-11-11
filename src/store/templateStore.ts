import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Actor Types
export type ActorType = 'human' | 'group' | 'ai';
export type MotivationType = 'intrinsic' | 'extrinsic';
export type MotivationLevel = 'low' | 'medium' | 'high';

// Resource Types
export interface ResourceBase {
  id: string;
  name: string;
  access_link: string;
  source: 'manual' | 'database' | 'filter';
  database_id?: string;
  filter_criteria?: FilterCriteria;
}

export interface FilterCriteria {
  [key: string]: string;
}

export interface Material extends ResourceBase {
  material_type: string;
}

export interface Tool extends ResourceBase {
  tool_type: string;
}

export interface Service extends ResourceBase {
  service_type: string;
}

export interface LearningEnvironment {
  id: string;
  name: string;
  description: string;
  materials: Material[];
  tools: Tool[];
  services: Service[];
}

// Course Flow Types
export interface Assessment {
  type: 'formative' | 'summative';
  methods: string[];
  criteria: string[];
}

export interface Role {
  role_name: string;
  actor_id: string;
  task_description: string;
  learning_environment: {
    environment_id: string;
    selected_materials: string[];
    selected_tools: string[];
    selected_services: string[];
  };
}

export interface Activity {
  activity_id: string;
  name: string;
  description: string;
  duration: number;
  roles: Role[];
  goal: string;
  prerequisite_activity: string | null;
  transition_type: 'sequential' | 'parallel' | 'conditional';
  condition_description: string | null;
  next_activity: string[];
  assessment: Assessment;
}

export interface Phase {
  phase_id: string;
  phase_name: string;
  time_frame: string;
  learning_goal: string;
  activities: Activity[];
  prerequisite_phase: string | null;
  transition_type: string;
  condition_description: string | null;
  next_phase: string | null;
}

export interface LearningSequence {
  sequence_id: string;
  sequence_name: string;
  time_frame: string;
  learning_goal: string;
  phases: Phase[];
  prerequisite_learningsequence: string | null;
  transition_type: string;
  condition_description: string | null;
  next_learningsequence: string[];
}

// Actor Interfaces
export interface DemographicData {
  age?: number;
  age_range?: string;
  gender?: string;
  gender_distribution?: string;
  ethnic_background: string;
}

export interface Education {
  education_level: string;
  class_level: string;
  subject_focus: string;
}

export interface LanguageSkills {
  languages: string[];
  proficiency_levels: { [key: string]: string };
}

export interface Competencies {
  subject_competencies: string[];
  cognitive_competencies: string[];
  methodical_competencies: string[];
  affective_competencies: string[];
  digital_competencies: string[];
  language_skills: LanguageSkills;
}

export interface LearningRequirements {
  learning_preferences: string[];
  special_needs: string[];
  technical_requirements: string[];
}

export interface Motivation {
  type: MotivationType;
  level: MotivationLevel;
}

export interface InterestsAndGoals {
  interests: string[];
  goals: string[];
  motivation: Motivation;
}

export interface SocialStructure {
  group_size: number | string;
  heterogeneity: string;
}

export interface Actor {
  id: string;
  name: string;
  type: ActorType;
  demographic_data: DemographicData;
  education: Education;
  competencies: Competencies;
  social_form: string;
  learning_requirements: LearningRequirements;
  interests_and_goals: InterestsAndGoals;
  social_structure: SocialStructure;
}

interface TemplateStore {
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    author: string;
    version: string;
  };
  setMetadata: (metadata: any) => void;

  problem: {
    problem_description: string;
    learning_goals: string[];
    didactic_keywords: string[];
  };
  setProblem: (problem: any) => void;

  context: {
    target_group: string;
    subject: string;
    educational_level: string;
    prerequisites: string;
    time_frame: string;
  };
  setContext: (context: any) => void;

  influence_factors: Array<{
    factor: string;
    description: string;
  }>;
  setInfluenceFactors: (factors: any) => void;

  solution: {
    solution_description: string;
    didactic_approach: string;
    didactic_template: {
      learning_sequences: LearningSequence[];
    };
  };
  setSolution: (solution: any) => void;

  consequences: {
    advantages: string[];
    disadvantages: string[];
  };
  setConsequences: (consequences: any) => void;

  implementation_notes: Array<{
    note_id: string;
    description: string;
  }>;
  setImplementationNotes: (notes: any) => void;

  related_patterns: string[];
  setRelatedPatterns: (patterns: any) => void;

  feedback: {
    comments: Array<{
      date: string;
      name: string;
      comment: string;
    }>;
  };
  setFeedback: (feedback: any) => void;

  sources: Array<{
    source_id: string;
    title: string;
    author: string;
    year: number;
    publisher: string;
    url: string;
  }>;
  setSources: (sources: any) => void;

  actors: Actor[];
  setActors: (actors: Actor[]) => void;
  addActor: (actor: Actor) => void;
  updateActor: (id: string, updates: Partial<Actor>) => void;
  removeActor: (id: string) => void;

  environments: LearningEnvironment[];
  setEnvironments: (environments: LearningEnvironment[]) => void;
  addEnvironment: (environment: LearningEnvironment) => void;
  updateEnvironment: (id: string, updates: Partial<LearningEnvironment>) => void;
  removeEnvironment: (id: string) => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      metadata: {
        title: '',
        description: '',
        keywords: [],
        author: '',
        version: '1.0'
      },
      setMetadata: (metadata) => set({ metadata }),

      problem: {
        problem_description: '',
        learning_goals: [],
        didactic_keywords: []
      },
      setProblem: (problem) => set({ problem }),

      context: {
        target_group: '',
        subject: '',
        educational_level: '',
        prerequisites: '',
        time_frame: ''
      },
      setContext: (context) => set({ context }),

      influence_factors: [],
      setInfluenceFactors: (factors) => set({ influence_factors: factors }),

      solution: {
        solution_description: '',
        didactic_approach: '',
        didactic_template: {
          learning_sequences: []
        }
      },
      setSolution: (solution) => set({ solution }),

      consequences: {
        advantages: [],
        disadvantages: []
      },
      setConsequences: (consequences) => set({ consequences }),

      implementation_notes: [],
      setImplementationNotes: (notes) => set({ implementation_notes: notes }),

      related_patterns: [],
      setRelatedPatterns: (patterns) => set({ related_patterns: patterns }),

      feedback: {
        comments: []
      },
      setFeedback: (feedback) => set({ feedback }),

      sources: [],
      setSources: (sources) => set({ sources }),

      actors: [],
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

      environments: [],
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
      name: 'template-store',
    }
  )
);