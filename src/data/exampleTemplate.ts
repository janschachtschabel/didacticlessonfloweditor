import { Actor, LearningEnvironment } from '../store/templateStore';

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
      gender_distribution: "gemischt",
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
      gender_distribution: "gemischt",
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
      learning_sequences: [
        {
          sequence_id: "LS1",
          sequence_name: "Einführung in die Addition",
          time_frame: "45 Minuten",
          learning_goal: "Grundlegendes Verständnis der Addition",
          phases: [
            {
              phase_id: "P1",
              phase_name: "Aktivierung",
              time_frame: "10 Minuten",
              learning_goal: "Vorwissen aktivieren",
              activities: [
                {
                  activity_id: "A1",
                  name: "Zahlenspiel",
                  description: "Spielerische Einführung mit visuellen Elementen",
                  duration: 10,
                  roles: [
                    {
                      role_name: "Moderator",
                      actor_id: "Lehrer1",
                      task_description: "Leitet das Zahlenspiel und stellt gezielte Fragen",
                      learning_environment: {
                        environment_id: "Env1",
                        selected_materials: ["Mat1", "Mat2", "Mat3"],
                        selected_tools: ["Tool1"],
                        selected_services: ["Service1"]
                      }
                    },
                    {
                      role_name: "Teilnehmer Hauptgruppe",
                      actor_id: "Gruppe1",
                      task_description: "Aktive Teilnahme am Zahlenspiel",
                      learning_environment: {
                        environment_id: "Env1",
                        selected_materials: ["Mat1", "Mat2"],
                        selected_tools: ["Tool2"],
                        selected_services: []
                      }
                    },
                    {
                      role_name: "Teilnehmer Sprachförderung",
                      actor_id: "Gruppe2",
                      task_description: "Teilnahme am Zahlenspiel mit sprachlicher Unterstützung",
                      learning_environment: {
                        environment_id: "Env1",
                        selected_materials: ["Mat2", "Mat3"],
                        selected_tools: ["Tool2", "Tool3"],
                        selected_services: ["Service1"]
                      }
                    }
                  ],
                  goal: "Spielerisches Aufwärmen und Aktivierung des Vorwissens",
                  prerequisite_activity: null,
                  transition_type: "sequential",
                  condition_description: null,
                  next_activity: ["A2"],
                  assessment: {
                    type: "formative",
                    methods: ["Beobachtung"],
                    criteria: ["Aktive Teilnahme", "Grundverständnis"]
                  }
                }
              ],
              prerequisite_phase: null,
              transition_type: "sequential",
              condition_description: null,
              next_phase: "P2"
            },
            {
              phase_id: "P2",
              phase_name: "Erarbeitung",
              time_frame: "20 Minuten",
              learning_goal: "Verständnis der Additionsregeln",
              activities: [
                {
                  activity_id: "A2",
                  name: "Regelentdeckung",
                  description: "Entdeckung der Additionsregeln anhand von Beispielen",
                  duration: 20,
                  roles: [
                    {
                      role_name: "Anleiter",
                      actor_id: "Lehrer1",
                      task_description: "Begleitet den Entdeckungsprozess und unterstützt bei sprachlichen Herausforderungen",
                      learning_environment: {
                        environment_id: "Env1",
                        selected_materials: ["Mat1", "Mat2", "Mat3"],
                        selected_tools: ["Tool1"],
                        selected_services: ["Service1"]
                      }
                    },
                    {
                      role_name: "Lerngruppe Standard",
                      actor_id: "Gruppe1",
                      task_description: "Erarbeitet die Regeln in Partnerarbeit",
                      learning_environment: {
                        environment_id: "Env1",
                        selected_materials: ["Mat1", "Mat2"],
                        selected_tools: ["Tool2"],
                        selected_services: []
                      }
                    },
                    {
                      role_name: "Lerngruppe Sprachförderung",
                      actor_id: "Gruppe2",
                      task_description: "Erarbeitet die Regeln mit sprachlicher Unterstützung und visualisierten Beispielen",
                      learning_environment: {
                        environment_id: "Env1",
                        selected_materials: ["Mat2", "Mat3"],
                        selected_tools: ["Tool2", "Tool3"],
                        selected_services: ["Service1", "Service2"]
                      }
                    }
                  ],
                  goal: "Selbstständige Erarbeitung der Additionsregeln",
                  prerequisite_activity: "A1",
                  transition_type: "sequential",
                  condition_description: null,
                  next_activity: ["A3"],
                  assessment: {
                    type: "formative",
                    methods: ["Peer-Feedback", "Selbstreflexion"],
                    criteria: ["Regelverständnis", "Zusammenarbeit"]
                  }
                }
              ],
              prerequisite_phase: "P1",
              transition_type: "sequential",
              condition_description: null,
              next_phase: "P3"
            },
            {
              phase_id: "P3",
              phase_name: "Sicherung",
              time_frame: "15 Minuten",
              learning_goal: "Festigung der Additionsregeln",
              activities: [
                {
                  activity_id: "A3",
                  name: "Präsentation und Diskussion",
                  description: "Vorstellen der entdeckten Regeln und gemeinsame Diskussion",
                  duration: 15,
                  roles: [
                    {
                      role_name: "Moderator",
                      actor_id: "Lehrer1",
                      task_description: "Moderiert die Diskussion und fasst Ergebnisse zusammen",
                      learning_environment: {
                        environment_id: "Env1",
                        selected_materials: ["Mat1", "Mat2", "Mat3"],
                        selected_tools: ["Tool1"],
                        selected_services: ["Service1"]
                      }
                    },
                    {
                      role_name: "Präsentierende Hauptgruppe",
                      actor_id: "Gruppe1",
                      task_description: "Stellt eigene Erkenntnisse vor",
                      learning_environment: {
                        environment_id: "Env1",
                        selected_materials: ["Mat1", "Mat2"],
                        selected_tools: ["Tool1"],
                        selected_services: []
                      }
                    },
                    {
                      role_name: "Präsentierende Sprachfördergruppe",
                      actor_id: "Gruppe2",
                      task_description: "Stellt Erkenntnisse mit visueller Unterstützung vor",
                      learning_environment: {
                        environment_id: "Env1",
                        selected_materials: ["Mat2", "Mat3"],
                        selected_tools: ["Tool1", "Tool3"],
                        selected_services: ["Service1"]
                      }
                    }
                  ],
                  goal: "Gemeinsames Verständnis der Additionsregeln",
                  prerequisite_activity: "A2",
                  transition_type: "sequential",
                  condition_description: null,
                  next_activity: [],
                  assessment: {
                    type: "summative",
                    methods: ["Präsentation", "Diskussionsbeteiligung"],
                    criteria: ["Verständnis", "Kommunikationsfähigkeit"]
                  }
                }
              ],
              prerequisite_phase: "P2",
              transition_type: "sequential",
              condition_description: null,
              next_phase: null
            }
          ],
          prerequisite_learningsequence: null,
          transition_type: "sequential",
          condition_description: null,
          next_learningsequence: []
        }
      ]
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