'use client'

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  loading?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--ink)] disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-[var(--ink)] text-[var(--white)] hover:opacity-80 active:scale-[0.98] px-7 py-[0.85rem]',
    ghost:
      'bg-transparent text-[var(--ink)] border border-[var(--border-md)] hover:border-[var(--border-dk)] active:scale-[0.98] px-7 py-[0.85rem]',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Enviando...
        </>
      ) : (
        children
      )}
    </button>
  )
}
