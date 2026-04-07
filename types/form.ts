export type QuestionType =
  | 'text'
  | 'email'
  | 'tel'
  | 'single-choice'
  | 'multi-choice'
  | 'textarea'

export interface ChoiceOption {
  id: string
  label: string
  sublabel?: string // nota em itálico menor (P8)
}

export interface Question {
  id: string                  // P1, P2 … P12
  notionField: string         // nome do campo no Notion
  type: QuestionType
  question: string
  placeholder?: string
  sublabel?: string
  required: boolean
  options?: ChoiceOption[]    // para single/multi-choice
  autoAdvance?: boolean       // single-choice avança sozinho ao clicar
}

export type FormAnswers = Record<string, string | string[]>
