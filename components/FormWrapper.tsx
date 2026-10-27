'use client'

import { useState, useCallback } from 'react'
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

// Rótulo do bloco exibido acima de cada pergunta (até qual número vai cada bloco)
const BLOCKS: { until: number; name: string }[] = [
  { until: 5, name: 'Contato' },
  { until: 8, name: 'Quem é você' },
  { until: 10, name: 'Seu momento' },
  { until: 11, name: 'Seus desafios' },
  { until: 15, name: 'Como seguimos' },
]
const blockFor = (n: number) => BLOCKS.find((b) => n <= b.until)?.name ?? ''
const pad = (n: number) => String(n).padStart(2, '0')

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
      router.push('/comercial/obrigado')
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <header className="px-6 pt-6 pb-5 flex flex-col items-center gap-4 text-center" style={{ borderBottom: '1px solid var(--line)' }}>
          <Logo width={94} />
          <p className="t-tagline max-w-[560px]">
            somos um estúdio brasileiro de design estratégico e criativo para marcas únicas.
          </p>
        </header>

        <main className="flex-1 flex flex-col items-center py-10 overflow-x-clip">
          <div className="w-full mb-10">
            <ReelBanner />
          </div>

          <div className="w-full max-w-[880px] flex flex-col items-center gap-8 px-6 text-center">
            <h1 className="t-display" style={{ fontSize: 'clamp(38px, 6.4vw, 72px)' }}>
              Antes de conversarmos,
              <br />
              queremos conhecer <strong>seu negócio.</strong>
            </h1>
            <div className="flex flex-col gap-3 max-w-[540px]">
              <p className="t-support" style={{ fontSize: '17px' }}>
                Preparamos algumas perguntas para entender seu momento, seus desafios e o que você
                busca para sua marca. O preenchimento leva aproximadamente 4 minutos.
              </p>
              <p className="t-support" style={{ fontSize: '17px' }}>Responda com suas palavras.</p>
            </div>
            <button type="button" onClick={() => setStarted(true)} className="btn">
              Começar
            </button>
          </div>
        </main>

        <footer className="pb-6 pt-4 text-center">
          <p className="t-label" style={{ color: 'var(--ink-3)', letterSpacing: '0.06em' }}>
            Design é estratégia em movimento © VilaColab
          </p>
        </footer>
      </motion.div>
    )
  }

  // ── Formulário ───────────────────────────────────────────────────────
  const number = step + 1

  return (
    <div className="min-h-screen flex flex-col">

      {/* Cabeçalho fixo: voltar · logo · contador */}
      <header className="sticky top-0 z-10 px-6 pt-4 pb-3" style={{ background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(6px)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-[880px] mx-auto flex flex-col gap-3">
          <div className="grid grid-cols-3 items-center">
            <div>
              {step > 0 && (
                <button type="button" onClick={goBack} className="link">
                  Voltar
                </button>
              )}
            </div>
            <div className="flex justify-center">
              <Logo width={66} />
            </div>
            <p className="t-label text-right" style={{ letterSpacing: '0.06em' }}>
              {pad(number)}/{pad(TOTAL)}
            </p>
          </div>
          <ProgressBar current={number} total={TOTAL} />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex items-start justify-center px-6 pt-12 pb-24 overflow-x-clip">
        <div className="w-full max-w-[640px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: 'easeInOut' }}
              className="flex flex-col gap-9"
            >
              {/* Pergunta */}
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="t-label">{blockFor(number)}</p>
                <h2 className="t-display" style={{ fontSize: 'clamp(30px, 5vw, 46px)', lineHeight: 1.04 }}>
                  {current.question}
                </h2>
                {current.sublabel && (
                  <p className="t-support max-w-[540px]">{current.sublabel}</p>
                )}
              </div>

              {renderQuestion()}

              {submitError && <p className="msg-error text-center">{submitError}</p>}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="pb-6 text-center">
        <p className="t-label" style={{ color: 'var(--ink-3)', letterSpacing: '0.06em' }}>
          Design é estratégia em movimento © VilaColab
        </p>
      </footer>
    </div>
  )
}
