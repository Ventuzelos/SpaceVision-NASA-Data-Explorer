export const QUICK_QUESTIONS = [
  "O que posso explorar?",
  "O que é o APOD?",
  "Como funcionam os favoritos?",
  "Como obtenho uma chave NASA?",
];

export const ASSISTANT_INTENTS = [
  {
    id: "explore",
    keywords: [
      "explorar",
      "o que posso explorar",
      "funcionalidades",
      "o que posso fazer",
      "ajuda",
      "paginas",
      "conteudos",
    ],
    response:
      "No SpaceVision podes explorar a imagem astronómica do dia, eventos meteorológicos espaciais, imagens da Terra, dados do sistema solar, asteroides próximos, favoritos e um quiz sobre o espaço.",
    suggestions: [
      "O que é o APOD?",
      "O que é o DONKI?",
      "Como explorar asteroides?",
    ],
  },
  {
    id: "apod",
    keywords: [
      "apod",
      "imagem do dia",
      "imagem astronomica",
      "fotografia do dia",
      "astronomy picture",
    ],
    response:
      "APOD significa Astronomy Picture of the Day. Todos os dias, a NASA publica uma imagem ou vídeo do universo acompanhado por uma explicação científica.",
    link: "/",
    linkLabel: "Explorar APOD",
    suggestions: [
      "Como adiciono aos favoritos?",
      "O que é o DONKI?",
    ],
  },
  {
    id: "donki",
    keywords: [
      "donki",
      "evento solar",
      "eventos solares",
      "tempestade solar",
      "meteorologia espacial",
      "erupcao solar",
      "cme",
    ],
    response:
      "O DONKI reúne informações sobre meteorologia espacial, incluindo erupções solares, tempestades geomagnéticas, ejeções de massa coronal e outros eventos registados pela NASA.",
    link: "/donki",
    linkLabel: "Explorar DONKI",
    suggestions: [
      "O que é o DISCOVR?",
      "Como explorar asteroides?",
    ],
  },
  {
    id: "epic",
    keywords: [
      "epic",
      "terra",
      "imagens da terra",
      "planeta terra",
      "earth",
    ],
    response:
      "A secção EPIC permite observar imagens da Terra captadas pela câmara EPIC, instalada no satélite DSCOVR, a cerca de 1,5 milhões de quilómetros do nosso planeta.",
    link: "/epic",
    linkLabel: "Ver imagens da Terra",
    suggestions: [
      "O que é o DISCOVR?",
      "Como adiciono aos favoritos?",
    ],
  },
  {
    id: "discovr",
    keywords: [
      "discovr",
      "sistema solar",
      "satélite discovr",
      "satelite discovr",
      "explorar o universo",
    ],
    response:
      "Na área Descobrir podes conhecer a missão DSCOVR, explorar conteúdos interativos e compreender melhor a observação da Terra e do ambiente espacial.",
    link: "/discover",
    linkLabel: "Abrir Descobrir",
    suggestions: [
      "O que é o EPIC?",
      "O que é o DONKI?",
    ],
  },
  {
    id: "neowatch",
    keywords: [
      "neowatch",
      "asteroide",
      "asteroides",
      "objeto proximo",
      "objetos proximos",
      "neo",
      "bennu",
      "perigoso",
      "perigosos",
    ],
    response:
      "O NeoWatch apresenta asteroides e outros objetos próximos da Terra. Podes consultar dimensões, velocidade, distância de passagem e o possível nível de perigo.",
    link: "/neowatch",
    linkLabel: "Explorar asteroides",
    suggestions: [
      "O asteroide é perigoso?",
      "O que é o DONKI?",
    ],
  },
  {
    id: "asteroid-danger",
    keywords: [
      "asteroide e perigoso",
      "asteroides perigosos",
      "risco de colisao",
      "vai atingir a terra",
      "atingir a terra",
    ],
    response:
      "A classificação de potencialmente perigoso não significa que um asteroide vá atingir a Terra. Indica que possui determinadas dimensões e que a sua órbita pode aproximá-lo do nosso planeta.",
    link: "/neowatch",
    linkLabel: "Consultar NeoWatch",
    suggestions: [
      "Como explorar asteroides?",
      "O que posso explorar?",
    ],
  },
  {
    id: "favorites",
    keywords: [
      "favorito",
      "favoritos",
      "guardar",
      "guardar imagem",
      "adicionar favorito",
      "remover favorito",
      "estrela",
    ],
    response:
      "Para guardar um conteúdo, inicia sessão e seleciona o botão de favorito apresentado no respetivo cartão. Os conteúdos guardados ficam disponíveis na página Favoritos.",
    link: "/favorites",
    linkLabel: "Ver favoritos",
    requiresAuthentication: true,
    suggestions: [
      "Como criar uma conta?",
      "Como obtenho uma chave NASA?",
    ],
  },
  {
    id: "account",
    keywords: [
      "conta",
      "criar conta",
      "registar",
      "registo",
      "login",
      "iniciar sessao",
      "entrar",
    ],
    response:
      "Podes criar uma conta gratuitamente através da página de registo. Depois de iniciares sessão, poderás guardar favoritos e configurar a tua chave pessoal da NASA.",
    link: "/register",
    linkLabel: "Criar conta",
    suggestions: [
      "Como funcionam os favoritos?",
      "Como obtenho uma chave NASA?",
    ],
  },
  {
    id: "nasa-key",
    keywords: [
      "chave nasa",
      "api key",
      "nasa api key",
      "limite de pedidos",
      "chave pessoal",
      "pedidos nasa",
    ],
    response:
      "Podes obter gratuitamente uma chave em api.nasa.gov e guardá-la no teu perfil do SpaceVision. A chave pessoal permite realizar mais pedidos às APIs da NASA.",
    link: "/profile",
    linkLabel: "Abrir perfil",
    externalLink: "https://api.nasa.gov/",
    externalLinkLabel: "Obter chave NASA",
    requiresAuthentication: true,
    suggestions: [
      "Como criar uma conta?",
      "O que posso explorar?",
    ],
  },
  {
    id: "quiz",
    keywords: [
      "quiz",
      "jogo",
      "perguntas",
      "conhecimento",
      "testar conhecimentos",
    ],
    response:
      "O Quiz SpaceVision permite testar os teus conhecimentos sobre astronomia, exploração espacial e as missões apresentadas no site.",
    link: "/quiz",
    linkLabel: "Começar o quiz",
    suggestions: [
      "O que posso explorar?",
      "O que é o APOD?",
    ],
  },
  {
    id: "faq",
    keywords: [
      "faq",
      "perguntas frequentes",
      "duvida",
      "duvidas",
      "problema",
      "informacao",
    ],
    response:
      "Na página de Perguntas Frequentes encontras respostas sobre as APIs da NASA, os dados apresentados, a conta e as principais funcionalidades do SpaceVision.",
    link: "/faq",
    linkLabel: "Ver perguntas frequentes",
    suggestions: [
      "Como criar uma conta?",
      "Como funcionam os favoritos?",
    ],
  },
  {
    id: "language",
    keywords: [
      "idioma",
      "lingua",
      "portugues",
      "ingles",
      "mudar idioma",
      "alterar idioma",
      "english",
    ],
    response:
      "Podes alterar o idioma do SpaceVision através do seletor de idioma disponível na navegação do site.",
    suggestions: [
      "O que posso explorar?",
      "Como criar uma conta?",
    ],
  },
  {
    id: "about",
    keywords: [
      "spacevision",
      "sobre",
      "sobre o projeto",
      "quem criou",
      "equipa",
      "contacto",
    ],
    response:
      "O SpaceVision é um explorador de dados da NASA desenvolvido para tornar a astronomia e a exploração espacial mais acessíveis, visuais e interativas.",
    link: "/about",
    linkLabel: "Conhecer o projeto",
    suggestions: [
      "O que posso explorar?",
      "Que dados da NASA existem?",
    ],
  },
];

export const FALLBACK_RESPONSE = {
  id: "fallback",
  response:
    "Ainda não consegui compreender essa pergunta. Posso ajudar-te a explorar as funcionalidades do SpaceVision ou encaminhar-te para as Perguntas Frequentes.",
  link: "/faq",
  linkLabel: "Consultar perguntas frequentes",
  suggestions: [
    "O que posso explorar?",
    "O que é o APOD?",
    "Como funcionam os favoritos?",
  ],
};

export function normalizeAssistantText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findAssistantResponse(question) {
  const normalizedQuestion =
    normalizeAssistantText(question);

  const matchedIntent = ASSISTANT_INTENTS.find(
    ({ keywords }) =>
      keywords.some((keyword) =>
        normalizedQuestion.includes(
          normalizeAssistantText(keyword)
        )
      )
  );

  return matchedIntent ?? FALLBACK_RESPONSE;
}