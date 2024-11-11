import { useState } from 'react'
import {
  VStack,
  Textarea,
  Button,
  useToast,
  Text
} from '@chakra-ui/react'
import { processTemplate } from '../lib/api'
import type { Template } from '../lib/types'

interface AIAssistantProps {
  template: Template
  setTemplate: (template: Template) => void
  apiKey: string
  model: string
}

export function AIAssistant({
  template,
  setTemplate,
  apiKey,
  model
}: AIAssistantProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleProcess = async () => {
    if (!apiKey) {
      toast({
        title: 'API key required',
        status: 'error'
      })
      return
    }

    if (!input) {
      toast({
        title: 'Please enter instructions',
        status: 'warning'
      })
      return
    }

    setLoading(true)
    try {
      const result = await processTemplate(template, input, model, apiKey)
      setTemplate(result)
      toast({
        title: 'Template updated',
        status: 'success'
      })
    } catch (error) {
      toast({
        title: 'Error processing template',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      })
    }
    setLoading(false)
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="xl" fontWeight="bold">AI Assistant</Text>
      
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your instructions for completing the template"
        rows={4}
      />

      <Button
        onClick={handleProcess}
        isLoading={loading}
        loadingText="Processing..."
      >
        Process Template
      </Button>
    </VStack>
  )
}