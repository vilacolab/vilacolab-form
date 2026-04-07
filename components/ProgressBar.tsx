'use client'

interface ProgressBarProps {
  current: number  // 1-based
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div
      className="flex gap-1 w-full"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-[2px] rounded-full transition-colors duration-300"
          style={{
            background: i < current ? 'var(--ink)' : 'var(--cream-dd)',
          }}
        />
      ))}
    </div>
  )
}
