'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { questions } from '@/lib/questions'
import { FormAnswers } from '@/types/form'
import ProgressBar from '@/components/ProgressBar'
import Logo from '@/components/ui/Logo'
import TextQuestion from '@/components/questions/TextQuestion'
import SingleChoice from '@/components/questions/SingleChoice'
import MultiChoice from '@/components/questions/MultiChoice'
import TextAreaQuestion from '@/components/questions/TextAreaQuestion'

const TOTAL = questions.length

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
}

export default function FormWrapper() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<FormAnswers>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const current = questions[step]
  const isLast = step === TOTAL - 1

  const getValue = useCallback(
    (id: string) => {
      const v = answers[id]
      if (current?.type === 'multi-choice') return (v as string[]) ?? []
      return (v as string) ?? ''
    },
    [answers, current]
  )

  function setAnswer(id: string, val: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: val }))
  }

  function goNext() {
    if (isLast) { handleSubmit(); return }
    setDirection(1)
    setStep((s) => s + 1)
  }

  function goBack() {
    if (step === 0) return
    setDirection(-1)
    setStep((s) => s - 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/comercial/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Erro ao enviar')
      router.push('/obrigado')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.')
      setSubmitting(false)
    }
  }

  function renderQuestion() {
    const q = current
    switch (q.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <TextQuestion
            key={q.id}
            question={q}
            value={getValue(q.notionField) as string}
            onChange={(v) => setAnswer(q.notionField, v)}
            onNext={goNext}
          />
        )
      case 'single-choice':
        return (
          <SingleChoice
            key={q.id}
            question={q}
            value={getValue(q.notionField) as string}
            onChange={(v) => setAnswer(q.notionField, v)}
            onNext={goNext}
          />
        )
      case 'multi-choice':
        return (
          <MultiChoice
            key={q.id}
            question={q}
            value={getValue(q.notionField) as string[]}
            onChange={(v) => setAnswer(q.notionField, v)}
            onNext={goNext}
          />
        )
      case 'textarea':
        return (
          <TextAreaQuestion
            key={q.id}
            question={q}
            value={getValue(q.notionField) as string}
            onChange={(v) => setAnswer(q.notionField, v)}
            onNext={goNext}
            isLast={isLast}
            loading={submitting}
          />
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>

      {/* Header sticky */}
      <header
        className="sticky top-0 z-10 backdrop-blur-sm px-6 pt-6 pb-5"
        style={{ background: 'rgba(244,241,234,0.92)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-form mx-auto flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1 w-fit">
              <Logo />
              <p style={{ fontSize: '13px', color: 'var(--ink-light)', letterSpacing: '0.01em' }}>
                somos um estúdio brasileiro de design estratégico e criativo para marcas únicas.
              </p>
            </div>
            {step > 0 && (
              <button
                onClick={goBack}
                className="text-sm flex items-center gap-1 transition-colors"
                style={{ color: 'var(--ink-light)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ink-mid)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-light)'}
              >
                ← Voltar
              </button>
            )}
          </div>
          <ProgressBar current={step + 1} total={TOTAL} />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex items-start justify-center px-6 pt-12 pb-24">
        <div className="w-full max-w-form">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: 'easeInOut' }}
              className="flex flex-col gap-8"
            >
              {/* Pergunta */}
              <div className="flex flex-col gap-3">
                <h2
                  className="font-medium leading-snug"
                  style={{
                    fontSize: 'clamp(22px, 3vw, 28px)',
                    color: 'var(--ink)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {current.question}
                </h2>
              </div>

              {renderQuestion()}

              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-6 text-center">
        <p className="text-sm" style={{ color: 'var(--ink-light)' }}>
          Design é estratégia em movimento © VilaColab
        </p>
      </footer>
    </div>
  )
}
