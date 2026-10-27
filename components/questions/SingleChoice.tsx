'use client'

import { useState } from 'react'
import { Question, ChoiceOption, FormAnswers, optionValue } from '@/types/form'
import Button from '@/components/ui/Button'
import FollowUpInput from './FollowUpInput'

interface SingleChoiceProps {
  question: Question
  answers: FormAnswers
  setAnswer: (field: string, val: string | string[]) => void
  onNext: () => void
}

export default function SingleChoice({ question, answers, setAnswer, onNext }: SingleChoiceProps) {
  const [error, setError] = useState('')
  const value = (answers[question.notionField] as string) ?? ''
  const selected = question.options?.find((o) => optionValue(o) === value)
  const followUp = selected?.followUp
  const followUpValue = followUp ? ((answers[followUp.field] as string) ?? '') : ''

  // Opções curtas cabem em duas colunas em telas maiores; textos longos ficam em uma
  const twoColumns =
    (question.options?.length ?? 0) > 4 &&
    (question.options ?? []).every((o) => o.label.length <= 42)

  function handleSelect(option: ChoiceOption) {
    setError('')
    // Limpa o campo complementar da opção anterior
    question.options?.forEach((o) => {
      if (o.followUp && o !== option) setAnswer(o.followUp.field, '')
    })
    setAnswer(question.notionField, optionValue(option))
    if (question.autoAdvance && !option.followUp) {
      setTimeout(() => onNext(), 280)
    }
  }

  function handleNext() {
    if (!value && question.required) {
      setError('Selecione uma opção para continuar.')
      return
    }
    if (followUp?.required && !followUpValue.trim()) {
      setError('Preencha o campo acima para continuar.')
      return
    }
    onNext()
  }

  const showButton = !question.autoAdvance || Boolean(followUp)

  return (
    <div className="flex flex-col gap-4">
      <div className={`grid gap-2 grid-cols-1 ${twoColumns ? 'sm:grid-cols-2' : ''}`}>
        {question.options?.map((option) => {
          const isSelected = value === optionValue(option)
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              className="option"
              data-selected={isSelected ? 'true' : 'false'}
              aria-pressed={isSelected}
            >
              <span className="option-label block">{option.label}</span>
              {option.description && <span className="option-desc block">{option.description}</span>}
            </button>
          )
        })}
      </div>

      {followUp && (
        <FollowUpInput
          followUp={followUp}
          value={followUpValue}
          onChange={(v) => { setError(''); setAnswer(followUp.field, v) }}
          onEnter={handleNext}
          error={Boolean(error) && followUp.required && !followUpValue.trim()}
        />
      )}

      {error && <p className="msg-error">{error}</p>}

      {showButton && (
        <div className="flex justify-center pt-2">
          <Button onClick={handleNext}>Avançar</Button>
        </div>
      )}
    </div>
  )
}
