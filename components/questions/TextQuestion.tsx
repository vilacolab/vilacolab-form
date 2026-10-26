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

// Número do Brasil: (00) 00000-0000. Número de fora: começa com + e fica livre.
export function applyPhoneMask(raw: string): string {
  if (raw.trim().startsWith('+')) {
    const digits = raw.replace(/\D/g, '').slice(0, 15)
    return `+${digits}`
  }
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export default function TextQuestion({ question, value, onChange, onNext }: TextQuestionProps) {
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
    if (question.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      setError('Informe um e-mail válido.')
      return false
    }
    if (question.type === 'tel' && value) {
      const digits = value.replace(/\D/g, '')
      const international = value.startsWith('+')
      if (international ? digits.length < 8 : digits.length < 10) {
        setError(international ? 'Informe o número completo com o código do país.' : 'Informe um número válido com DDD.')
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
          inputMode={question.type === 'tel' ? 'tel' : question.type === 'email' ? 'email' : undefined}
          autoComplete={
            question.type === 'tel' ? 'tel' : question.type === 'email' ? 'email' : question.notionField === 'nome' ? 'given-name' : 'off'
          }
          autoCapitalize={question.notionField === 'instagram' || question.type === 'email' ? 'none' : undefined}
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          placeholder={question.placeholder}
          className="w-full bg-[var(--white)] border rounded-md px-4 py-[0.7rem] text-base text-[var(--ink)] placeholder:text-[var(--ink-light)] focus:outline-none transition-colors duration-150"
          style={{ borderColor: error ? '#c0392b' : 'var(--border-md)' }}
          onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = 'var(--border-dk)' }}
          onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = 'var(--border-md)' }}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleNext}>
          {question.required || value.trim() ? 'Avançar' : 'Pular'} →
        </Button>
      </div>
    </div>
  )
}
