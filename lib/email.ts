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
    <body style="margin:0;padding:0;background:#F4F1EA;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;color:#1C1B18;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EA;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="580" cellpadding="0" cellspacing="0" style="background:#FDFCF9;border:1px solid rgba(28,27,24,0.10);">

              <!-- Header -->
              <tr>
                <td style="padding:32px 40px 28px;border-bottom:1px solid rgba(28,27,24,0.10);">
                  <p style="margin:0 0 2px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#96958E;">Formulário de qualificação</p>
                  <p style="margin:0;font-size:22px;font-weight:500;letter-spacing:-0.02em;color:#1C1B18;">Novo prospecto chegou.</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px 40px;">

                  <table width="100%" cellpadding="0" cellspacing="0">

                    <!-- Nome / Empresa -->
                    <tr>
                      <td style="padding-bottom:24px;border-bottom:1px solid rgba(28,27,24,0.10);">
                        <p style="margin:0 0 6px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#96958E;">Contato</p>
                        <p style="margin:0 0 2px;font-size:20px;font-weight:500;letter-spacing:-0.02em;">${nome}</p>
                        <p style="margin:0;font-size:14px;color:#4E4D48;">${empresa}${instagram !== '—' ? ` &nbsp;·&nbsp; <a href="https://instagram.com/${instagram.replace('@','')}" style="color:#1C1B18;text-decoration:underline;">${instagram}</a>` : ''}</p>
                      </td>
                    </tr>

                    <!-- WhatsApp / E-mail -->
                    <tr>
                      <td style="padding:20px 0;border-bottom:1px solid rgba(28,27,24,0.10);">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="50%" style="padding-right:12px;">
                              <p style="margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#96958E;">WhatsApp</p>
                              <a href="${waLink}" style="color:#1C1B18;font-size:15px;font-weight:500;text-decoration:underline;">${whatsapp}</a>
                            </td>
                            <td width="50%">
                              <p style="margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#96958E;">E-mail</p>
                              <a href="mailto:${email}" style="color:#1C1B18;font-size:15px;font-weight:500;text-decoration:underline;">${email}</a>
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
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                    <tr>
                      <td style="padding:20px 24px;background:#EAE6DC;border-left:2px solid #1C1B18;">
                        <p style="margin:0 0 6px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#96958E;">O que te trouxe até aqui</p>
                        <p style="margin:0;font-size:15px;line-height:1.65;color:#1C1B18;font-style:italic;">"${formatList(answers.motivacao)}"</p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Notion -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                    <tr>
                      <td>
                        <a href="${notionUrl}" style="display:inline-block;background:#1C1B18;color:#F4F1EA;font-size:14px;font-weight:500;padding:13px 28px;text-decoration:none;letter-spacing:0.01em;">
                          Ver no Notion →
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px;border-top:1px solid rgba(28,27,24,0.10);">
                  <p style="margin:0;font-size:12px;color:#96958E;">
                    Design é estratégia em movimento © VilaColab
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
      <td style="padding:14px 0;border-bottom:1px solid rgba(28,27,24,0.10);">
        <p style="margin:0 0 3px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#96958E;">${label}</p>
        <p style="margin:0;font-size:14px;color:#1C1B18;">${value || '—'}</p>
      </td>
    </tr>
  `
}
