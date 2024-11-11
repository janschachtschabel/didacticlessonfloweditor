import type { Actor, LearningEnvironment } from '../store/templateStore';

export const exampleActors: Actor[] = [
  {
    id: "Lehrer1",
    name: "Jan Schachtschabel",
    type: "Einzelperson",
    demographic_data: {
      age: 46,
      gender: "männlich",
      ethnic_background: "Deutsch"
    },
    education: {
      education_level: "Lehramt Mathematik",
      class_level: "Keine spezifische Klassenstufe",
      subject_focus: "Mathematik"
    },
    competencies: {
      subject_competencies: ["Mathematikdidaktik", "Differenzierung", "Sprachförderung"],
      cognitive_competencies: ["Kritisches Denken", "Problemlösung"],
      methodical_competencies: ["Projektmanagement", "Differenzierte Lehrmethoden"],
      affective_competencies: ["Empathie", "Geduld"],
      digital_competencies: ["Digitale Lehrtools", "Lernplattformen"],
      language_skills: {
        languages: ["Deutsch", "Englisch"],
        proficiency_levels: {
          "Deutsch": "Muttersprache",
          "Englisch": "B2"
        }
      }
    },
    social_form: "Lehrkraft",
    learning_requirements: {
      learning_preferences: ["Visuell", "Interaktiv"],
      special_needs: [],
      technical_requirements: ["Laptop", "Dokumentenkamera"]
    },
    interests_and_goals: {
      interests: ["Mathematikdidaktik", "Inklusive Bildung"],
      goals: ["Erfolgreiche Vermittlung", "Individuelle Förderung"],
      motivation: {
        type: "intrinsic",
        level: "high"
      }
    },
    social_structure: {
      group_size: 1,
      heterogeneity: "n/a"
    }
  },
  {
    id: "Gruppe1",
    name: "Schüler Hauptgruppe",
    type: "Gruppe",
    demographic_data: {
      age: 13,
      gender: "gemischt",
      ethnic_background: "Gemischt"
    },
    education: {
      education_level: "7. Klasse",
      class_level: "Mittelstufe",
      subject_focus: "Mathematik"
    },
    competencies: {
      subject_competencies: ["Grundrechenarten", "Mathematisches Denken"],
      cognitive_competencies: ["Logisches Denken"],
      methodical_competencies: ["Gruppenarbeit"],
      affective_competencies: ["Teamfähigkeit"],
      digital_competencies: ["Grundlegende PC-Kenntnisse"],
      language_skills: {
        languages: ["Deutsch"],
        proficiency_levels: {
          "Deutsch": "Muttersprache"
        }
      }
    },
    social_form: "Klassenverband",
    learning_requirements: {
      learning_preferences: ["Praktisch", "Visuell"],
      special_needs: [],
      technical_requirements: ["Taschenrechner"]
    },
    interests_and_goals: {
      interests: ["Mathematik", "Gruppenarbeit"],
      goals: ["Verständnis der Addition"],
      motivation: {
        type: "mixed",
        level: "medium"
      }
    },
    social_structure: {
      group_size: 15,
      heterogeneity: "mittel"
    }
  },
  {
    id: "Gruppe2",
    name: "Schüler Sprachfördergruppe",
    type: "Gruppe",
    demographic_data: {
      age: 13,
      gender: "gemischt",
      ethnic_background: "Gemischt"
    },
    education: {
      education_level: "7. Klasse",
      class_level: "Mittelstufe",
      subject_focus: "Mathematik"
    },
    competencies: {
      subject_competencies: ["Grundrechenarten"],
      cognitive_competencies: ["Logisches Denken"],
      methodical_competencies: ["Gruppenarbeit"],
      affective_competencies: ["Teamfähigkeit"],
      digital_competencies: ["Grundlegende PC-Kenntnisse"],
      language_skills: {
        languages: ["Deutsch"],
        proficiency_levels: {
          "Deutsch": "A2-B1"
        }
      }
    },
    social_form: "Fördergruppe",
    learning_requirements: {
      learning_preferences: ["Visuell", "Praktisch"],
      special_needs: ["Sprachförderung"],
      technical_requirements: ["Tablet", "Übersetzungs-App"]
    },
    interests_and_goals: {
      interests: ["Mathematik", "Sprachen"],
      goals: ["Verständnis der Addition", "Sprachverbesserung"],
      motivation: {
        type: "intrinsic",
        level: "high"
      }
    },
    social_structure: {
      group_size: 5,
      heterogeneity: "hoch"
    }
  }
];

