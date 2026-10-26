'use client'

import { useState, useCallback, useEffect } from 'react'
import ReelBanner from './ReelBanner'
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
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [answers, setAnswers] = useState<FormAnswers>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const current = questions[step]
  const isLast = step === TOTAL - 1

  // Link de parceiro (ex.: ?ref=flavia). Fica separado da origem que a pessoa declara na P8.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('ref')
    if (ref) setAnswers((prev) => ({ ...prev, ref_link: ref.trim().slice(0, 100) }))
  }, [])

  const getValue = useCallback(
    (id: string) => (answers[id] as string) ?? '',
    [answers]
  )

  const setAnswer = useCallback((id: string, val: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: val }))
  }, [])

  function goNext() {
    if (isLast) { handleSubmit(); return }
    setDirection(1)
    setStep((s) => s + 1)
    window.scrollTo({ top: 0 })
  }

  function goBack() {
    if (step === 0) return
    setDirection(-1)
    setStep((s) => s - 1)
    window.scrollTo({ top: 0 })
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/submit', {
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
            value={getValue(q.notionField)}
            onChange={(v) => setAnswer(q.notionField, v)}
            onNext={goNext}
          />
        )
      case 'single-choice':
        return (
          <SingleChoice
            key={q.id}
            question={q}
            answers={answers}
            setAnswer={setAnswer}
            onNext={goNext}
          />
        )
      case 'multi-choice':
        return (
          <MultiChoice
            key={q.id}
            question={q}
            answers={answers}
            setAnswer={setAnswer}
            onNext={goNext}
          />
        )
      case 'textarea':
        return (
          <TextAreaQuestion
            key={q.id}
            question={q}
            value={getValue(q.notionField)}
            onChange={(v) => setAnswer(q.notionField, v)}
            onNext={goNext}
            isLast={isLast}
            loading={submitting}
          />
        )
    }
  }

  // ── Tela de abertura ─────────────────────────────────────────────────
  if (!started) {
    return (
      <motion.div
        className="min-h-screen flex flex-col"
        style={{ background: 'var(--cream)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <header className="px-6 pt-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-form mx-auto">
            <div className="flex flex-col gap-1 w-fit">
              <Logo />
              <p style={{ fontSize: '15px', color: 'var(--ink-light)', letterSpacing: '0.01em' }}>
                somos um estúdio brasileiro de design estratégico e criativo para marcas únicas.
              </p>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 flex flex-col items-center justify-center py-12">

          {/* Reel full-width */}
          <div className="w-full mb-8">
            <ReelBanner />
          </div>

          <div className="w-full max-w-form flex flex-col gap-8 px-6">

            {/* Texto */}
            <div className="flex flex-col gap-4">
              <h1
                className="font-medium leading-snug"
                style={{ fontSize: 'clamp(26px, 4vw, 36px)', color: 'var(--ink)', letterSpacing: '-0.02em' }}
              >
                Antes de conversarmos, queremos conhecer seu negócio.
              </h1>
              <p style={{ fontSize: '16px', lineHeight: '1.65', color: 'var(--ink-mid)', maxWidth: '520px' }}>
                Preparamos algumas perguntas para entender seu momento, seus desafios e o que você busca
                para sua marca. O preenchimento leva aproximadamente 6 minutos.
              </p>
              <p style={{ fontSize: '16px', lineHeight: '1.65', color: 'var(--ink-mid)', maxWidth: '520px' }}>
                Responda com suas palavras. Não existem respostas certas ou erradas.
              </p>
            </div>

            {/* Botão */}
            <div>
              <button
                onClick={() => setStarted(true)}
                className="inline-flex items-center gap-2 font-medium transition-opacity hover:opacity-70"
                style={{
                  background: 'var(--ink)',
                  color: 'var(--cream)',
                  fontSize: '15px',
                  padding: '14px 32px',
                  borderRadius: '6px',
                  letterSpacing: '0.01em',
                }}
              >
                Começar →
              </button>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="pb-6 text-center">
          <p className="text-sm" style={{ color: 'var(--ink-light)' }}>
            Design é estratégia em movimento © VilaColab
          </p>
        </footer>
      </motion.div>
    )
  }

  // ── Formulário ───────────────────────────────────────────────────────
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
              <p style={{ fontSize: '15px', color: 'var(--ink-light)', letterSpacing: '0.01em' }}>
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
      <main className="flex-1 flex items-start justify-center px-6 pt-12 pb-24 overflow-x-clip">
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
                {current.sublabel && (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-light)', maxWidth: '560px' }}>
                    {current.sublabel}
                  </p>
                )}
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
