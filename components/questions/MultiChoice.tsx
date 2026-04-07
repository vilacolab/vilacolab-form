'use client'

import { useState } from 'react'
import { Question } from '@/types/form'
import Button from '@/components/ui/Button'

interface MultiChoiceProps {
  question: Question
  value: string[]
  onChange: (val: string[]) => void
  onNext: () => void
}

export default function MultiChoice({
  question,
  value,
  onChange,
  onNext,
}: MultiChoiceProps) {
  const [error, setError] = useState('')

  function toggle(label: string) {
    setError('')
    if (value.includes(label)) {
      onChange(value.filter((v) => v !== label))
    } else {
      onChange([...value, label])
    }
  }

  function handleNext() {
    if (question.required && value.length === 0) {
      setError('Selecione ao menos uma opção.')
      return
    }
    onNext()
  }

  return (
    <div className="flex flex-col gap-4">
      {question.sublabel && (
        <p className="text-sm -mt-2" style={{ color: 'var(--ink-light)' }}>
          {question.sublabel}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {question.options?.map((option) => {
          const isSelected = value.includes(option.label)
          return (
            <button
              key={option.id}
              onClick={() => toggle(option.label)}
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
              <div className="flex items-center gap-3">
                {/* Checkbox visual */}
                <span
                  className="flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center transition-colors"
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
                <p
                  className="text-sm leading-snug font-medium"
                  style={{ color: 'var(--ink)' }}
                >
                  {option.label}
                </p>
              </div>
            </button>
          )
        })}
      </div>

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
