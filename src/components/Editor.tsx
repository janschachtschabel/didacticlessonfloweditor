import { Editor as MonacoEditor } from '@monaco-editor/react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function Editor({ value, onChange, readOnly = false }: EditorProps) {
  return (
    <MonacoEditor
      height="400px"
      language="json"
      theme="vs-dark"
      value={value}
      onChange={(value) => onChange(value || '')}
      options={{
        minimap: { enabled: false },
        readOnly,
        scrollBeyondLastLine: false,
        fontSize: 14,
        wordWrap: 'on'
      }}
    />
  );
}