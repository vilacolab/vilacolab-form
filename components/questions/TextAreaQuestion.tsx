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
      setError('Este campo é obrigatório. Uma frase já basta.')
      return
    }
    onNext()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <textarea
          ref={ref}
          value={value}
          maxLength={2000}
          onChange={(e) => { setError(''); onChange(e.target.value) }}
          placeholder={question.placeholder}
          rows={4}
          className="field-area"
          data-error={error ? 'true' : undefined}
        />
        {error && <p className="msg-error">{error}</p>}
      </div>

      <div className="flex justify-center">
        <Button onClick={handleNext} loading={loading}>
          {isLast ? 'Enviar' : 'Avançar'}
        </Button>
      </div>
    </div>
  )
}
