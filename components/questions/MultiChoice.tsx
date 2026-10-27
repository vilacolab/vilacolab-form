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
              className="option"
              data-selected={isSelected ? 'true' : 'false'}
              aria-pressed={isSelected}
            >
              <span className="flex items-start gap-3">
                {/* Indicador de seleção múltipla */}
                <span
                  aria-hidden
                  className="flex-shrink-0 w-[18px] h-[18px] mt-[2px] rounded-full flex items-center justify-center"
                  style={{
                    border: isSelected ? '1px solid var(--bg)' : '1px solid var(--ink)',
                    background: isSelected ? 'var(--bg)' : 'transparent',
                  }}
                >
                  {isSelected && (
                    <svg className="w-2.5 h-2.5" style={{ color: 'var(--ink)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="flex-1">
                  <span className="option-label block">{option.label}</span>
                  {option.description && <span className="option-desc block">{option.description}</span>}
                </span>
              </span>
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

      {error && <p className="msg-error">{error}</p>}

      <div className="flex flex-col items-center gap-2 pt-2">
        <Button onClick={handleNext}>Avançar</Button>
        {value.length > 0 && (
          <span className="t-label" style={{ color: 'var(--ink-3)' }}>
            {value.length} {value.length === 1 ? 'selecionado' : 'selecionados'}
          </span>
        )}
      </div>
    </div>
  )
}
