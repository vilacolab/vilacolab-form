import { NextRequest, NextResponse } from 'next/server'
import { FormAnswers } from '@/types/form'
import { createNotionEntry } from '@/lib/notion'
import { sendNotificationEmail } from '@/lib/email'

const REQUIRED_FIELDS = [
  'nome',
  'whatsapp',
  'email',
  'empresa',
  'perfil',
  'segmento',
  'momento',
  'desafios',
  'estagio_marca',
  'disponibilidade',
  'motivacao',
]

export async function POST(req: NextRequest) {
  try {
    const body: FormAnswers = await req.json()

    // Validação dos campos obrigatórios
    for (const field of REQUIRED_FIELDS) {
      const val = body[field]
      if (!val || (Array.isArray(val) && val.length === 0)) {
        return NextResponse.json(
          { error: `Campo obrigatório ausente: ${field}` },
          { status: 400 }
        )
      }
    }

    // 1. Cria a entrada no Notion
    const notionUrl = await createNotionEntry(body)

    // 2. Envia e-mail de notificação (não bloqueia em caso de falha)
    try {
      await sendNotificationEmail(body, notionUrl)
    } catch (emailErr) {
      console.error('[email] Falha ao enviar notificação:', emailErr)
      // Não retorna erro para o usuário — o Notion já foi salvo
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[submit] Erro interno:', err)
    return NextResponse.json(
      { error: 'Ocorreu um erro ao enviar. Por favor, tente novamente.' },
      { status: 500 }
    )
  }
}
