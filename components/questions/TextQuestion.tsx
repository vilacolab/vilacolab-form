'use client'

import { useState, useEffect, useRef } from 'react'
import { Question } from '@/types/form'
import Button from '@/components/ui/Button'

interface TextQuestionProps {
  question: Question
  value: string
  onChange: (val: string) => void
  onNext: () => void
}

function applyPhoneMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function TextQuestion({
  question,
  value,
  onChange,
  onNext,
}: TextQuestionProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
  }, [question.id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.target.value
    if (question.type === 'tel') val = applyPhoneMask(val)
    setError('')
    onChange(val)
  }

  function validate(): boolean {
    if (question.required && !value.trim()) {
      setError('Este campo é obrigatório.')
      return false
    }
    if (question.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Informe um e-mail válido.')
      return false
    }
    if (question.type === 'tel' && value) {
      const digits = value.replace(/\D/g, '')
      if (digits.length < 10) {
        setError('Informe um número válido com DDD.')
        return false
      }
    }
    return true
  }

  function handleNext() {
    if (validate()) onNext()
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type={question.type === 'tel' ? 'tel' : question.type === 'email' ? 'email' : 'text'}
          inputMode={question.type === 'tel' ? 'numeric' : undefined}
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          placeholder={question.placeholder}
          className="w-full bg-[var(--white)] border rounded-md px-4 py-[0.7rem] text-base text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none transition-colors duration-150"
          style={{
            borderColor: error ? '#c0392b' : 'var(--border-md)',
          }}
          onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = 'var(--border-dk)' }}
          onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = 'var(--border-md)' }}
        />
        {question.sublabel && !error && (
          <p className="text-sm" style={{ color: 'var(--ink-light)' }}>
            {question.sublabel}
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleNext}>
          {question.required || value.trim() ? 'Avançar' : 'Pular'} →
        </Button>
        {!question.required && (
          <button
            onClick={onNext}
            className="text-sm transition-colors"
            style={{ color: 'var(--ink-light)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink-mid)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-light)'}
          >
            Pular esta pergunta
          </button>
        )}
      </div>
    </div>
  )
}
