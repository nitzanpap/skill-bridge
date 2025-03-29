"use client";

import type React from "react";

import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-medium">Input Text</h3>
      <Textarea
        placeholder="Enter a job description, resume, or select a sample below..."
        className="min-h-[200px] w-full"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
