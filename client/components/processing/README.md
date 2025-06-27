# Processing Components

This directory contains the animated processing modal components that showcase the AI pipeline
during resume analysis.

## Components

### ProcessingModal

The main modal component that orchestrates the entire processing animation experience.

### StageIndicator

Visual indicator showing the status of each processing stage (pending, in progress, completed,
failed).

### ModelCard

Displays individual AI model information with progress bars and status indicators.

### ProgressPipeline

Shows the overall processing pipeline with stage indicators and progress visualization.

### StageVisualization

Dynamic visualization component that changes based on the current processing stage.

## Usage

```tsx
import { ProcessingModal } from '@/components/processing'

;<ProcessingModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  processingState={processingState}
/>
```

## Features

- **Real-time Progress**: Shows actual processing progress with time estimates
- **Educational**: Displays which AI models are being used at each stage
- **Interactive**: Hover effects and tooltips for additional information
- **Responsive**: Works on all screen sizes
- **Dark Mode**: Supports dark/light theme switching
- **Animations**: Smooth transitions and engaging visual effects

## Processing Stages

1. **Data Reception**: Receiving and validating input data
2. **Named Entity Recognition**: Extracting skills using spaCy models
3. **Skill Extraction**: Filtering and organizing extracted entities
4. **Similarity Analysis**: Computing semantic similarity with SentenceTransformer
5. **Course Retrieval**: Searching course database with Pinecone
6. **LLM Recommendation**: Generating recommendations with Cohere
7. **Final Processing**: Calculating scores and preparing results

Each stage shows relevant visualizations and model information to educate users about the
sophisticated AI pipeline at work.
