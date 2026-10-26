'use client'

import { useState } from 'react'
import { Question, FormAnswers, optionValue } from '@/types/form'
import Button from '@/components/ui/Button'
import FollowUpInput from './FollowUpInput'

interface MultiChoiceProps {
  question: Question
  answers: FormAnswers
  setAnswer: (field: string, val: string | string[]) => void
  onNext: () => void
}

export default function MultiChoice({ question, answers, setAnswer, onNext }: MultiChoiceProps) {
  const [error, setError] = useState('')
  const value = (answers[question.notionField] as string[]) ?? []

  const openFollowUps = (question.options ?? [])
    .filter((o) => o.followUp && value.includes(optionValue(o)))
    .map((o) => o.followUp!)

  function toggle(val: string) {
    setError('')
    if (value.includes(val)) {
      setAnswer(question.notionField, value.filter((v) => v !== val))
      const option = question.options?.find((o) => optionValue(o) === val)
      if (option?.followUp) setAnswer(option.followUp.field, '')
    } else {
      setAnswer(question.notionField, [...value, val])
    }
  }

  function handleNext() {
    if (question.required && value.length === 0) {
      setError('Selecione ao menos uma opção.')
      return
    }
    const missing = openFollowUps.find(
      (f) => f.required && !String(answers[f.field] ?? '').trim()
    )
    if (missing) {
      setError('Preencha o campo acima para continuar.')
      return
    }
    onNext()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {question.options?.map((option) => {
          const val = optionValue(option)
          const isSelected = value.includes(val)
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(val)}
              className="text-left rounded-md px-4 py-3 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--border-dk)] focus:ring-offset-1"
              style={{
                background: isSelected ? 'var(--cream-d)' : 'var(--white)',
                border: isSelected ? '1px solid var(--border-dk)' : '1px solid var(--border-md)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-dk)'
                  e.currentTarget.style.background = 'var(--cream-d)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-md)'
                  e.currentTarget.style.background = 'var(--white)'
                }
              }}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox visual */}
                <span
                  className="flex-shrink-0 w-4 h-4 mt-[3px] rounded-sm border flex items-center justify-center transition-colors"
                  style={{
                    background: isSelected ? 'var(--ink)' : 'var(--white)',
                    borderColor: isSelected ? 'var(--ink)' : 'var(--border-md)',
                  }}
                >
                  {isSelected && (
                    <svg
                      className="w-2.5 h-2.5 text-[var(--white)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-sm leading-snug font-medium" style={{ color: 'var(--ink)' }}>
                    {option.label}
                  </p>
                  {option.description && (
                    <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--ink-mid)' }}>
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {openFollowUps.map((f) => (
        <FollowUpInput
          key={f.field}
          followUp={f}
          value={String(answers[f.field] ?? '')}
          onChange={(v) => { setError(''); setAnswer(f.field, v) }}
          onEnter={handleNext}
          error={Boolean(error) && f.required && !String(answers[f.field] ?? '').trim()}
        />
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-4 mt-1">
        <Button onClick={handleNext}>Avançar →</Button>
        {value.length > 0 && (
          <span className="text-xs" style={{ color: 'var(--ink-light)' }}>
            {value.length} {value.length === 1 ? 'selecionado' : 'selecionados'}
          </span>
        )}
      </div>
    </div>
  )
}
