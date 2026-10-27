'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FollowUp } from '@/types/form'

interface FollowUpInputProps {
  followUp: FollowUp
  value: string
  onChange: (val: string) => void
  onEnter: () => void
  error?: boolean
}

export default function FollowUpInput({ followUp, value, onChange, onEnter, error }: FollowUpInputProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [followUp.field])

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col gap-1 pt-2"
    >
      {followUp.label && (
        <label htmlFor={followUp.field} className="t-support" style={{ color: 'var(--ink)', fontWeight: 600 }}>
          {followUp.label}
        </label>
      )}
      <input
        id={followUp.field}
        ref={ref}
        type="text"
        value={value}
        maxLength={300}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter()}
        placeholder={followUp.placeholder}
        className="field"
        data-error={error ? 'true' : undefined}
      />
    </motion.div>
  )
}
