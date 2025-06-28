export const sampleTexts = {
  'software-engineer-resume': `PROFESSIONAL SUMMARY
Experienced software engineer with 7 years of experience developing web applications using React, TypeScript, and Node.js. Strong background in cloud architecture with AWS. Proven ability to design scalable solutions and mentor junior developers.

SKILLS
Programming Languages: JavaScript, TypeScript, Python
Frontend: React, Redux, HTML5, CSS3, SASS
Backend: Node.js, Express, NestJS
Databases: MongoDB, PostgreSQL, MySQL
Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
Tools: Git, JIRA, CI/CD pipelines

EXPERIENCE
Senior Software Engineer at TechCorp
Led development of a customer-facing portal using React and TypeScript
Implemented serverless architecture using AWS Lambda and API Gateway
Reduced page load time by 40% through code optimization
`,

  'software-engineer-job': `We are looking for a Software Engineer with 5+ years of experience in React, Node.js, and TypeScript. The ideal candidate should have strong problem-solving skills and experience with AWS, Docker, and CI/CD pipelines. Knowledge of Python and machine learning frameworks like TensorFlow or PyTorch is a plus. Must be located in San Francisco or willing to relocate.`,

  'data-scientist-resume': `PROFESSIONAL SUMMARY
Data scientist with 4 years of experience analyzing large datasets and building predictive models. Proficient in Python, R, and SQL with strong background in statistical analysis and machine learning.

SKILLS
Programming: Python, R, SQL
Data Analysis: Pandas, NumPy, Scikit-learn
Visualization: Tableau, Matplotlib, Seaborn
Databases: PostgreSQL, MongoDB
Big Data: Hadoop, Spark
Machine Learning: Regression, Classification, Clustering
`,

  'data-scientist-job': `Seeking a Data Scientist with expertise in Python, R, and SQL. Must have experience with data visualization tools like Tableau or Power BI, and machine learning libraries such as scikit-learn, TensorFlow, and PyTorch. Knowledge of big data technologies like Hadoop and Spark is required. The position is at DataTech in New York City.`,
} as const

export type SampleTextKey = keyof typeof sampleTexts

// Repository information
export const GITHUB_REPOSITORY_URL = 'https://github.com/nitzanpap/skill-bridge'
