'use client'

import { useState } from 'react'
import { Question, ChoiceOption } from '@/types/form'
import Button from '@/components/ui/Button'

interface SingleChoiceProps {
  question: Question
  value: string
  onChange: (val: string) => void
  onNext: () => void
}

export default function SingleChoice({
  question,
  value,
  onChange,
  onNext,
}: SingleChoiceProps) {
  const [error, setError] = useState('')

  function handleSelect(option: ChoiceOption) {
    setError('')
    onChange(option.label)
    if (question.autoAdvance) {
      setTimeout(() => onNext(), 280)
    }
  }

  function handleNext() {
    if (!value && question.required) {
      setError('Selecione uma opção para continuar.')
      return
    }
    onNext()
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: question.options && question.options.length > 4
            ? 'repeat(2, 1fr)'
            : '1fr',
        }}
      >
        {question.options?.map((option) => {
          const isSelected = value === option.label
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className="text-left rounded-md px-4 py-3 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--border-dk)] focus:ring-offset-1"
              style={{
                background: isSelected ? 'var(--cream-d)' : 'var(--white)',
                border: isSelected
                  ? '1px solid var(--border-dk)'
                  : '1px solid var(--border-md)',
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
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 transition-colors"
                  style={{
                    background: isSelected ? 'var(--ink)' : 'var(--cream-dd)',
                    color: isSelected ? 'var(--white)' : 'var(--ink-mid)',
                  }}
                >
                  {option.id}
                </span>
                <div className="flex-1">
                  <p
                    className="text-sm leading-snug font-medium"
                    style={{ color: 'var(--ink)' }}
                  >
                    {option.label}
                  </p>
                  {option.sublabel && (
                    <p className="mt-1 text-xs italic" style={{ color: 'var(--ink-light)' }}>
                      {option.sublabel}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <svg
                    className="flex-shrink-0 w-4 h-4 mt-0.5"
                    style={{ color: 'var(--ink)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

      {!question.autoAdvance && (
        <Button onClick={handleNext} className="mt-1 self-start">
          Avançar →
        </Button>
      )}
    </div>
  )
}
