import { Button } from '@/components/ui/button'
import { sampleTexts, SampleTextKey } from '@/lib/constants'

interface SampleTextsProps {
  onSampleSelection: (sampleKey: SampleTextKey) => void
}

export function SampleTexts({ onSampleSelection }: SampleTextsProps) {
  const sampleButtons = [
    { key: 'software-engineer-resume', label: 'Software Engineer Resume' },
    { key: 'software-engineer-job', label: 'Software Engineer Job' },
    { key: 'data-scientist-resume', label: 'Data Scientist Resume' },
    { key: 'data-scientist-job', label: 'Data Scientist Job' },
  ] as const

  return (
    <div className='grid gap-2'>
      <h3 className='text-sm font-medium'>Sample Texts</h3>
      <div className='flex flex-wrap gap-2'>
        {sampleButtons.map(({ key, label }) => (
          <Button key={key} variant='outline' size='sm' onClick={() => onSampleSelection(key)}>
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
