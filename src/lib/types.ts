export interface Template {
  metadata: {
    title: string
    description: string
    version: string
  }
  problem: {
    description: string
    goals: string[]
  }
  solution: {
    description: string
    steps: string[]
  }
}