import { Client } from '@notionhq/client'
import { FormAnswers } from '@/types/form'
import { labelFor } from '@/lib/questions'
import {
  str, list, followUpText, readable, originSummary,
  sanitizeOption, sanitizeUrl, sanitizeEmail,
} from '@/lib/format'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const DATABASE_ID = process.env.NOTION_DATABASE_ID!
const CRM_DATABASE_ID = '4a69244678a74a4490e4cd13723cfb9b'

// ── Formatos de propriedade ─────────────────────────────────────────────

function rt(content: string) {
  return { rich_text: content ? [{ text: { content: content.slice(0, 2000) } }] : [] }
}

function select(value: string) {
  return { select: value ? { name: sanitizeOption(value) } : null }
}

function multi(values: string[]) {
  return { multi_select: values.map((v) => ({ name: sanitizeOption(v) })) }
}

// ── Banco "Formulário VilaColab · Prospectos" ───────────────────────────

export async function createNotionEntry(answers: FormAnswers): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: {
      nome: { title: [{ text: { content: str(answers, 'nome').slice(0, 200) } }] },
      whatsapp: { phone_number: str(answers, 'whatsapp').replace(/[^\d\s+\-().]/g, '') },
      email: { email: sanitizeEmail(answers.email) ?? str(answers, 'email') },
      empresa: rt(str(answers, 'empresa')),
      instagram: { url: sanitizeUrl(answers.instagram) },

      perfil: select(str(answers, 'perfil')),
      perfil_outro: rt(followUpText(answers, 'perfil_outro')),
      segmento: select(str(answers, 'segmento')),
      segmento_outro: rt(followUpText(answers, 'segmento_outro')),

      origem: select(str(answers, 'origem')),
      indicado_por: rt(followUpText(answers, 'indicado_por')),
      origem_outro: rt(followUpText(answers, 'origem_outro')),

      ponto_de_vista: rt(str(answers, 'ponto_de_vista')),
      momento: select(str(answers, 'momento')),
      momento_outro: rt(followUpText(answers, 'momento_outro')),

      desafios: multi(list(answers, 'desafios')),
      desafios_outro: rt(followUpText(answers, 'desafios_outro')),

      prazo: select(str(answers, 'prazo')),
      data_importante: rt(followUpText(answers, 'data_importante')),
      formatos_de_interesse: multi(list(answers, 'formatos_de_interesse')),
      disponibilidade: select(str(answers, 'disponibilidade')),
      motivacao: rt(str(answers, 'motivacao')),

      data_envio: { date: { start: new Date().toISOString() } },
      status: { select: { name: 'Novo' } },
    },
  })

  const pageId = response.id.replace(/-/g, '')
  return `https://www.notion.so/${pageId}`
}

// ── Card no CRM ─────────────────────────────────────────────────────────

function txt(content: string) {
  return [{ text: { content: content.slice(0, 2000) } }]
}

function heading(content: string) {
  return { object: 'block' as const, type: 'heading_3' as const, heading_3: { rich_text: txt(content) } }
}

function paragraph(content: string) {
  return { object: 'block' as const, type: 'paragraph' as const, paragraph: { rich_text: txt(content || '-') } }
}

function bullets(items: string[]) {
  if (items.length === 0) return [paragraph('-')]
  return items.map((item) => ({
    object: 'block' as const,
    type: 'bulleted_list_item' as const,
    bulleted_list_item: { rich_text: txt(item) },
  }))
}

function divider() {
  return { object: 'block' as const, type: 'divider' as const, divider: {} }
}

export async function createCRMEntry(answers: FormAnswers): Promise<void> {
  const split = (field: string) => readable(answers, field).split(' | ').filter(Boolean)
  const dataImportante = followUpText(answers, 'data_importante')

  await notion.pages.create({
    parent: { database_id: CRM_DATABASE_ID },
    properties: {
      Nome: { title: [{ text: { content: str(answers, 'nome') } }] },
      Empresa: { rich_text: txt(str(answers, 'empresa')) },
      Telefone: { phone_number: str(answers, 'whatsapp') },
      Email: { email: str(answers, 'email') },
      Status: { status: { name: 'Lead' } },
      Responsável: { multi_select: [{ name: 'Carol' }] },
    },
    children: [
      heading('Contato'),
      paragraph(`Nome: ${str(answers, 'nome')}`),
      paragraph(`Empresa ou projeto: ${str(answers, 'empresa')}`),
      paragraph(`WhatsApp: ${str(answers, 'whatsapp')}`),
      paragraph(`E-mail: ${str(answers, 'email')}`),
      paragraph(`Onde conhecer a marca: ${str(answers, 'instagram') || '-'}`),
      paragraph(`Como chegou: ${originSummary(answers) || '-'}`),

      divider(),

      heading('O que gostaria que entendessem sobre o negócio'),
      paragraph(str(answers, 'ponto_de_vista')),

      heading('O que fez olhar para a marca agora'),
      paragraph(str(answers, 'motivacao')),

      divider(),

      heading('Formatos de interesse'),
      ...bullets(split('formatos_de_interesse')),

      heading('Quando quer começar'),
      paragraph(labelFor('prazo', str(answers, 'prazo')) + (dataImportante ? ` · data importante: ${dataImportante}` : '')),

      heading('Participação no projeto'),
      paragraph(readable(answers, 'disponibilidade')),

      divider(),

      heading('Como se descreve'),
      paragraph(readable(answers, 'perfil')),

      heading('Segmento'),
      paragraph(readable(answers, 'segmento')),

      heading('Momento do negócio'),
      paragraph(readable(answers, 'momento')),

      heading('Desafios da marca hoje'),
      ...bullets(split('desafios')),
    ],
  })
}
