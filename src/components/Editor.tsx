import { Editor as MonacoEditor } from '@monaco-editor/react'
import { useState } from 'react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export function Editor({ value, onChange }: EditorProps) {
  const [mounted, setMounted] = useState(false)

  return (
    <div className="h-[500px] border rounded-md">
      <MonacoEditor
        height="100%"
        defaultLanguage="json"
        value={value}
        onChange={val => onChange(val || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true
        }}
        onMount={() => setMounted(true)}
      />
    </div>
  )
}