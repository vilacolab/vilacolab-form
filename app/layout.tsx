import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VilaColab | Bem-vindo 🍎',
  description:
    'Responda algumas perguntas para que possamos entender melhor o seu negócio e como podemos ajudar.',
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,200..600&family=Manrope:wght@400..800&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
