import { Resend } from 'resend'
import { FormAnswers } from '@/types/form'
import { labelFor } from '@/lib/questions'
import { str, readable, originSummary, followUpText, sanitizeUrl, waLink, esc } from '@/lib/format'

const resend = new Resend(process.env.RESEND_API_KEY)

const LABEL = 'margin:0 0 4px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#96958E;'
const LINE = 'border-bottom:1px solid rgba(28,27,24,0.10);'

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:14px 0;${LINE}">
        <p style="${LABEL}">${esc(label)}</p>
        <p style="margin:0;font-size:14px;line-height:1.55;color:#1C1B18;">${esc(value || '-')}</p>
      </td>
    </tr>`
}

function quote(label: string, value: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
      <tr>
        <td style="padding:20px 24px;background:#EAE6DC;border-left:2px solid #1C1B18;">
          <p style="${LABEL}margin-bottom:6px;">${esc(label)}</p>
          <p style="margin:0;font-size:15px;line-height:1.65;color:#1C1B18;font-style:italic;">“${esc(value || '-')}”</p>
        </td>
      </tr>
    </table>`
}

export async function sendNotificationEmail(answers: FormAnswers, notionUrl: string): Promise<void> {
  const nome = str(answers, 'nome')
  const empresa = str(answers, 'empresa')
  const whatsapp = str(answers, 'whatsapp')
  const email = str(answers, 'email')
  const marcaRaw = str(answers, 'instagram')
  const marcaUrl = sanitizeUrl(marcaRaw)
  const dataImportante = followUpText(answers, 'data_importante')
  const prazo = labelFor('prazo', str(answers, 'prazo')) + (dataImportante ? ` · data importante: ${dataImportante}` : '')

  const marcaHtml = marcaRaw
    ? ` &nbsp;·&nbsp; ${marcaUrl
        ? `<a href="${esc(marcaUrl)}" style="color:#1C1B18;text-decoration:underline;">${esc(marcaRaw)}</a>`
        : esc(marcaRaw)}`
    : ''

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Novo contato VilaColab</title>
    </head>
    <body style="margin:0;padding:0;background:#F4F1EA;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;color:#1C1B18;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EA;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="580" cellpadding="0" cellspacing="0" style="background:#FDFCF9;border:1px solid rgba(28,27,24,0.10);">

              <tr>
                <td style="padding:32px 40px 28px;${LINE}">
                  <p style="${LABEL}margin-bottom:2px;">Formulário de primeiro contato</p>
                  <p style="margin:0;font-size:22px;font-weight:500;letter-spacing:-0.02em;color:#1C1B18;">Novo contato chegou.</p>
                </td>
              </tr>

              <tr>
                <td style="padding:32px 40px;">

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:24px;${LINE}">
                        <p style="${LABEL}margin-bottom:6px;">Contato</p>
                        <p style="margin:0 0 2px;font-size:20px;font-weight:500;letter-spacing:-0.02em;">${esc(nome)}</p>
                        <p style="margin:0;font-size:14px;color:#4E4D48;">${esc(empresa)}${marcaHtml}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 0;${LINE}">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td width="50%" style="padding-right:12px;">
                              <p style="${LABEL}">WhatsApp</p>
                              <a href="${esc(waLink(whatsapp))}" style="color:#1C1B18;font-size:15px;font-weight:500;text-decoration:underline;">${esc(whatsapp)}</a>
                            </td>
                            <td width="50%">
                              <p style="${LABEL}">E-mail</p>
                              <a href="mailto:${esc(email)}" style="color:#1C1B18;font-size:15px;font-weight:500;text-decoration:underline;">${esc(email)}</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    ${row('Como chegou', originSummary(answers))}
                  </table>

                  ${quote('O que gostaria que entendessem sobre o negócio', str(answers, 'ponto_de_vista'))}
                  ${quote('O que fez olhar para a marca agora', str(answers, 'motivacao'))}

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                    ${row('Formatos de interesse', readable(answers, 'formatos_de_interesse'))}
                    ${row('Quando quer começar', prazo)}
                    ${row('Participação no projeto', readable(answers, 'disponibilidade'))}
                    ${row('Como se descreve', readable(answers, 'perfil'))}
                    ${row('Segmento', readable(answers, 'segmento'))}
                    ${row('Momento do negócio', readable(answers, 'momento'))}
                    ${row('Desafios da marca hoje', readable(answers, 'desafios'))}
                  </table>

                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
                    <tr>
                      <td>
                        <a href="${esc(notionUrl)}" style="display:inline-block;background:#1C1B18;color:#F4F1EA;font-size:14px;font-weight:500;padding:13px 28px;text-decoration:none;letter-spacing:0.01em;">
                          Ver no Notion →
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <tr>
                <td style="padding:20px 40px;border-top:1px solid rgba(28,27,24,0.10);">
                  <p style="margin:0;font-size:12px;color:#96958E;">Design é estratégia em movimento © VilaColab</p>
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
    subject: `🔔 Novo contato no formulário VilaColab: ${nome} (${empresa})`,
    html,
  })
}
