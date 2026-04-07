'use client'

import { useState, useEffect, useRef } from 'react'
import { Question } from '@/types/form'
import Button from '@/components/ui/Button'

interface TextAreaQuestionProps {
  question: Question
  value: string
  onChange: (val: string) => void
  onNext: () => void
  isLast?: boolean
  loading?: boolean
}

export default function TextAreaQuestion({
  question,
  value,
  onChange,
  onNext,
  isLast = false,
  loading = false,
}: TextAreaQuestionProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    ref.current?.focus()
  }, [question.id])

  function handleNext() {
    if (question.required && !value.trim()) {
      setError('Este campo é obrigatório.')
      return
    }
    onNext()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => { setError(''); onChange(e.target.value) }}
          placeholder={question.placeholder}
          rows={4}
          className="w-full bg-[var(--white)] border rounded-md px-4 py-3 text-base text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none resize-none transition-colors duration-150"
          style={{ borderColor: error ? '#c0392b' : 'var(--border-md)' }}
          onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = 'var(--border-dk)' }}
          onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = 'var(--border-md)' }}
        />
        {question.sublabel && !error && (
          <p className="text-sm" style={{ color: 'var(--ink-light)' }}>
            {question.sublabel}
          </p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <Button onClick={handleNext} loading={loading} className="self-start">
        {isLast ? 'Enviar →' : 'Avançar →'}
      </Button>
    </div>
  )
}
