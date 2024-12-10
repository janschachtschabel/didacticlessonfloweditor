import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { TemplateStore } from '../store/templateStore';

export async function generatePDF(state: ReturnType<typeof TemplateStore.getState>) {
  const pdf = new jsPDF();
  let yPos = 20;

  const addSectionHeader = (text: string) => {
    if (yPos > pdf.internal.pageSize.height - 30) {
      pdf.addPage();
      yPos = 20;
    }
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, 20, yPos);
    yPos += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
  };

  const addText = (text: string, indent = 0) => {
    if (!text) return;
    const lines = pdf.splitTextToSize(text, 170 - indent);
    if (yPos + lines.length * 7 > pdf.internal.pageSize.height - 20) {
      pdf.addPage();
      yPos = 20;
    }
    pdf.text(lines, 20 + indent, yPos);
    yPos += lines.length * 7;
  };

  const addListItem = (text: string, level = 0, link?: string) => {
    if (!text) return;
    const indent = level * 5;
    if (yPos > pdf.internal.pageSize.height - 20) {
      pdf.addPage();
      yPos = 20;
    }
    const bullet = level === 0 ? '•' : '-';
    pdf.text(bullet, 20 + indent, yPos);
    
    if (link) {
      const textWidth = pdf.getTextWidth(text);
      pdf.setTextColor(0, 0, 255);
      pdf.textWithLink(text, 25 + indent, yPos, { url: link });
      pdf.setTextColor(0, 0, 0);
    } else {
      const lines = pdf.splitTextToSize(text, 165 - indent);
      pdf.text(lines, 25 + indent, yPos);
    }
    
    yPos += 7;
  };

  // Page 1: Title and General Information
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(state.metadata.title || 'Didaktisches Template', 20, 40, { maxWidth: 170 });
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Autor: ${state.metadata.author || 'Unbekannt'}`, 20, 60);
  pdf.text(`Version: ${state.metadata.version || '1.0'}`, 20, 70);
  
  pdf.setFontSize(12);
  const descLines = pdf.splitTextToSize(state.metadata.description || '', 170);
  pdf.text(descLines, 20, 90);

  if (state.metadata.keywords?.length > 0) {
    yPos = 110;
    addText('Schlüsselwörter: ' + state.metadata.keywords.join(', '));
  }

  // Page 2: Didactic Elements
  pdf.addPage();
  yPos = 20;
  addSectionHeader('Didaktische Grundlagen');

  // Problem
  addText('Problem:', 0);
  addText(state.problem.problem_description, 5);
  if (state.problem.learning_goals?.length > 0) {
    yPos += 5;
    addText('Lernziele:', 5);
    state.problem.learning_goals.forEach(goal => addListItem(goal, 2));
  }
  if (state.problem.didactic_keywords?.length > 0) {
    yPos += 5;
    addText('Didaktische Schlüsselwörter:', 5);
    addText(state.problem.didactic_keywords.join(', '), 10);
  }
  yPos += 10;

  // Context
  addText('Kontext:', 0);
  addText(`Zielgruppe: ${state.context.target_group}`, 5);
  addText(`Fach: ${state.context.subject}`, 5);
  addText(`Bildungsstufe: ${state.context.educational_level}`, 5);
  addText(`Voraussetzungen: ${state.context.prerequisites}`, 5);
  addText(`Zeitrahmen: ${state.context.time_frame}`, 5);
  yPos += 10;

  // Influence Factors
  if (state.influence_factors?.length > 0) {
    addText('Einflussfaktoren:', 0);
    state.influence_factors.forEach(factor => {
      addText(`${factor.factor}:`, 5);
      addText(factor.description, 10);
    });
    yPos += 10;
  }

  // Solution
  addText('Lösung:', 0);
  addText(state.solution.solution_description, 5);
  addText(`Didaktischer Ansatz: ${state.solution.didactic_approach}`, 5);
  yPos += 10;

  // Consequences
  addText('Konsequenzen:', 0);
  if (state.consequences.advantages?.length > 0) {
    addText('Vorteile:', 5);
    state.consequences.advantages.forEach(adv => addListItem(adv, 2));
  }
  if (state.consequences.disadvantages?.length > 0) {
    addText('Nachteile:', 5);
    state.consequences.disadvantages.forEach(dis => addListItem(dis, 2));
  }

  // Implementation Notes
  if (state.implementation_notes?.length > 0) {
    yPos += 10;
    addText('Umsetzungshinweise:', 0);
    state.implementation_notes.forEach(note => addListItem(note.description, 1));
  }

  // Related Patterns
  if (state.related_patterns?.length > 0) {
    yPos += 10;
    addText('Verwandte Muster:', 0);
    addText(state.related_patterns.join(', '), 5);
  }

  // Page 3: Actors
  pdf.addPage();
  yPos = 20;
  addSectionHeader('Akteure');
  
  if (state.actors?.length > 0) {
    state.actors.forEach(actor => {
      addText(`${actor.name} (${actor.type})`);
      addText(`Bildung: ${actor.education.education_level}`, 5);
      addText(`Klassenstufe: ${actor.education.class_level}`, 5);
      addText(`Fachlicher Fokus: ${actor.education.subject_focus}`, 5);
      
      if (actor.competencies.language_skills.languages.length > 0) {
        addText('Sprachkenntnisse:', 5);
        actor.competencies.language_skills.languages.forEach(lang => {
          const level = actor.competencies.language_skills.proficiency_levels[lang];
          addText(`${lang}: ${level}`, 10);
        });
      }

      if (actor.learning_requirements.learning_preferences.length > 0) {
        addText('Lernpräferenzen:', 5);
        addText(actor.learning_requirements.learning_preferences.join(', '), 10);
      }

      yPos += 10;
    });
  }

  // Page 4: Learning Environments
  pdf.addPage();
  yPos = 20;
  addSectionHeader('Lernumgebungen');

  if (state.environments?.length > 0) {
    state.environments.forEach(env => {
      addText(env.name);
      addText(env.description, 5);
      
      if (env.materials?.length > 0) {
        addText('Lernressourcen:', 5);
        env.materials.forEach(mat => {
          const url = mat.wlo_metadata?.wwwUrl || mat.access_link;
          if (url) {
            addListItem(`${mat.name} (${mat.material_type})`, 2, url);
          } else {
            addListItem(`${mat.name} (${mat.material_type})`, 2);
          }
          if (mat.wlo_metadata) {
            addText('WLO empfiehlt:', 10);
            const wloUrl = mat.wlo_metadata.wwwUrl;
            if (wloUrl) {
              addListItem(mat.wlo_metadata.title, 3, wloUrl);
            } else {
              addListItem(mat.wlo_metadata.title, 3);
            }
          }
        });
      }
      
      if (env.tools?.length > 0) {
        addText('Werkzeuge:', 5);
        env.tools.forEach(tool => {
          const url = tool.wlo_metadata?.wwwUrl || tool.access_link;
          if (url) {
            addListItem(`${tool.name} (${tool.tool_type})`, 2, url);
          } else {
            addListItem(`${tool.name} (${tool.tool_type})`, 2);
          }
          if (tool.wlo_metadata) {
            addText('WLO empfiehlt:', 10);
            const wloUrl = tool.wlo_metadata.wwwUrl;
            if (wloUrl) {
              addListItem(tool.wlo_metadata.title, 3, wloUrl);
            } else {
              addListItem(tool.wlo_metadata.title, 3);
            }
          }
        });
      }
      
      if (env.services?.length > 0) {
        addText('Dienste:', 5);
        env.services.forEach(service => {
          const url = service.wlo_metadata?.wwwUrl || service.access_link;
          if (url) {
            addListItem(`${service.name} (${service.service_type})`, 2, url);
          } else {
            addListItem(`${service.name} (${service.service_type})`, 2);
          }
          if (service.wlo_metadata) {
            addText('WLO empfiehlt:', 10);
            const wloUrl = service.wlo_metadata.wwwUrl;
            if (wloUrl) {
              addListItem(service.wlo_metadata.title, 3, wloUrl);
            } else {
              addListItem(service.wlo_metadata.title, 3);
            }
          }
        });
      }
      
      yPos += 15;
    });
  }

  // Page 5: Course Flow
  pdf.addPage();
  yPos = 20;
  addSectionHeader('Unterrichtsablauf');

  const sequences = state.solution?.didactic_template?.learning_sequences || [];
  if (!sequences.length) {
    addText('Keine Lernsequenzen verfügbar.');
    pdf.save(`${state.metadata.title || 'didaktisches-template'}.pdf`);
    return;
  }

  sequences.forEach(sequence => {
    addText(`Sequenz: ${sequence.sequence_name}`, 0);
    addText(`Zeitrahmen: ${sequence.time_frame}`, 5);
    addText(`Lernziel: ${sequence.learning_goal}`, 5);

    sequence.phases?.forEach(phase => {
      addText(`Phase: ${phase.phase_name}`, 10);
      addText(`Zeitrahmen: ${phase.time_frame}`, 15);
      addText(`Lernziel: ${phase.learning_goal}`, 15);

      phase.activities?.forEach(activity => {
        addText(`Aktivität: ${activity.name}`, 20);
        addText(`Beschreibung: ${activity.description}`, 25);
        addText(`Dauer: ${activity.duration} min`, 25);
        addText(`Ziel: ${activity.goal}`, 25);

        if (activity.roles?.length > 0) {
          addText('Rollen:', 25);
          activity.roles.forEach(role => {
            addText(`${role.role_name}:`, 30);
            addText(role.task_description, 35);

            if (role.learning_environment) {
              const env = state.environments.find(e => e.id === role.learning_environment?.environment_id);
              if (env) {
                addText(`Lernumgebung: ${env.name}`, 35);

                // Add materials with links
                const materials = role.learning_environment.selected_materials
                  ?.map(id => env.materials.find(m => m.id === id))
                  .filter(Boolean);
                if (materials?.length) {
                  addText('Materialien:', 35);
                  materials.forEach(m => {
                    if (m) {
                      const url = m.wlo_metadata?.wwwUrl || m.access_link;
                      if (url) {
                        addListItem(m.name, 8, url);
                      } else {
                        addListItem(m.name, 8);
                      }
                    }
                  });
                }

                // Add tools with links
                const tools = role.learning_environment.selected_tools
                  ?.map(id => env.tools.find(t => t.id === id))
                  .filter(Boolean);
                if (tools?.length) {
                  addText('Werkzeuge:', 35);
                  tools.forEach(t => {
                    if (t) {
                      const url = t.wlo_metadata?.wwwUrl || t.access_link;
                      if (url) {
                        addListItem(t.name, 8, url);
                      } else {
                        addListItem(t.name, 8);
                      }
                    }
                  });
                }

                // Add services with links
                const services = role.learning_environment.selected_services
                  ?.map(id => env.services.find(s => s.id === id))
                  .filter(Boolean);
                if (services?.length) {
                  addText('Dienste:', 35);
                  services.forEach(s => {
                    if (s) {
                      const url = s.wlo_metadata?.wwwUrl || s.access_link;
                      if (url) {
                        addListItem(s.name, 8, url);
                      } else {
                        addListItem(s.name, 8);
                      }
                    }
                  });
                }
              }
            }
          });
        }
      });
    });
    yPos += 10;
  });

  // Save the PDF
  pdf.save(`${state.metadata.title || 'didaktisches-template'}.pdf`);
}