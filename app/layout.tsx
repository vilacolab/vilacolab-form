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
      <body>{children}</body>
    </html>
  )
}
