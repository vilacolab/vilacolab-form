export type QuestionType =
  | 'text'
  | 'email'
  | 'tel'
  | 'single-choice'
  | 'multi-choice'
  | 'textarea'

// Campo curto que abre ao escolher uma opção (ex.: "Outro. Qual?")
export interface FollowUp {
  field: string        // chave da resposta e propriedade no Notion
  label?: string       // pergunta curta exibida acima do campo
  placeholder?: string
  required: boolean
}

export interface ChoiceOption {
  id: string
  label: string        // texto exibido
  description?: string // texto de apoio da opção
  value?: string       // valor gravado no Notion (se diferente do label)
  followUp?: FollowUp
}

export interface Question {
  id: string                  // P1, P2 … P15
  notionField: string         // nome do campo no Notion
  type: QuestionType
  question: string
  placeholder?: string
  sublabel?: string           // texto de apoio, exibido abaixo da pergunta
  required: boolean
  options?: ChoiceOption[]    // para single/multi-choice
  autoAdvance?: boolean       // single-choice avança sozinho ao clicar
}

export type FormAnswers = Record<string, string | string[]>

export function optionValue(option: ChoiceOption): string {
  return option.value ?? option.label
}
