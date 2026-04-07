import { Client } from '@notionhq/client'
import { FormAnswers } from '@/types/form'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const DATABASE_ID = process.env.NOTION_DATABASE_ID!

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
        url: answers.instagram ? String(answers.instagram) : null,
      },
      perfil: {
        select: answers.perfil ? { name: String(answers.perfil) } : null,
      },
      segmento: {
        select: answers.segmento ? { name: String(answers.segmento) } : null,
      },
      momento: {
        select: answers.momento ? { name: String(answers.momento) } : null,
      },
      desafios: {
        multi_select: Array.isArray(answers.desafios)
          ? answers.desafios.map((d) => ({ name: d }))
          : [],
      },
      estagio_marca: {
        select: answers.estagio_marca ? { name: String(answers.estagio_marca) } : null,
      },
      disponibilidade: {
        select: answers.disponibilidade ? { name: String(answers.disponibilidade) } : null,
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

  return response.url
}
