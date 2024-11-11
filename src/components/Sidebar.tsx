import {
  VStack,
  Input,
  Select,
  Button,
  Text,
  useToast
} from '@chakra-ui/react'
import type { Template } from '../lib/types'

interface SidebarProps {
  apiKey: string
  setApiKey: (key: string) => void
  model: string
  setModel: (model: string) => void
  template: Template
  setTemplate: (template: Template) => void
}

export function Sidebar({
  apiKey,
  setApiKey,
  model,
  setModel,
  template,
  setTemplate
}: SidebarProps) {
  const toast = useToast()

  const handleSave = () => {
    try {
      const blob = new Blob([JSON.stringify(template, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template.json'
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: 'Template saved',
        status: 'success'
      })
    } catch (error) {
      toast({
        title: 'Error saving template',
        status: 'error'
      })
    }
  }

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          setTemplate(JSON.parse(content))
          toast({
            title: 'Template loaded',
            status: 'success'
          })
        } catch (error) {
          toast({
            title: 'Error loading template',
            status: 'error'
          })
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <VStack
      width="300px"
      spacing={4}
      align="stretch"
      p={4}
      borderWidth={1}
      borderRadius="lg"
    >
      <Text fontSize="xl" fontWeight="bold">Settings</Text>
      
      <Input
        type="password"
        placeholder="OpenAI API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <Select
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      </Select>

      <Button onClick={handleSave}>
        Save Template
      </Button>

      <input
        type="file"
        accept=".json"
        onChange={handleLoad}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <Button as="label" htmlFor="file-upload">
        Load Template
      </Button>
    </VStack>
  )
}