export const exampleEnvironments: LearningEnvironment[] = [
  {
    id: "Env1",
    name: "Mathematik-Klassenraum",
    description: "Klassenraum mit digitaler und analoger Ausstattung für Mathematikunterricht",
    materials: [
      {
        id: "Mat1",
        name: "Arbeitsblätter Addition",
        material_type: "Arbeitsblatt",
        access_link: "materials/addition_standard.pdf",
        source: "manual"
      },
      {
        id: "Mat2",
        name: "Visualisierungskarten",
        material_type: "Bildkarten",
        access_link: "materials/visual_cards.pdf",
        source: "manual"
      },
      {
        id: "Mat3",
        name: "Mehrsprachiges Mathe-Glossar",
        material_type: "Glossar",
        access_link: "materials/math_glossary.pdf",
        source: "manual"
      }
    ],
    tools: [
      {
        id: "Tool1",
        name: "Dokumentenkamera",
        tool_type: "Hardware",
        access_link: "",
        source: "manual"
      },
      {
        id: "Tool2",
        name: "Taschenrechner",
        tool_type: "Hardware",
        access_link: "",
        source: "manual"
      },
      {
        id: "Tool3",
        name: "Mathematik-App",
        tool_type: "Software",
        access_link: "apps/math_trainer",
        source: "manual"
      }
    ],
    services: [
      {
        id: "Service1",
        name: "Sprachunterstützung",
        service_type: "Förderung",
        access_link: "",
        source: "manual"
      },
      {
        id: "Service2",
        name: "Mathematische Förderung",
        service_type: "Förderung",
        access_link: "",
        source: "manual"
      }
    ]
  }
];

export const exampleTemplate = {
  metadata: {
    title: "Addition mit Sprachförderung",
    description: "Eine inklusive Mathematikstunde zur Addition mit besonderer Berücksichtigung von Sprachförderung",
    keywords: ["Mathematik", "Addition", "Sprachförderung", "Inklusion"],
    author: "Jan Schachtschabel",
    version: "1.0"
  },
  problem: {
    problem_description: "Einführung in die Addition unter Berücksichtigung unterschiedlicher Sprachniveaus",
    learning_goals: [
      "Verständnis der Addition",
      "Mathematische Fachsprache",
      "Sprachkompetenz"
    ],
    didactic_keywords: ["Differenzierung", "Sprachsensibel", "Visuell"]
  },
  context: {
    target_group: "7. Klasse mit Sprachförderbedarf",
    subject: "Mathematik",
    educational_level: "Sekundarstufe I",
    prerequisites: "Grundlegendes Zahlenverständnis",
    time_frame: "45 Minuten"
  },
  influence_factors: [
    {
      factor: "Sprachniveau",
      description: "Unterschiedliche Deutschkenntnisse der Lernenden"
    },
    {
      factor: "Vorwissen",
      description: "Heterogenes mathematisches Vorwissen"
    }
  ],
  solution: {
    solution_description: "Differenzierter Unterricht mit visueller Unterstützung",
    didactic_approach: "Sprachsensibler Mathematikunterricht",
    didactic_template: {
      learning_sequences: []
    }
  },
  consequences: {
    advantages: [
      "Differenzierte Förderung",
      "Sprachsensible Gestaltung",
      "Visuelle Unterstützung"
    ],
    disadvantages: [
      "Hoher Vorbereitungsaufwand",
      "Komplexe Materialerstellung"
    ]
  },
  implementation_notes: [
    {
      note_id: "N1",
      description: "Materialien mehrsprachig vorbereiten"
    },
    {
      note_id: "N2",
      description: "Visualisierungen für alle Konzepte erstellen"
    }
  ],
  related_patterns: [
    "Sprachsensibler Fachunterricht",
    "Differenzierte Gruppenarbeit"
  ],
  feedback: {
    comments: []
  },
  sources: [
    {
      source_id: "S1",
      title: "Sprachsensibler Mathematikunterricht",
      author: "Meyer, M.",
      year: 2023,
      publisher: "Bildungsverlag",
      url: "https://example.com/math-language"
    }
  ],
  actors: exampleActors,
  environments: exampleEnvironments
};