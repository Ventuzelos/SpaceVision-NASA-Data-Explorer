export const quizQuestions = [
  {
    id: "closestPlanet",
    type: "Escolha múltipla",
    text: "Qual é o planeta mais próximo do Sol?",
    options: [
      "venus",
      "mercury",
      "mars",
      "earth",
    ],
    correctIndex: 1,
    fact:
      "Mercúrio passa de 430 °C de dia a −180 °C à noite — a maior variação térmica do Sistema Solar.",
  },
  {
    id: "sunIsStar",
    type: "Verdadeiro ou Falso",
    text: "O Sol é uma estrela.",
    options: [
      "true",
      "false",
    ],
    correctIndex: 0,
    fact:
      "O Sol é uma estrela anã amarela de meia-idade: tem cerca de 4,6 mil milhões de anos.",
  },
  {
    id: "redPlanet",
    type: "Desafio visual",
    text:
      'Qual destes planetas é conhecido como o "Planeta Vermelho"?',
    visual: true,
    options: [
      {
        labelKey: "neptune",
        label: "Neptuno",
        swatch:
          "var(--color-accent)",
      },
      {
        labelKey: "mars",
        label: "Marte",
        swatch:
          "var(--color-error)",
      },
      {
        labelKey: "uranus",
        label: "Urano",
        swatch:
          "var(--color-success)",
      },
    ],
    correctIndex: 1,
    fact:
      "A cor de Marte vem do óxido de ferro — na prática, o planeta está coberto de ferrugem.",
  },
  {
    id: "earthMoons",
    type: "Escolha múltipla",
    text: "Quantas luas tem a Terra?",
    options: [
      "none",
      "one",
      "two",
      "three",
    ],
    correctIndex: 1,
    fact:
      "A Lua afasta-se da Terra cerca de 3,8 cm por ano — mais ou menos ao ritmo a que crescem as unhas.",
  },
  {
    id: "soundInSpace",
    type: "Verdadeiro ou Falso",
    text:
      "No espaço é possível ouvir explosões.",
    options: [
      "true",
      "false",
    ],
    correctIndex: 1,
    fact:
      "O som precisa de um meio para se propagar. No vácuo do espaço, o silêncio é absoluto.",
  },
  {
    id: "largestPlanet",
    type: "Escolha múltipla",
    text:
      "Qual é o maior planeta do Sistema Solar?",
    options: [
      "saturn",
      "neptune",
      "jupiter",
      "earth",
    ],
    correctIndex: 2,
    fact:
      "Júpiter é tão grande que caberiam lá dentro todos os outros planetas do Sistema Solar juntos.",
  },
  {
    id: "famousRings",
    type: "Desafio visual",
    text:
      "Qual destes planetas tem os anéis mais famosos?",
    visual: true,
    options: [
      {
        labelKey: "saturn",
        label: "Saturno",
        swatch:
          "var(--color-warning)",
        ring: true,
      },
      {
        labelKey: "mercury",
        label: "Mercúrio",
        swatch:
          "var(--color-text-secondary)",
      },
      {
        labelKey: "venus",
        label: "Vénus",
        swatch:
          "var(--color-link)",
      },
    ],
    correctIndex: 0,
    fact:
      "Os anéis de Saturno têm 280 000 km de largura, mas em média só 10 metros de espessura.",
  },
  {
    id: "sunlightTravelTime",
    type: "Escolha múltipla",
    text:
      "Quanto tempo demora a luz do Sol a chegar à Terra?",
    options: [
      "eightSeconds",
      "eightMinutes",
      "eightHours",
      "eightDays",
    ],
    correctIndex: 1,
    fact:
      "Quando olhas para o Sol, estás a ver o passado: a luz que chega partiu há cerca de 8 minutos e 20 segundos.",
  },
];

export const quizRanks = [
  {
    id: "cosmicLegend",
    min: 8,
    name: "Lenda Cósmica",
    description:
      "Pontuação perfeita! O universo não tem segredos para ti.",
  },
  {
    id: "starCommander",
    min: 6,
    name: "Comandante Estelar",
    description:
      "Excelente! Dominas o Sistema Solar como quem domina o bairro.",
  },
  {
    id: "orbitPilot",
    min: 3,
    name: "Piloto de Órbita",
    description:
      "Bom voo! Já saíste da atmosfera — mais uma missão e chegas às estrelas.",
  },
  {
    id: "spaceCadet",
    min: 0,
    name: "Cadete Espacial",
    description:
      "Toda a lenda começa no primeiro treino. Repete a missão e surpreende-te!",
  },
];

export const quizFacts = [
  {
    id: "earthsInsideSun",
    stat: "1M+",
    title: "Terras dentro do Sol",
    description:
      "Cabem mais de um milhão de planetas Terra dentro do Sol — e ainda sobra espaço.",
  },
  {
    id: "venusDay",
    stat: "1 dia > 1 ano",
    title:
      "Em Vénus, o tempo é louco",
    description:
      "Vénus demora mais tempo a girar sobre si próprio do que a dar a volta ao Sol.",
  },
  {
    id: "spaceSilence",
    stat: "Silêncio",
    title:
      "O espaço não tem som",
    description:
      "Sem ar para transportar as ondas sonoras, até a maior explosão estelar é totalmente muda.",
  },
];