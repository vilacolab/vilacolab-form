import { Question, ChoiceOption, optionValue } from '@/types/form'

// Formulário de primeiro contato · v2 (out/2026) · 16 perguntas
// Regra de linguagem: sem travessões nos textos exibidos.

export const questions: Question[] = [
  // ── Bloco 1 · Contato ─────────────────────────────────────────────────
  {
    id: 'P1',
    notionField: 'nome',
    type: 'text',
    question: 'Como podemos chamar você?',
    placeholder: 'Seu nome',
    sublabel: 'Seu primeiro nome está ótimo :)',
    required: true,
  },
  {
    id: 'P2',
    notionField: 'whatsapp',
    type: 'tel',
    question: 'Qual é o seu WhatsApp?',
    placeholder: '(00) 00000-0000',
    sublabel: 'Vamos usar esse número para entrar em contato sobre sua solicitação. Se for um número de fora do Brasil, comece com + e o código do país.',
    required: true,
  },
  {
    id: 'P3',
    notionField: 'email',
    type: 'email',
    question: 'Qual é o seu e-mail?',
    placeholder: 'email@exemplo.com',
    sublabel: 'Podemos usar esse contato para compartilhar informações sobre o projeto.',
    required: true,
  },
  {
    id: 'P4',
    notionField: 'empresa',
    type: 'text',
    question: 'Qual é o nome da sua empresa ou projeto?',
    placeholder: 'Nome da empresa ou projeto',
    sublabel: 'Se ainda não tiver um nome, pode escrever “ainda não definido”.',
    required: true,
  },
  {
    id: 'P5',
    notionField: 'instagram',
    type: 'text',
    question: 'Onde podemos conhecer sua marca?',
    placeholder: '@suamarca ou link do site',
    sublabel: 'Pode ser o Instagram, o site ou outro link. Se ainda não tiver, tudo bem.',
    required: false,
  },

  // ── Bloco 2 · Quem é você e seu negócio ───────────────────────────────
  {
    id: 'P6',
    notionField: 'perfil',
    type: 'single-choice',
    question: 'Como você se descreve?',
    sublabel: 'Escolha a opção que mais se aproxima de você.',
    required: true,
    autoAdvance: true,
    options: [
      { id: 'A', label: 'Sou fundador(a) ou sócio(a) de um negócio.', value: 'Fundador(a) ou sócio(a)' },
      { id: 'B', label: 'Estou começando um negócio ou desenvolvendo uma ideia.', value: 'Começando um negócio' },
      { id: 'C', label: 'Sou profissional independente.', value: 'Profissional independente' },
      { id: 'D', label: 'Trabalho com marca, marketing ou comunicação em uma empresa.', value: 'Marca ou marketing em empresa' },
      { id: 'E', label: 'Outro. Qual?', value: 'Outro', followUp: { field: 'perfil_outro', placeholder: 'Conte em poucas palavras', required: true } },
    ],
  },
  {
    id: 'P7',
    notionField: 'segmento',
    type: 'single-choice',
    question: 'Em qual segmento o negócio atua?',
    sublabel: 'Escolha o segmento que melhor representa sua atividade principal.',
    required: true,
    autoAdvance: true,
    options: [
      { id: 'A', label: 'Moda e beleza' },
      { id: 'B', label: 'Alimentação e bebidas' },
      { id: 'C', label: 'Saúde e bem-estar' },
      { id: 'D', label: 'Educação e consultoria' },
      { id: 'E', label: 'Tecnologia e inovação' },
      { id: 'F', label: 'Arquitetura, design e decoração', value: 'Arquitetura · design e decoração' },
      { id: 'G', label: 'Arte, cultura e eventos', value: 'Arte · cultura e eventos' },
      { id: 'H', label: 'Varejo e comércio' },
      { id: 'I', label: 'Serviços corporativos e profissionais' },
      { id: 'J', label: 'Outro. Qual?', value: 'Outro', followUp: { field: 'segmento_outro', placeholder: 'Qual é o segmento?', required: true } },
    ],
  },
  {
    id: 'P8',
    notionField: 'origem',
    type: 'single-choice',
    question: 'Como você chegou até a VilaColab?',
    required: true,
    autoAdvance: true,
    options: [
      { id: 'A', label: 'Recebi uma indicação. Quem indicou?', value: 'Indicação', followUp: { field: 'indicado_por', placeholder: 'Nome de quem indicou', required: true } },
      { id: 'B', label: 'Pelo Instagram.', value: 'Instagram' },
      { id: 'C', label: 'Pelo Google ou por uma pesquisa na internet.', value: 'Google ou pesquisa' },
      { id: 'D', label: 'Já fui cliente da VilaColab.', value: 'Já fui cliente' },
      { id: 'E', label: 'Já conhecia a VilaColab.', value: 'Já conhecia a VilaColab' },
      { id: 'F', label: 'Outro. Onde?', value: 'Outro', followUp: { field: 'origem_outro', placeholder: 'Onde você conheceu a VilaColab?', required: true } },
    ],
  },

  // ── Bloco 3 · Seu momento ─────────────────────────────────────────────
  {
    id: 'P9',
    notionField: 'ponto_de_vista',
    type: 'textarea',
    question: 'O que você gostaria que as pessoas entendessem sobre o seu negócio ou sobre o jeito como você trabalha?',
    placeholder: 'Escreva com suas palavras…',
    sublabel: 'Pode ser uma ideia, um valor ou algo que você faz de um jeito próprio. Não precisa ter a resposta pronta.',
    required: true,
  },
  {
    id: 'P10',
    notionField: 'momento',
    type: 'single-choice',
    question: 'Em que momento o seu negócio ou projeto está?',
    sublabel: 'Escolha a opção que mais se aproxima do seu momento.',
    required: true,
    autoAdvance: true,
    options: [
      { id: 'A', label: 'Estou começando um negócio ou projeto e preciso construir sua marca.', value: 'Começando' },
      { id: 'B', label: 'Meu negócio já existe, mas sinto que a marca não acompanha o que ele se tornou.', value: 'Marca não acompanha o negócio' },
      { id: 'C', label: 'O negócio está crescendo e quero que a marca acompanhe essa evolução.', value: 'Crescendo' },
      { id: 'D', label: 'Minha marca já está estruturada, mas preciso repensar sua direção ou posicionamento.', value: 'Repensar direção' },
      { id: 'E', label: 'Tenho uma necessidade específica, como um lançamento, evento, espaço ou embalagem.', value: 'Necessidade específica' },
      { id: 'F', label: 'Outro momento. Qual?', value: 'Outro', followUp: { field: 'momento_outro', placeholder: 'Conte em poucas palavras', required: true } },
    ],
  },

  // ── Bloco 4 · Seus desafios ───────────────────────────────────────────
  {
    id: 'P11',
    notionField: 'desafios',
    type: 'multi-choice',
    question: 'Quais desafios você percebe na sua marca hoje?',
    sublabel: 'Selecione todas as opções que fizerem sentido.',
    required: true,
    options: [
      { id: 'A', label: 'Tenho dificuldade para explicar o que torna meu negócio diferente.', value: 'Explicar o diferencial' },
      { id: 'B', label: 'Minha marca não traduz o que meu negócio realmente é.', value: 'Marca não traduz o negócio' },
      { id: 'C', label: 'Quero atrair um público mais alinhado e ser menos comparado por preço.', value: 'Público e preço' },
      { id: 'D', label: 'A identidade visual não está à altura do que eu entrego.', value: 'Identidade visual' },
      { id: 'E', label: 'Minha marca se apresenta de maneiras diferentes em cada canal.', value: 'Consistência entre canais' },
      { id: 'F', label: 'Tenho uma marca, mas não sei como aplicá-la no dia a dia.', value: 'Aplicação no dia a dia' },
      { id: 'G', label: 'O negócio evoluiu e a marca ficou para trás.', value: 'Marca ficou para trás' },
      { id: 'H', label: 'Estou começando e preciso construir minha marca.', value: 'Construir do zero' },
      { id: 'I', label: 'Outro. Qual?', value: 'Outro', followUp: { field: 'desafios_outro', placeholder: 'Qual é o desafio?', required: true } },
    ],
  },

  // ── Bloco 5 · Como seguimos ───────────────────────────────────────────
  {
    id: 'P12',
    notionField: 'prazo',
    type: 'single-choice',
    question: 'Quando você gostaria de iniciar o projeto?',
    required: true,
    autoAdvance: true,
    options: [
      { id: 'A', label: 'O quanto antes.', value: 'O quanto antes', followUp: { field: 'data_importante', label: 'Existe alguma data importante para o projeto? Qual?', placeholder: 'Opcional. Ex.: lançamento em março', required: false } },
      { id: 'B', label: 'Nos próximos 2 meses.', value: 'Próximos 2 meses' },
      { id: 'C', label: 'Entre 3 e 6 meses.', value: 'Entre 3 e 6 meses' },
      { id: 'D', label: 'Daqui a mais de 6 meses.', value: 'Mais de 6 meses' },
      { id: 'E', label: 'Ainda não tenho uma previsão.', value: 'Sem previsão' },
    ],
  },
  {
    id: 'P13',
    notionField: 'formatos_de_interesse',
    type: 'multi-choice',
    question: 'Qual formato mais se aproxima do que você busca hoje?',
    sublabel: 'Selecione todas as opções que fizerem sentido.',
    required: true,
    options: [
      { id: 'A', label: 'Diagnóstico de marca', description: 'Para compreender o momento do negócio e identificar os próximos passos.' },
      { id: 'B', label: 'Acompanhamento mensal', description: 'Para marcas que buscam apoio estratégico e criativo contínuo.' },
      { id: 'C', label: 'Projeto pontual', description: 'Para uma necessidade específica, como naming ou direção criativa para um evento ou lançamento.' },
      { id: 'D', label: 'Projeto de marca completo', description: 'Para construir ou transformar a marca de forma estratégica e integrada.' },
      { id: 'E', label: 'Ainda não sei', description: 'Quero entender qual caminho faz mais sentido para o meu negócio.' },
    ],
  },
  {
    id: 'P14',
    notionField: 'investimento',
    type: 'single-choice',
    question: 'Qual investimento você tem planejado para esse projeto?',
    sublabel: 'Isso nos ajuda a chegar na conversa com um caminho que caiba no seu momento.',
    required: true,
    autoAdvance: true,
    options: [
      { id: 'A', label: 'Até R$ 5 mil', value: 'Até R$ 5 mil' },
      { id: 'B', label: 'Entre R$ 5 e 15 mil', value: 'R$ 5 a 15 mil' },
      { id: 'C', label: 'Entre R$ 15 e 30 mil', value: 'R$ 15 a 30 mil' },
      { id: 'D', label: 'Acima de R$ 30 mil', value: 'Acima de R$ 30 mil' },
      { id: 'E', label: 'Ainda não defini', value: 'Ainda não defini' },
    ],
  },
  {
    id: 'P15',
    notionField: 'disponibilidade',
    type: 'single-choice',
    question: 'Como você imagina sua participação no projeto?',
    sublabel: 'Nosso processo é colaborativo. Sua visão, suas decisões e seus retornos fazem parte da construção da marca.',
    required: true,
    autoAdvance: true,
    options: [
      { id: 'A', label: 'Quero participar ativamente das conversas e decisões.', value: 'Participação ativa' },
      { id: 'B', label: 'Tenho pouco tempo, mas consigo estar presente nos momentos-chave.', value: 'Momentos-chave' },
      { id: 'C', label: 'Prefiro participar só do essencial e deixar o restante com a equipe.', value: 'Só o essencial' },
    ],
  },
  {
    id: 'P16',
    notionField: 'motivacao',
    type: 'textarea',
    question: 'O que fez você decidir olhar para a sua marca agora?',
    placeholder: 'Escreva com suas palavras…',
    sublabel: 'Pode ser uma mudança no negócio, uma inquietação, um objetivo ou algo que você queira compartilhar. Uma frase já nos ajuda.',
    required: true,
  },
]

// ── Utilitários usados no servidor (Notion, CRM e e-mail) ───────────────

const byField: Record<string, Question> = Object.fromEntries(
  questions.map((q) => [q.notionField, q])
)

/** Campos obrigatórios validados na API */
export const REQUIRED_FIELDS = questions.filter((q) => q.required).map((q) => q.notionField)

/** Todas as opções com campo complementar, para validar e gravar */
export const FOLLOW_UPS = questions.flatMap((q) =>
  (q.options ?? [])
    .filter((o) => o.followUp)
    .map((o) => ({ parentField: q.notionField, value: optionValue(o), followUp: o.followUp! }))
)

/** Converte o valor gravado no Notion de volta para o texto que a pessoa leu */
export function labelFor(field: string, value: string): string {
  const option: ChoiceOption | undefined = byField[field]?.options?.find(
    (o) => optionValue(o) === value
  )
  if (!option) return value
  return option.label.replace(/\s*(Qual|Onde|Quem indicou)\?$/, '').replace(/\.$/, '')
}

export function questionTitle(field: string): string {
  return byField[field]?.question ?? field
}
