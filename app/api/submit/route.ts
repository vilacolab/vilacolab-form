import { NextRequest, NextResponse } from 'next/server'
import { FormAnswers } from '@/types/form'
import { REQUIRED_FIELDS, FOLLOW_UPS } from '@/lib/questions'
import { list, str } from '@/lib/format'
import { createNotionEntry, createCRMEntry } from '@/lib/notion'
import { sendNotificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body: FormAnswers = await req.json()

    // Campos obrigatórios
    for (const field of REQUIRED_FIELDS) {
      const val = body[field]
      if (!val || (Array.isArray(val) ? val.length === 0 : !String(val).trim())) {
        return NextResponse.json({ error: `Campo obrigatório ausente: ${field}` }, { status: 400 })
      }
    }

    // Campos complementares obrigatórios (ex.: "Outro. Qual?", "Quem indicou?")
    for (const { parentField, value, followUp } of FOLLOW_UPS) {
      if (followUp.required && list(body, parentField).includes(value) && !str(body, followUp.field)) {
        return NextResponse.json({ error: `Campo obrigatório ausente: ${followUp.field}` }, { status: 400 })
      }
    }

    // 1. Banco de respostas do formulário
    const notionUrl = await createNotionEntry(body)

    // 2. Card no CRM (não bloqueia em caso de falha)
    try {
      await createCRMEntry(body)
    } catch (crmErr) {
      console.error('[crm] Falha ao criar entrada no CRM:', crmErr)
    }

    // 3. E-mail de notificação (não bloqueia em caso de falha)
    try {
      await sendNotificationEmail(body, notionUrl)
    } catch (emailErr) {
      console.error('[email] Falha ao enviar notificação:', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[submit] Erro interno:', msg)
    return NextResponse.json({ error: 'Ocorreu um erro ao enviar. Por favor, tente novamente.' }, { status: 500 })
  }
}
