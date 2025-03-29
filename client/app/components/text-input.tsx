"use client"

import type React from "react"

import { Textarea } from "@/components/ui/textarea"

interface SingleTextInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  label?: string
  placeholder?: string
}

export function TextInput({
  value,
  onChange,
  label = "Input Text",
  placeholder = "Enter a job description, resume, or select a sample below...",
}: SingleTextInputProps) {
  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-medium">{label}</h3>
      <Textarea
        placeholder={placeholder}
        className="min-h-[150px]"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

interface DualTextInputProps {
  resumeText: string
  onResumeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  jobDescriptionText: string
  onJobDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function DualTextInput({
  resumeText,
  onResumeChange,
  jobDescriptionText,
  onJobDescriptionChange,
}: DualTextInputProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <TextInput
        value={resumeText}
        onChange={onResumeChange}
        label="Resume"
        placeholder="Enter your resume text here..."
      />
      <TextInput
        value={jobDescriptionText}
        onChange={onJobDescriptionChange}
        label="Job Description"
        placeholder="Enter the job description text here..."
      />
    </div>
  )
}
