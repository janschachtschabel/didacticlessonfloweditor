import { FC, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ConnectionMode
} from 'reactflow';
import { useTemplateStore } from '../../store/templateStore';
import { createNodes } from './createNodes';
import { Legend } from './Legend';
import 'reactflow/dist/style.css';

export const FlowGraph: FC = () => {
  const state = useTemplateStore();
  const { nodes: initialNodes, edges: initialEdges } = createNodes(state);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update graph when state changes
  useEffect(() => {
    const { nodes: updatedNodes, edges: updatedEdges } = createNodes(state);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [state, setNodes, setEdges]);

  const onInit = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = createNodes(state);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [state, setNodes, setEdges]);

  if (!state.solution?.didactic_template?.learning_sequences?.length) {
    return (
      <div className="h-[800px] border rounded-lg bg-white flex items-center justify-center">
        <p className="text-gray-500">No learning sequences available to display.</p>
      </div>
    );
  }

  return (
    <div className="h-[800px] border rounded-lg overflow-hidden bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        connectionMode={ConnectionMode.Loose}
        minZoom={0.1}
        maxZoom={1.5}
        fitView
      >
        <Background />
        <Controls />
        <Legend />
      </ReactFlow>
    </div>
  );
};