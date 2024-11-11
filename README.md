# Didactic Template Processor

A web-based tool for creating and managing didactic templates with a visual flow editor. Design your learning sequences, manage actors and environments, and visualize the learning process.

## Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Getting Started

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

### 1. Template Management
- Create and edit didactic templates
- Save and load templates as JSON files
- Example templates included

### 2. Visual Components

#### General Settings
- Set template metadata
- Define title, description, and keywords
- Manage version information

#### Pattern Elements
- Define problems and learning goals
- Set influence factors
- Configure context and solutions

#### Actors
- Create and manage actors (teachers, students, groups)
- Define actor properties:
  - Demographics
  - Education level
  - Competencies
  - Learning requirements

#### Learning Environments
- Configure learning spaces
- Manage resources:
  - Materials
  - Tools
  - Services

#### Course Flow
- Design learning sequences
- Create phases and activities
- Define roles and tasks
- Set up assessment criteria

#### Preview
- Visual flow graph showing:
  - Sequence structure
  - Process flow
  - Parallel activities
  - Role relationships
- Table view for detailed sequence information
- Raw data view for JSON structure

### 3. Visualization Features

The flow graph uses different colors and styles to represent:

- **Structural Relationships**
  - Contains/Implements (dashed lines)
  - References (dashed lines)

- **Process Flow**
  - Sequential Flow (orange, animated)
  - Parallel Execution (purple, animated)

- **Node Types**
  - Solution/Approach (gray)
  - Learning Sequences (blue)
  - Phases (green)
  - Activities (yellow)
  - Roles (orange)
  - Actors (pink)
  - Learning Environments (purple)
  - Materials (red)
  - Tools (indigo)
  - Services (teal)

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── course/        # Course flow related components
│   ├── environments/  # Environment management components
│   └── preview/       # Visualization components
├── pages/             # Main page components
├── store/             # State management
└── lib/              # Utilities and types
```

## Data Model

The template structure follows a hierarchical model:
- Sequences contain phases
- Phases contain activities
- Activities contain roles
- Roles reference actors and environments
- Environments contain materials, tools, and services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request