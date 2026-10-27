import Logo from '@/components/ui/Logo'

function Heart() {
  return (
    <svg aria-hidden width="18" height="16" viewBox="0 0 24 21" style={{ display: 'inline-block', verticalAlign: '-2px' }}>
      <path
        fill="var(--accent)"
        d="M12 21s-1.4-.9-3.3-2.4C5.2 15.8 0 11.6 0 6.6 0 3 2.8 0 6.3 0c2.2 0 4 1.1 5.7 3.2C13.7 1.1 15.5 0 17.7 0 21.2 0 24 3 24 6.6c0 5-5.2 9.2-8.7 12-1.9 1.5-3.3 2.4-3.3 2.4z"
      />
    </svg>
  )
}

export default function ObrigadoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 pt-6 pb-5 flex flex-col items-center gap-4 text-center" style={{ borderBottom: '1px solid var(--line)' }}>
        <Logo width={94} />
        <p className="t-tagline max-w-[720px]">
          somos um estúdio brasileiro de design estratégico e criativo para marcas únicas.
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[640px] flex flex-col items-center gap-6 text-center">
          <h1 className="t-display" style={{ fontSize: 'clamp(44px, 7vw, 76px)' }}>
            Recebemos suas <strong>respostas!</strong>
          </h1>
          <p className="t-support max-w-[520px]" style={{ fontSize: '17px' }}>
            Obrigada por compartilhar um pouco do seu negócio com a gente. Vamos ler suas respostas
            com atenção e entrar em contato pelo WhatsApp em até 2 dias úteis para conversar sobre
            os próximos passos.
          </p>
          <p className="t-tagline flex items-center gap-2">
            VilaColab <Heart />
          </p>
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
