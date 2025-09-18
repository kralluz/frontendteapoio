// Dados mock dos perfis dos filhos
export const childrenProfiles = [
  {
    id: 1,
    name: 'Pedro Silva',
    age: 8,
    birthDate: '2016-03-15',
    avatar: 'https://randomuser.me/api/portraits/boys/45.jpg',
    diagnosis: 'Transtorno do Espectro Autista - Nível 2',
    diagnosisDate: '2020-06-10',
    supportLevel: 'Nível 2 (Suporte substancial)',
    interests: ['Trens', 'Números', 'Música clássica', 'Quebra-cabeças'],
    challenges: ['Comunicação verbal', 'Interações sociais', 'Mudanças de rotina'],
    strengths: ['Memória excepcional', 'Habilidades matemáticas', 'Atenção aos detalhes'],
    therapies: ['Terapia ABA', 'Fonoaudiologia', 'Terapia Ocupacional'],
    medications: ['Risperidona 0.5mg - 1x ao dia'],
    communication: 'Usa algumas palavras, PECs básico, gestos',
    sensoryPreferences: {
      sound: 'Sensível a ruídos altos',
      touch: 'Prefere texturas macias',
      light: 'Prefere iluminação indireta',
      movement: 'Gosta de movimentos repetitivos'
    },
    routines: ['Rotina visual diária', 'Reforços positivos', 'Tempo limite estruturado'],
    stats: {
      activitiesCompleted: 45,
      favoriteActivities: 12,
      articlesRead: 23,
      daysActive: 67
    },
    recentActivities: [
      { title: 'Sequências Visuais do Dia a Dia', date: '2 dias atrás', type: 'activity' },
      { title: 'Jogo das Emoções Expressivas', date: '5 dias atrás', type: 'activity' },
      { title: 'Comunicação com PECS', date: '1 semana atrás', type: 'article' }
    ]
  },
  {
    id: 2,
    name: 'Ana Silva',
    age: 6,
    birthDate: '2018-08-22',
    avatar: 'https://randomuser.me/api/portraits/girls/32.jpg',
    diagnosis: 'Transtorno do Espectro Autista - Nível 1',
    diagnosisDate: '2021-02-14',
    supportLevel: 'Nível 1 (Suporte mínimo)',
    interests: ['Desenhos animados', 'Danças', 'Animais', 'Cores'],
    challenges: ['Ansiedade em ambientes novos', 'Rotina estruturada'],
    strengths: ['Criatividade artística', 'Memória visual', 'Empatia'],
    therapies: ['Terapia Ocupacional', 'Musicoterapia'],
    medications: [],
    communication: 'Comunicação verbal funcional, algumas dificuldades com pronúncia',
    sensoryPreferences: {
      sound: 'Gosta de músicas suaves',
      touch: 'Prefere texturas variadas',
      light: 'Adapta-se bem a diferentes iluminação',
      movement: 'Gosta de dançar e se movimentar'
    },
    routines: ['Rotina visual', 'Atividades artísticas diárias'],
    stats: {
      activitiesCompleted: 38,
      favoriteActivities: 15,
      articlesRead: 18,
      daysActive: 52
    },
    recentActivities: [
      { title: 'Atividade de Classificação por Cores', date: '1 dia atrás', type: 'activity' },
      { title: 'Caixa de Texturas Sensoriais', date: '3 dias atrás', type: 'activity' },
      { title: 'Rotina Visual: Como Montar', date: '6 dias atrás', type: 'article' }
    ]
  }
];