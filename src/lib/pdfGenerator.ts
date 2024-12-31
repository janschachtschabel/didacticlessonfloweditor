import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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
      
      // Demographic data
      if (actor.type === 'Gruppe') {
        addText('Demografische Daten:', 5);
        addText(`Altersbereich: ${actor.demographic_data.age_range || 'Nicht angegeben'}`, 10);
        addText(`Geschlechterverteilung: ${actor.demographic_data.gender_distribution || 'Nicht angegeben'}`, 10);
      } else {
        addText('Demografische Daten:', 5);
        addText(`Alter: ${actor.demographic_data.age || 'Nicht angegeben'}`, 10);
        addText(`Geschlecht: ${actor.demographic_data.gender || 'Nicht angegeben'}`, 10);
      }
      addText(`Ethnischer Hintergrund: ${actor.demographic_data.ethnic_background}`, 10);

      // Education
      addText('Bildung:', 5);
      addText(`Bildung: ${actor.education.education_level}`, 5);
      addText(`Klassenstufe: ${actor.education.class_level}`, 5);
      addText(`Fachlicher Fokus: ${actor.education.subject_focus}`, 5);
      
      // Competencies
      addText('Kompetenzen:', 5);
      if (actor.competencies.subject_competencies.length > 0) {
        addText('Fachkompetenzen:', 10);
        actor.competencies.subject_competencies.forEach(comp => addListItem(comp, 3));
      }
      if (actor.competencies.cognitive_competencies.length > 0) {
        addText('Kognitive Kompetenzen:', 10);
        actor.competencies.cognitive_competencies.forEach(comp => addListItem(comp, 3));
      }
      if (actor.competencies.methodical_competencies.length > 0) {
        addText('Methodische Kompetenzen:', 10);
        actor.competencies.methodical_competencies.forEach(comp => addListItem(comp, 3));
      }
      if (actor.competencies.affective_competencies.length > 0) {
        addText('Affektive Kompetenzen:', 10);
        actor.competencies.affective_competencies.forEach(comp => addListItem(comp, 3));
      }
      if (actor.competencies.digital_competencies.length > 0) {
        addText('Digitale Kompetenzen:', 10);
        actor.competencies.digital_competencies.forEach(comp => addListItem(comp, 3));
      }

      // Language skills
      if (actor.competencies.language_skills.languages.length > 0) {
        addText('Sprachkenntnisse:', 5);
        actor.competencies.language_skills.languages.forEach(lang => {
          const level = actor.competencies.language_skills.proficiency_levels[lang];
          addText(`${lang}: ${level}`, 10);
        });
      }

      // Learning requirements
      addText('Lernanforderungen:', 5);
      if (actor.learning_requirements.learning_preferences.length > 0) {
        addText('Lernpräferenzen:', 5);
        addText(actor.learning_requirements.learning_preferences.join(', '), 10);
      }
      if (actor.learning_requirements.special_needs.length > 0) {
        addText('Besondere Bedürfnisse:', 10);
        actor.learning_requirements.special_needs.forEach(need => addListItem(need, 3));
      }
      if (actor.learning_requirements.technical_requirements.length > 0) {
        addText('Technische Anforderungen:', 10);
        actor.learning_requirements.technical_requirements.forEach(req => addListItem(req, 3));
      }

      // Interests and goals
      addText('Interessen und Ziele:', 5);
      if (actor.interests_and_goals.interests.length > 0) {
        addText('Interessen:', 10);
        actor.interests_and_goals.interests.forEach(interest => addListItem(interest, 3));
      }
      if (actor.interests_and_goals.goals.length > 0) {
        addText('Ziele:', 10);
        actor.interests_and_goals.goals.forEach(goal => addListItem(goal, 3));
      }
      addText('Motivation:', 10);
      addText(`Typ: ${actor.interests_and_goals.motivation.type}`, 12);
      addText(`Level: ${actor.interests_and_goals.motivation.level}`, 12);

      // Social structure
      addText('Sozialstruktur:', 5);
      addText(`Gruppengröße: ${actor.social_structure.group_size}`, 10);
      addText(`Heterogenität: ${actor.social_structure.heterogeneity}`, 10);

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
      if (env.description) {
        addText(env.description, 5);
      }
      
      // Materials section
      if (env.materials?.length > 0) {
        addText('Lernressourcen:', 5);
        env.materials.forEach(mat => {
          addListItem(`${mat.name} (${mat.material_type})`, 2, mat.access_link);
          
          // Add WLO resources
          if (Array.isArray(mat.wlo_metadata)) {
            addText('WLO Ressourcen:', 8);
            mat.wlo_metadata.forEach(metadata => {
              if (metadata.title && metadata.wwwUrl) {
                addListItem(metadata.title, 3, metadata.wwwUrl);
              }
            });
          } else if (mat.wlo_metadata?.title && mat.wlo_metadata?.wwwUrl) {
            addText('WLO Ressourcen:', 8);
            addListItem(mat.wlo_metadata.title, 3, mat.wlo_metadata.wwwUrl);
          }
        });
      }
      
      // Tools section
      if (env.tools?.length > 0) {
        addText('Werkzeuge:', 5);
        env.tools.forEach(tool => {
          addListItem(`${tool.name} (${tool.tool_type})`, 2, tool.access_link);
          
          // Add WLO resources
          if (Array.isArray(tool.wlo_metadata)) {
            addText('WLO Ressourcen:', 8);
            tool.wlo_metadata.forEach(metadata => {
              if (metadata.title && metadata.wwwUrl) {
                addListItem(metadata.title, 3, metadata.wwwUrl);
              }
            });
          } else if (tool.wlo_metadata?.title && tool.wlo_metadata?.wwwUrl) {
            addText('WLO Ressourcen:', 8);
            addListItem(tool.wlo_metadata.title, 3, tool.wlo_metadata.wwwUrl);
          }
        });
      }
      
      // Services section
      if (env.services?.length > 0) {
        addText('Dienste:', 5);
        env.services.forEach(service => {
          addListItem(`${service.name} (${service.service_type})`, 2, service.access_link);
          
          // Add WLO resources
          if (Array.isArray(service.wlo_metadata)) {
            addText('WLO Ressourcen:', 8);
            service.wlo_metadata.forEach(metadata => {
              if (metadata.title && metadata.wwwUrl) {
                addListItem(metadata.title, 3, metadata.wwwUrl);
              }
            });
          } else if (service.wlo_metadata?.title && service.wlo_metadata?.wwwUrl) {
            addText('WLO Ressourcen:', 8);
            addListItem(service.wlo_metadata.title, 3, service.wlo_metadata.wwwUrl);
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

  // Create table headers
  const headers = [
    'Aktivitätsdetails',
    ...state.actors.map(actor => actor.name || 'Unbenannter Akteur') 
  ];

  // Calculate column widths
  const pageWidth = pdf.internal.pageSize.width - 40; // 40 = 20px margin on each side
  const columnWidth = pageWidth / headers.length;

  // Prepare table data
  const tableData: any[][] = [];

  sequences.forEach(sequence => {
    // Add sequence header
    tableData.push([{
      content: `${sequence.sequence_name || sequence.sequence_id}\nZeit: ${sequence.time_frame}`,
      colSpan: headers.length,
      styles: { fillColor: [240, 247, 255] }
    }]);

    sequence.phases?.forEach(phase => {
      // Add phase header
      tableData.push([{
        content: `${phase.phase_name || phase.phase_id}\nZeit: ${phase.time_frame}`,
        colSpan: headers.length,
        styles: { fillColor: [240, 250, 245] }
      }]);

      // Add activities
      phase.activities?.forEach(activity => {
        const activityDetails = [
          `${activity.name || activity.activity_id}\n` +
          `${activity.description}\n` +
          `Dauer: ${activity.duration} min`
        ];

        // Prepare actor columns
        const actorColumns = state.actors.map(actor => {
          const actorRoles = activity.roles?.filter(role => role.actor_id === actor.id) || [];
          if (actorRoles.length === 0) return '';

          return actorRoles.map(role => {
            let content = `${role.role_name || 'Unbenannte Rolle'}\n${role.task_description || ''}`;

            if (role.learning_environment) {
              const env = state.environments.find(e => e.id === role.learning_environment?.environment_id);
              if (env) {
                content += `\n\nLernumgebung: ${env.name}`;

                // Add materials (manual only)
                const materials = role.learning_environment.selected_materials
                  ?.map(id => env.materials.find(m => m.id === id))
                  .filter(m => m && m.source === 'manual');
                if (materials?.length) {
                  content += '\n\nMaterialien:';
                  materials.forEach(m => {
                    if (m) content += `\n• ${m.name}`;
                  });
                }

                // Add tools (manual only)
                const tools = role.learning_environment.selected_tools
                  ?.map(id => env.tools.find(t => t.id === id))
                  .filter(t => t && t.source === 'manual');
                if (tools?.length) {
                  content += '\n\nWerkzeuge:';
                  tools.forEach(t => {
                    if (t) content += `\n• ${t.name}`;
                  });
                }

                // Add services (manual only)
                const services = role.learning_environment.selected_services
                  ?.map(id => env.services.find(s => s.id === id))
                  .filter(s => s && s.source === 'manual');
                if (services?.length) {
                  content += '\n\nDienste:';
                  services.forEach(s => {
                    if (s) content += `\n• ${s.name}`;
                  });
                }
              }
            }

            return content;
          }).join('\n\n');
        });

        tableData.push([...activityDetails, ...actorColumns]);
      });
    });
  });

  // Add table to PDF using autoTable
  (pdf as any).autoTable({
    head: [headers],
    body: tableData,
    startY: yPos + 10,
    styles: {
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak',
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { cellWidth: columnWidth }, // Activity details column
      ...Object.fromEntries(
        Array(state.actors.length).fill(0).map((_, i) => [i + 1, { 
          cellWidth: columnWidth,
          minCellWidth: columnWidth
        }])
      )
    },
    didDrawPage: (data: any) => {
      // Add header on each page
      if (data.pageCount > 1) {
        pdf.setFontSize(10);
        pdf.text('Unterrichtsablauf (Fortsetzung)', 20, 20);
      }
      yPos = data.cursor.y + 10;
    }
  });

  // Save the PDF
  pdf.save(`${state.metadata.title || 'didaktisches-template'}.pdf`);
}