import { Resend } from 'resend'
import { FormAnswers } from '@/types/form'

const resend = new Resend(process.env.RESEND_API_KEY)

function formatList(value: string | string[] | undefined): string {
  if (!value) return '—'
  if (Array.isArray(value)) return value.join(', ')
  return value
}

export async function sendNotificationEmail(
  answers: FormAnswers,
  notionUrl: string
): Promise<void> {
  const nome = String(answers.nome ?? '')
  const empresa = String(answers.empresa ?? '')
  const whatsapp = String(answers.whatsapp ?? '')
  const email = String(answers.email ?? '')
  const instagram = answers.instagram ? String(answers.instagram) : '—'
  const waLink = `https://wa.me/55${whatsapp.replace(/\D/g, '')}`

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Novo prospecto VilaColab</title>
    </head>
    <body style="margin:0;padding:0;background:#FAFAFA;font-family:'Inter',Arial,sans-serif;color:#1A1A2E;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

              <!-- Header -->
              <tr>
                <td style="background:#6C63FF;padding:32px 40px;">
                  <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">🔔 Novo prospecto chegou!</p>
                  <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.8);">Formulário de qualificação — VilaColab</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px 40px;">

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:24px;border-bottom:1px solid #F0F0F0;">
                        <p style="margin:0 0 4px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#6C63FF;">Contato</p>
                        <p style="margin:0;font-size:20px;font-weight:700;">${nome}</p>
                        <p style="margin:4px 0 0;font-size:15px;color:#555;">${empresa}${instagram !== '—' ? ` &nbsp;·&nbsp; <a href="https://instagram.com/${instagram.replace('@', '')}" style="color:#6C63FF;">${instagram}</a>` : ''}</p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding:20px 0;border-bottom:1px solid #F0F0F0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="50%" style="padding-right:12px;">
                              <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#999;">WhatsApp</p>
                              <a href="${waLink}" style="color:#6C63FF;font-size:15px;font-weight:600;text-decoration:none;">${whatsapp}</a>
                            </td>
                            <td width="50%">
                              <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#999;">E-mail</p>
                              <a href="mailto:${email}" style="color:#6C63FF;font-size:15px;font-weight:600;text-decoration:none;">${email}</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    ${row('Perfil', formatList(answers.perfil))}
                    ${row('Segmento', formatList(answers.segmento))}
                    ${row('Momento', formatList(answers.momento))}
                    ${row('Estágio da marca', formatList(answers.estagio_marca))}
                    ${row('Disponibilidade', formatList(answers.disponibilidade))}
                    ${row('Desafios', formatList(answers.desafios))}
                  </table>

                  <!-- Motivação -->
                  <div style="margin-top:24px;padding:20px;background:#F4F3FF;border-left:4px solid #6C63FF;border-radius:0 8px 8px 0;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#6C63FF;">O que te trouxe até aqui</p>
                    <p style="margin:0;font-size:15px;line-height:1.6;font-style:italic;">"${formatList(answers.motivacao)}"</p>
                  </div>

                  <!-- CTA Notion -->
                  <div style="margin-top:32px;text-align:center;">
                    <a href="${notionUrl}" style="display:inline-block;background:#6C63FF;color:#ffffff;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">
                      Ver no Notion →
                    </a>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px;background:#F4F3FF;border-top:1px solid #E8E6FF;">
                  <p style="margin:0;font-size:13px;color:#888;text-align:center;">
                    VilaColab — <em>Design é estratégia em movimento</em>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: process.env.NOTIFICATION_EMAIL!,
    subject: `🔔 Novo prospecto no formulário VilaColab — ${nome} (${empresa})`,
    html,
  })
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #F0F0F0;">
        <p style="margin:0 0 2px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#999;">${label}</p>
        <p style="margin:0;font-size:14px;">${value || '—'}</p>
      </td>
    </tr>
  `
}
