import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { TemplateStore } from '../store/templateStore';

export async function generatePDF(state: ReturnType<typeof TemplateStore.getState>) {
  const pdf = new jsPDF();
  let yPos = 20;

  const addSectionHeader = (text: string) => {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(text, 20, yPos);
    yPos += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
  };

  const addText = (text: string, indent = 0) => {
    const lines = pdf.splitTextToSize(text, 170 - indent);
    pdf.text(lines, 20 + indent, yPos);
    yPos += lines.length * 7;
  };

  const addListItem = (text: string, level = 0) => {
    const indent = level * 5;
    const bullet = level === 0 ? '•' : '-';
    pdf.text(bullet, 20 + indent, yPos);
    const lines = pdf.splitTextToSize(text, 165 - indent);
    pdf.text(lines, 25 + indent, yPos);
    yPos += lines.length * 7;
  };

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(state.metadata.title || 'Didaktisches Template', 20, yPos);
  yPos += 15;

  // Metadata
  addSectionHeader('Allgemeine Informationen');
  addText(`Beschreibung: ${state.metadata.description}`);
  addText(`Autor: ${state.metadata.author}`);
  addText(`Version: ${state.metadata.version}`);
  if (state.metadata.keywords?.length) {
    addText(`Schlüsselwörter: ${state.metadata.keywords.join(', ')}`);
  }
  yPos += 10;

  // Problem
  addSectionHeader('Problem');
  addText(`Beschreibung: ${state.problem.problem_description}`);
  if (state.problem.learning_goals?.length) {
    yPos += 5;
    addText('Lernziele:');
    state.problem.learning_goals.forEach(goal => addListItem(goal));
  }
  if (state.problem.didactic_keywords?.length) {
    yPos += 5;
    addText('Didaktische Schlüsselwörter:');
    addText(state.problem.didactic_keywords.join(', '));
  }
  yPos += 10;

  // Context
  addSectionHeader('Kontext');
  addText(`Zielgruppe: ${state.context.target_group}`);
  addText(`Fach: ${state.context.subject}`);
  addText(`Bildungsstufe: ${state.context.educational_level}`);
  addText(`Voraussetzungen: ${state.context.prerequisites}`);
  addText(`Zeitrahmen: ${state.context.time_frame}`);
  yPos += 10;

  // Influence Factors
  if (state.influence_factors?.length) {
    addSectionHeader('Einflussfaktoren');
    state.influence_factors.forEach(factor => {
      addText(`${factor.factor}:`);
      addText(factor.description, 10);
      yPos += 5;
    });
    yPos += 10;
  }

  // Solution
  addSectionHeader('Lösung');
  addText(`Beschreibung: ${state.solution.solution_description}`);
  addText(`Didaktischer Ansatz: ${state.solution.didactic_approach}`);
  yPos += 10;

  // Check if we need a new page
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }

  // Actors
  addSectionHeader('Akteure');
  state.actors.forEach(actor => {
    addText(`Name: ${actor.name} (${actor.type})`);
    if (actor.demographic_data) {
      const demo = actor.demographic_data;
      addText(`Demografische Daten:`, 5);
      if (demo.age) addText(`Alter: ${demo.age}`, 10);
      if (demo.age_range) addText(`Altersbereich: ${demo.age_range}`, 10);
      if (demo.gender) addText(`Geschlecht: ${demo.gender}`, 10);
      if (demo.gender_distribution) addText(`Geschlechterverteilung: ${demo.gender_distribution}`, 10);
      if (demo.ethnic_background) addText(`Ethnischer Hintergrund: ${demo.ethnic_background}`, 10);
    }
    if (actor.education) {
      const edu = actor.education;
      addText(`Bildung:`, 5);
      addText(`Niveau: ${edu.education_level}`, 10);
      addText(`Klassenstufe: ${edu.class_level}`, 10);
      addText(`Fachlicher Fokus: ${edu.subject_focus}`, 10);
    }
    yPos += 5;
  });

  // Check if we need a new page
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }

  // Learning Environments
  addSectionHeader('Lernumgebungen');
  state.environments.forEach(env => {
    addText(`Name: ${env.name}`);
    addText(`Beschreibung: ${env.description}`, 5);
    
    if (env.materials.length) {
      addText('Lernressourcen:', 5);
      env.materials.forEach(mat => {
        addListItem(`${mat.name} (${mat.material_type})`, 1);
        if (mat.source === 'database') {
          addText(`DB-ID: ${mat.database_id}`, 15);
        }
      });
    }
    
    if (env.tools.length) {
      addText('Werkzeuge:', 5);
      env.tools.forEach(tool => {
        addListItem(`${tool.name} (${tool.tool_type})`, 1);
        if (tool.source === 'database') {
          addText(`DB-ID: ${tool.database_id}`, 15);
        }
      });
    }
    
    if (env.services.length) {
      addText('Dienste:', 5);
      env.services.forEach(service => {
        addListItem(`${service.name} (${service.service_type})`, 1);
        if (service.source === 'database') {
          addText(`DB-ID: ${service.database_id}`, 15);
        }
      });
    }
    yPos += 10;
  });

  // Course Flow
  pdf.addPage();
  yPos = 20;
  addSectionHeader('Unterrichtsablauf');

  const sequences = state.solution?.didactic_template?.learning_sequences || [];
  sequences.forEach((sequence, seqIndex) => {
    addText(`${seqIndex + 1}. Lernsequenz: ${sequence.sequence_name}`, 5);
    addText(`Zeitrahmen: ${sequence.time_frame}`, 10);
    addText(`Lernziel: ${sequence.learning_goal}`, 10);

    sequence.phases?.forEach((phase, phaseIndex) => {
      addText(`${seqIndex + 1}.${phaseIndex + 1}. Phase: ${phase.phase_name}`, 15);
      addText(`Zeitrahmen: ${phase.time_frame}`, 20);
      addText(`Lernziel: ${phase.learning_goal}`, 20);

      phase.activities?.forEach((activity, actIndex) => {
        addText(`${seqIndex + 1}.${phaseIndex + 1}.${actIndex + 1}. Aktivität: ${activity.name}`, 25);
        addText(`Dauer: ${activity.duration} min`, 30);
        addText(`Beschreibung: ${activity.description}`, 30);
        addText(`Ziel: ${activity.goal}`, 30);

        activity.roles?.forEach((role, roleIndex) => {
          addText(`Rolle ${roleIndex + 1}: ${role.role_name}`, 35);
          addText(`Aufgabe: ${role.task_description}`, 40);
          
          const actor = state.actors.find(a => a.id === role.actor_id);
          if (actor) {
            addText(`Akteur: ${actor.name}`, 40);
          }

          if (role.learning_environment) {
            const env = state.environments.find(e => e.id === role.learning_environment?.environment_id);
            if (env) {
              addText(`Lernumgebung: ${env.name}`, 40);
            }
          }
        });
      });
    });
    yPos += 10;

    // Check if we need a new page
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
  });

  // Add table view on a new page
  pdf.addPage();
  addSectionHeader('Tabellarische Übersicht');
  yPos = 40;

  // Prepare table data
  const tableData: any[] = [];
  sequences.forEach(sequence => {
    tableData.push([
      { content: sequence.sequence_name, colSpan: state.actors.length + 1, styles: { fillColor: [200, 220, 255] } }
    ]);

    sequence.phases?.forEach(phase => {
      tableData.push([
        { content: `Phase: ${phase.phase_name}`, colSpan: state.actors.length + 1, styles: { fillColor: [220, 240, 255] } }
      ]);

      phase.activities?.forEach(activity => {
        const activityData = [`${activity.name}\n${activity.description}\nDauer: ${activity.duration} min`];
        
        state.actors.forEach(actor => {
          const roles = activity.roles?.filter(role => role.actor_id === actor.id) || [];
          const roleText = roles.map(role => {
            let text = `Rolle: ${role.role_name}\n${role.task_description}`;
            if (role.learning_environment) {
              const env = state.environments.find(e => e.id === role.learning_environment?.environment_id);
              if (env) {
                text += `\nLernumgebung: ${env.name}`;
                
                const materials = role.learning_environment.selected_materials
                  ?.map(id => env.materials.find(m => m.id === id)?.name)
                  .filter(Boolean);
                if (materials?.length) {
                  text += `\nMaterialien: ${materials.join(', ')}`;
                }

                const tools = role.learning_environment.selected_tools
                  ?.map(id => env.tools.find(t => t.id === id)?.name)
                  .filter(Boolean);
                if (tools?.length) {
                  text += `\nWerkzeuge: ${tools.join(', ')}`;
                }

                const services = role.learning_environment.selected_services
                  ?.map(id => env.services.find(s => s.id === id)?.name)
                  .filter(Boolean);
                if (services?.length) {
                  text += `\nDienste: ${services.join(', ')}`;
                }
              }
            }
            return text;
          }).join('\n\n');
          activityData.push(roleText || '');
        });

        tableData.push(activityData);
      });
    });
  });

  // Generate table
  autoTable(pdf, {
    head: [
      [
        { content: 'Aktivitätsdetails', styles: { fillColor: [66, 139, 202], textColor: 255 } },
        ...state.actors.map(actor => ({
          content: actor.name || 'Unbenannter Akteur',
          styles: { fillColor: [66, 139, 202], textColor: 255 }
        }))
      ]
    ],
    body: tableData,
    startY: yPos,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      valign: 'top'
    },
    columnStyles: {
      0: { cellWidth: 40 },
      ...Object.fromEntries(
        state.actors.map((_, index) => [index + 1, { cellWidth: (170 - 40) / state.actors.length }])
      )
    },
    margin: { left: 20, right: 20 }
  });

  // Save the PDF
  pdf.save(`${state.metadata.title || 'didaktisches-template'}.pdf`);
}