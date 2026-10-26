import { FormAnswers } from '@/types/form'
import { FOLLOW_UPS, labelFor } from '@/lib/questions'

/** Texto simples de uma resposta, sem espaços nas pontas */
export function str(answers: FormAnswers, key: string): string {
  const v = answers[key]
  if (Array.isArray(v)) return v.join(', ').trim()
  return v ? String(v).trim() : ''
}

export function list(answers: FormAnswers, key: string): string[] {
  const v = answers[key]
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean)
  return v ? [String(v).trim()] : []
}

/**
 * Valor do campo complementar (ex.: "Outro. Qual?") apenas quando a opção que o abre
 * está de fato escolhida. Evita gravar texto de uma opção que a pessoa desmarcou.
 */
export function followUpText(answers: FormAnswers, field: string): string {
  const fu = FOLLOW_UPS.find((f) => f.followUp.field === field)
  if (!fu) return ''
  const parent = list(answers, fu.parentField)
  return parent.includes(fu.value) ? str(answers, field) : ''
}

/** Resposta de escolha com o texto lido pela pessoa e o complemento, se houver */
export function readable(answers: FormAnswers, field: string): string {
  const values = list(answers, field)
  if (values.length === 0) return ''
  return values
    .map((v) => {
      const label = labelFor(field, v)
      const fu = FOLLOW_UPS.find((f) => f.parentField === field && f.value === v)
      const extra = fu ? followUpText(answers, fu.followUp.field) : ''
      return extra ? `${label}: ${extra}` : label
    })
    .join(' | ')
}

/** Resumo da origem declarada pela pessoa (com quem indicou ou o "Outro") */
export function originSummary(answers: FormAnswers): string {
  return readable(answers, 'origem')
}

// Notion: sem vírgulas e no máximo 100 caracteres em nomes de select/multi_select
export function sanitizeOption(value: string): string {
  const cleaned = value.replace(/,/g, ' ·').trim()
  return cleaned.length > 100 ? cleaned.slice(0, 97) + '...' : cleaned
}

/**
 * Aceita @perfil, instagram.com/perfil, site.com.br ou link completo.
 * Retorna null se não for possível montar um link válido.
 */
export function sanitizeUrl(value: unknown): string | null {
  const raw = value ? String(value).trim() : ''
  if (!raw) return null
  let url = raw.replace(/\s+/g, '')
  if (url.startsWith('@')) url = `https://www.instagram.com/${url.slice(1)}`
  else if (!url.includes('.') && /^[\w.]+$/.test(url)) url = `https://www.instagram.com/${url}`
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('.')) return null
    return parsed.toString()
  } catch {
    return null
  }
}

export function sanitizeEmail(value: unknown): string | null {
  const raw = value ? String(value).trim() : ''
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : null
}

/** Link de WhatsApp: número do Brasil ganha 55; número com + mantém o código do país */
export function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return phone.trim().startsWith('+') ? `https://wa.me/${digits}` : `https://wa.me/55${digits}`
}

/** Escapa texto para HTML (e-mail) */
export function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
