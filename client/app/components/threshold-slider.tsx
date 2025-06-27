interface ThresholdSliderProps {
  threshold: number
  onThresholdChange: (threshold: number) => void
}

export function ThresholdSlider({ threshold, onThresholdChange }: ThresholdSliderProps) {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor='threshold' className='text-sm font-medium'>
        Similarity Threshold: {threshold}
      </label>
      <input
        type='range'
        id='threshold'
        min='0.1'
        max='0.9'
        step='0.05'
        value={threshold}
        onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
        className='w-full max-w-md'
      />
      <p className='text-xs text-muted-foreground'>
        Lower values match more skills with weaker similarities. Higher values require stronger
        matches.
      </p>
    </div>
  )
}
