import { Client } from '@notionhq/client'
import { FormAnswers } from '@/types/form'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const DATABASE_ID = process.env.NOTION_DATABASE_ID!
const CRM_DATABASE_ID = '4a69244678a74a4490e4cd13723cfb9b'

// Notion: sem vírgulas e máximo 100 chars em nomes de select/multi_select
function sanitizeOption(value: string): string {
  const cleaned = value.replace(/,/g, ' —')
  return cleaned.length > 100 ? cleaned.slice(0, 97) + '...' : cleaned
}

export async function createNotionEntry(answers: FormAnswers): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: {
      // Title — campo principal
      nome: {
        title: [{ text: { content: String(answers.nome ?? '') } }],
      },
      whatsapp: {
        phone_number: String(answers.whatsapp ?? ''),
      },
      email: {
        email: String(answers.email ?? ''),
      },
      empresa: {
        rich_text: [{ text: { content: String(answers.empresa ?? '') } }],
      },
      instagram: {
        url: (() => {
          const ig = answers.instagram ? String(answers.instagram).trim() : ''
          if (!ig) return null
          // Remove @ e converte handle para URL completa
          if (ig.startsWith('@')) return `https://www.instagram.com/${ig.slice(1)}`
          // Adiciona https:// se não tiver protocolo
          if (!ig.startsWith('http://') && !ig.startsWith('https://')) return `https://${ig}`
          return ig
        })(),
      },
      perfil: {
        select: answers.perfil ? { name: sanitizeOption(String(answers.perfil)) } : null,
      },
      segmento: {
        select: answers.segmento ? { name: sanitizeOption(String(answers.segmento)) } : null,
      },
      momento: {
        select: answers.momento ? { name: sanitizeOption(String(answers.momento)) } : null,
      },
      desafios: {
        multi_select: Array.isArray(answers.desafios)
          ? answers.desafios.map((d) => ({ name: sanitizeOption(d) }))
          : [],
      },
      estagio_marca: {
        select: answers.estagio_marca ? { name: sanitizeOption(String(answers.estagio_marca)) } : null,
      },
      disponibilidade: {
        select: answers.disponibilidade ? { name: sanitizeOption(String(answers.disponibilidade)) } : null,
      },
      motivacao: {
        rich_text: [{ text: { content: String(answers.motivacao ?? '') } }],
      },
      data_envio: {
        date: { start: new Date().toISOString() },
      },
      status: {
        select: { name: 'Novo' },
      },
    },
  })

  // Constrói a URL da página a partir do ID (remove hífens)
  const pageId = response.id.replace(/-/g, '')
  return `https://www.notion.so/${pageId}`
}

export async function createCRMEntry(answers: FormAnswers): Promise<void> {
  await notion.pages.create({
    parent: { database_id: CRM_DATABASE_ID },
    properties: {
      Nome: {
        title: [{ text: { content: String(answers.nome ?? '') } }],
      },
      Empresa: {
        rich_text: [{ text: { content: String(answers.empresa ?? '') } }],
      },
      Telefone: {
        phone_number: String(answers.whatsapp ?? ''),
      },
      Email: {
        email: String(answers.email ?? ''),
      },
      Status: {
        status: { name: 'Lead' },
      },
      Responsável: {
        multi_select: [{ name: 'Carol' }],
      },
    },
  })
}
