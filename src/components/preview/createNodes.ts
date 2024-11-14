import React from 'react';
import { Node, Edge } from 'reactflow';
import dagre from 'dagre';
import type { TemplateStore } from '../../store/templateStore';

const nodeWidth = 300;
const nodeHeight = 150;
const rankSeparation = 300;
const nodeSeparation = 200;

function createNodeLabel(elements: React.ReactNode[]) {
  return React.createElement('div', { className: 'p-2' }, elements);
}

export function createNodes(state: ReturnType<typeof TemplateStore.getState>) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const dagreGraph = new dagre.graphlib.Graph();
  
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ 
    rankdir: 'TB',
    ranksep: rankSeparation,
    nodesep: nodeSeparation,
    rankAlignment: 'UL'
  });

  // Add solution and didactic approach nodes at the top
  if (state.solution?.solution_description) {
    const solutionId = 'solution';
    nodes.push({
      id: solutionId,
      data: {
        label: createNodeLabel([
          React.createElement('div', { className: 'font-bold', key: 'title' }, 'Lösung'),
          React.createElement('div', { className: 'text-sm', key: 'desc' }, state.solution.solution_description)
        ])
      },
      position: { x: 0, y: 0 },
      className: 'bg-gray-100 border-2 border-gray-500 rounded-md'
    });
    dagreGraph.setNode(solutionId, { width: nodeWidth, height: nodeHeight, rank: 0 });
  }

  if (state.solution?.didactic_approach) {
    const approachId = 'didactic_approach';
    nodes.push({
      id: approachId,
      data: {
        label: createNodeLabel([
          React.createElement('div', { className: 'font-bold', key: 'title' }, 'Didaktischer Ansatz'),
          React.createElement('div', { className: 'text-sm', key: 'desc' }, state.solution.didactic_approach)
        ])
      },
      position: { x: 0, y: 0 },
      className: 'bg-gray-100 border-2 border-gray-500 rounded-md'
    });
    dagreGraph.setNode(approachId, { width: nodeWidth, height: nodeHeight, rank: 0 });
  }

  // Process sequences and their components
  const sequences = state.solution?.didactic_template?.learning_sequences || [];
  sequences.forEach((sequence, seqIndex) => {
    const sequenceId = sequence.sequence_id;
    nodes.push({
      id: sequenceId,
      data: {
        label: createNodeLabel([
          React.createElement('div', { className: 'font-bold', key: 'title' }, sequence.sequence_name || sequence.sequence_id),
          React.createElement('div', { className: 'text-sm', key: 'time' }, `Zeit: ${sequence.time_frame}`),
          React.createElement('div', { className: 'text-sm', key: 'goal' }, `Ziel: ${sequence.learning_goal}`),
          React.createElement('div', { className: 'text-sm', key: 'transition' }, `Übergang: ${sequence.transition_type}`)
        ])
      },
      position: { x: 0, y: 0 },
      className: 'bg-blue-100 border-2 border-blue-500 rounded-md'
    });
    dagreGraph.setNode(sequenceId, { width: nodeWidth, height: nodeHeight, rank: 1 });

    // Connect to solution/approach if they exist
    if (state.solution?.solution_description) {
      edges.push({
        id: `edge-solution-${sequenceId}`,
        source: 'solution',
        target: sequenceId,
        style: { strokeDasharray: '5,5' },
        label: 'enthält'
      });
    }
    if (state.solution?.didactic_approach) {
      edges.push({
        id: `edge-approach-${sequenceId}`,
        source: 'didactic_approach',
        target: sequenceId,
        style: { strokeDasharray: '5,5' },
        label: 'implementiert'
      });
    }

    // Connect prerequisite sequences if they exist
    if (sequence.prerequisite_learningsequences?.length > 0) {
      sequence.prerequisite_learningsequences.forEach(prereqId => {
        edges.push({
          id: `prereq-${prereqId}-${sequenceId}`,
          source: prereqId,
          target: sequenceId,
          animated: true,
          style: { stroke: sequence.transition_type === 'parallel' ? '#9333ea' : '#FF8C00' },
          label: sequence.transition_type === 'parallel' ? 'parallel' : 
                 sequence.transition_type === 'all_completed' ? 'alle abgeschlossen' :
                 sequence.transition_type === 'one_of' ? 'eine von' :
                 sequence.transition_type === 'conditional' ? 'bedingt' : 'sequenziell',
          labelStyle: { 
            fill: sequence.transition_type === 'parallel' ? '#9333ea' : '#FF8C00',
            fontWeight: 'bold'
          }
        });
      });
    }

    // Process phases within sequence
    const phases = sequence.phases || [];
    phases.forEach((phase, phaseIndex) => {
      const phaseId = phase.phase_id;
      nodes.push({
        id: phaseId,
        data: {
          label: createNodeLabel([
            React.createElement('div', { className: 'font-bold', key: 'title' }, phase.phase_name || phase.phase_id),
            React.createElement('div', { className: 'text-sm', key: 'time' }, `Zeit: ${phase.time_frame}`),
            React.createElement('div', { className: 'text-sm', key: 'goal' }, `Ziel: ${phase.learning_goal}`)
          ])
        },
        position: { x: 0, y: 0 },
        className: 'bg-green-100 border-2 border-green-500 rounded-md'
      });
      dagreGraph.setNode(phaseId, { 
        width: nodeWidth, 
        height: nodeHeight, 
        rank: 2,
        column: seqIndex
      });

      // Connect phase to sequence
      edges.push({
        id: `edge-${sequenceId}-${phaseId}`,
        source: sequenceId,
        target: phaseId,
        style: { strokeDasharray: '5,5' },
        label: 'enthält'
      });

      // Add sequence flow between phases
      if (phase.prerequisite_phase) {
        edges.push({
          id: `flow-${phase.prerequisite_phase}-${phaseId}`,
          source: phase.prerequisite_phase,
          target: phaseId,
          animated: true,
          style: { stroke: '#FF8C00' },
          label: `Phase ${phaseIndex + 1}`,
          labelStyle: { fill: '#FF8C00', fontWeight: 'bold' }
        });
      }

      // Process activities within phase
      const activities = phase.activities || [];
      activities.forEach((activity, activityIndex) => {
        const activityId = activity.activity_id;
        nodes.push({
          id: activityId,
          data: {
            label: createNodeLabel([
              React.createElement('div', { className: 'font-bold', key: 'title' }, activity.name || activity.activity_id),
              React.createElement('div', { className: 'text-sm', key: 'duration' }, `Dauer: ${activity.duration} min`),
              React.createElement('div', { className: 'text-sm', key: 'desc' }, activity.description),
              React.createElement('div', { className: 'text-sm', key: 'goal' }, `Ziel: ${activity.goal}`),
              React.createElement('div', { className: 'text-sm', key: 'assessment' }, 
                `Bewertung: ${activity.assessment?.type === 'formative' ? 'Formativ' : 'Summativ'}`
              )
            ])
          },
          position: { x: 0, y: 0 },
          className: 'bg-yellow-100 border-2 border-yellow-500 rounded-md'
        });
        dagreGraph.setNode(activityId, { 
          width: nodeWidth, 
          height: nodeHeight, 
          rank: 3,
          column: seqIndex * 2 + phaseIndex
        });

        // Connect activity to phase
        edges.push({
          id: `edge-${phaseId}-${activityId}`,
          source: phaseId,
          target: activityId,
          style: { strokeDasharray: '5,5' },
          label: 'enthält'
        });

        // Add sequence flow between activities based on transition type
        if (activity.prerequisite_activity) {
          const edgeStyle = activity.transition_type === 'parallel' ? '#9333ea' : '#FF8C00';
          edges.push({
            id: `flow-${activity.prerequisite_activity}-${activityId}`,
            source: activity.prerequisite_activity,
            target: activityId,
            animated: true,
            style: { stroke: edgeStyle },
            label: activity.transition_type,
            labelStyle: { fill: edgeStyle, fontWeight: 'bold' }
          });
        }

        // Process roles within activity
        const activityRoles = activity.roles || [];
        activityRoles.forEach((role, roleIndex) => {
          const roleId = role.role_id;
          const actor = state.actors?.find(a => a.id === role.actor_id);
          const environment = state.environments?.find(env => 
            env.id === role.learning_environment?.environment_id
          );

          const selectedMaterials = role.learning_environment?.selected_materials?.map(id => {
            const material = environment?.materials?.find(m => m.id === id);
            return material?.name;
          }).filter(Boolean) || [];

          const selectedTools = role.learning_environment?.selected_tools?.map(id => {
            const tool = environment?.tools?.find(t => t.id === id);
            return tool?.name;
          }).filter(Boolean) || [];

          const selectedServices = role.learning_environment?.selected_services?.map(id => {
            const service = environment?.services?.find(s => s.id === id);
            return service?.name;
          }).filter(Boolean) || [];

          const roleElements = [
            React.createElement('div', { className: 'font-bold', key: 'title' }, 
              `${actor?.name || 'Unbekannter Akteur'} (als ${role.role_name})`
            )
          ];

          if (role.task_description) {
            roleElements.push(
              React.createElement('div', { className: 'text-sm', key: 'task' }, 
                `Aufgabe: ${role.task_description}`
              )
            );
          }

          if (environment) {
            roleElements.push(
              React.createElement('div', { className: 'text-sm', key: 'env' }, 
                `Lernumgebung: ${environment.name}`
              )
            );
          }

          if (selectedMaterials.length > 0) {
            roleElements.push(
              React.createElement('div', { className: 'text-sm', key: 'materials' }, 
                `Lernressourcen: ${selectedMaterials.join(', ')}`
              )
            );
          }

          if (selectedTools.length > 0) {
            roleElements.push(
              React.createElement('div', { className: 'text-sm', key: 'tools' }, 
                `Werkzeuge: ${selectedTools.join(', ')}`
              )
            );
          }

          if (selectedServices.length > 0) {
            roleElements.push(
              React.createElement('div', { className: 'text-sm', key: 'services' }, 
                `Dienste: ${selectedServices.join(', ')}`
              )
            );
          }

          nodes.push({
            id: roleId,
            data: {
              label: createNodeLabel(roleElements)
            },
            position: { x: 0, y: 0 },
            className: 'bg-orange-100 border-2 border-orange-500 rounded-md'
          });

          dagreGraph.setNode(roleId, { 
            width: nodeWidth, 
            height: nodeHeight * 1.5,
            rank: 4,
            column: roleIndex
          });

          // Connect role to activity
          edges.push({
            id: `edge-${activityId}-${roleId}`,
            source: activityId,
            target: roleId,
            style: { strokeDasharray: '5,5' },
            label: 'führt aus'
          });

          // Add parallel execution edges between roles in the same activity
          if (roleIndex > 0) {
            const prevRoleId = activityRoles[roleIndex - 1].role_id;
            edges.push({
              id: `parallel-${prevRoleId}-${roleId}`,
              source: prevRoleId,
              target: roleId,
              animated: true,
              style: { stroke: '#9333ea' },
              label: 'parallel',
              labelStyle: { fill: '#9333ea', fontWeight: 'bold' }
            });
          }
        });
      });
    });
  });

  // Layout the graph
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Apply the layout positions
  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2
      }
    };
  });

  return { nodes: layoutedNodes, edges };
}