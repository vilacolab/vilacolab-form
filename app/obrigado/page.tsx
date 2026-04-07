import Logo from '@/components/ui/Logo'
import Link from 'next/link'

export default function ObrigadoPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--cream)' }}
    >
      <div className="w-full max-w-lg flex flex-col items-center text-center gap-10">

        {/* Logo */}
        <Logo />

        {/* Divisor */}
        <div className="w-full" style={{ borderTop: '1px solid var(--border-md)' }} />

        {/* Ícone de sucesso */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'var(--cream-d)', border: '1px solid var(--border-md)' }}
        >
          <svg
            className="w-7 h-7"
            style={{ color: 'var(--ink)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Mensagem */}
        <div className="flex flex-col gap-3">
          <h1
            className="font-medium leading-tight"
            style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
            }}
          >
            Recebemos sua mensagem!
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--ink-mid)' }}>
            Em breve entro em contato para conversarmos sobre o seu projeto.
            Fique de olho no seu WhatsApp e e-mail.
          </p>
        </div>

        {/* Divisor */}
        <div className="w-full" style={{ borderTop: '1px solid var(--border)' }} />

        {/* Link pro site */}
        <Link
          href="https://www.vilacolab.com.br"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm transition-colors"
          style={{ color: 'var(--ink-mid)' }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
            (e.currentTarget.style.color = 'var(--ink)')
          }
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
            (e.currentTarget.style.color = 'var(--ink-mid)')
          }
        >
          Conheça o nosso trabalho →
        </Link>

        <p className="text-xs italic" style={{ color: 'var(--ink-light)' }}>
          Design é estratégia em movimento © VilaColab
        </p>

      </div>
    </div>
  )
}
