import { Button } from "./ui/button";

interface SampleTextsProps {
  onSelect: (text: string) => void;
}

const SAMPLE_TEXTS = [
  {
    name: "Tech Skills",
    text: "As a senior developer at Google, John specializes in Python, JavaScript, and Go. He built tools using React and Django, and contributes to TensorFlow. Maria from Microsoft prefers working with C# and Azure, but also knows Java and AWS. Both use Git and Docker daily.",
  },
  {
    name: "Resume Sample",
    text: "Jane Smith - Full Stack Developer with 5 years of experience in React, Node.js, and PostgreSQL. Worked at Amazon from 2018-2022 developing cloud services with AWS Lambda. Graduated from MIT with a Computer Science degree. Proficient in Python, JavaScript, and Docker. Currently based in San Francisco, California.",
  },
  {
    name: "Job Posting",
    text: "Software Engineer needed at Netflix in Los Angeles. Required skills: Java, Kotlin, and Spring Boot. Experience with Kafka and Redis is a plus. Must have a BS in Computer Science or related field. We offer competitive salary and benefits including health insurance and 401k.",
  },
];

const SampleTexts = ({ onSelect }: SampleTextsProps) => {
  return (
    <div className="mt-2">
      <p className="text-xs text-muted-foreground mb-2">
        Try with sample text:
      </p>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_TEXTS.map((sample, index) => (
          <Button
            key={index}
            variant="secondary"
            size="sm"
            onClick={() => onSelect(sample.text)}
            className="h-7 text-xs"
          >
            {sample.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SampleTexts;
