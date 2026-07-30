const QUICK_QUESTION_KEYS = [
  "explore",
  "apod",
  "favorites",
  "nasaKey",
];

const ASSISTANT_INTENTS = [
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
      "explore",
      "what can i explore",
      "features",
      "what can i do",
      "help",
      "pages",
      "content",
    ],
    link: null,
    suggestionKeys: [
      "apod",
      "donki",
      "asteroids",
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
      "astronomy picture of the day",
      "picture of the day",
      "daily astronomy image",
    ],
    link: "/",
    suggestionKeys: [
      "addFavorites",
      "donki",
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
      "solar event",
      "solar events",
      "solar storm",
      "space weather",
      "solar flare",
    ],
    link: "/donki",
    suggestionKeys: [
      "discovr",
      "asteroids",
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
      "earth images",
      "planet earth",
    ],
    link: "/epic",
    suggestionKeys: [
      "discovr",
      "addFavorites",
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
      "solar system",
      "discovr satellite",
      "explore the universe",
    ],
    link: "/discover",
    suggestionKeys: [
      "epic",
      "donki",
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
      "asteroid",
      "asteroids",
      "near earth object",
      "near earth objects",
      "dangerous",
      "hazardous",
    ],
    link: "/neowatch",
    suggestionKeys: [
      "asteroidDanger",
      "donki",
    ],
  },
  {
    id: "asteroidDanger",
    keywords: [
      "asteroide e perigoso",
      "asteroides perigosos",
      "risco de colisao",
      "vai atingir a terra",
      "atingir a terra",
      "is the asteroid dangerous",
      "dangerous asteroid",
      "hazardous asteroid",
      "collision risk",
      "hit the earth",
      "will it hit earth",
    ],
    link: "/neowatch",
    suggestionKeys: [
      "asteroids",
      "explore",
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
      "favourite",
      "favourites",
      "favorite",
      "favorites",
      "save",
      "save image",
      "add favourite",
      "remove favourite",
      "star",
    ],
    link: "/favorites",
    requiresAuthentication: true,
    suggestionKeys: [
      "createAccount",
      "nasaKey",
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
      "account",
      "create account",
      "register",
      "registration",
      "sign in",
      "log in",
    ],
    link: "/register",
    suggestionKeys: [
      "favorites",
      "nasaKey",
    ],
  },
  {
    id: "nasaKey",
    keywords: [
      "chave nasa",
      "api key",
      "nasa api key",
      "limite de pedidos",
      "chave pessoal",
      "pedidos nasa",
      "nasa key",
      "request limit",
      "personal key",
      "nasa requests",
    ],
    link: "/profile",
    externalLink: "https://api.nasa.gov/",
    requiresAuthentication: true,
    suggestionKeys: [
      "createAccount",
      "explore",
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
      "game",
      "questions",
      "knowledge",
      "test my knowledge",
    ],
    link: "/quiz",
    suggestionKeys: [
      "explore",
      "apod",
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
      "frequently asked questions",
      "question",
      "questions",
      "problem",
      "information",
    ],
    link: "/faq",
    suggestionKeys: [
      "createAccount",
      "favorites",
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
      "language",
      "portuguese",
      "english",
      "change language",
      "switch language",
    ],
    link: null,
    suggestionKeys: [
      "explore",
      "createAccount",
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
      "about",
      "about the project",
      "who created",
      "team",
      "contact",
    ],
    link: "/about",
    suggestionKeys: [
      "explore",
      "nasaData",
    ],
  },
];

export function normalizeAssistantText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSuggestion(t, key) {
  return t(`assistant.questions.${key}`);
}

function createTranslatedResponse(intent, t) {
  return {
    id: intent.id,
    response: t(
      `assistant.intents.${intent.id}.response`
    ),
    link: intent.link,
    linkLabel: intent.link
      ? t(
          `assistant.intents.${intent.id}.linkLabel`
        )
      : undefined,
    externalLink: intent.externalLink,
    externalLinkLabel: intent.externalLink
      ? t(
          `assistant.intents.${intent.id}.externalLinkLabel`
        )
      : undefined,
    requiresAuthentication:
      intent.requiresAuthentication ?? false,
    suggestions:
      intent.suggestionKeys?.map((key) =>
        getSuggestion(t, key)
      ) ?? [],
  };
}

export function getQuickQuestions(t) {
  return QUICK_QUESTION_KEYS.map((key) =>
    getSuggestion(t, key)
  );
}

export function findAssistantResponse(
  question,
  t
) {
  const normalizedQuestion =
    normalizeAssistantText(question);

  const matchedIntent =
    ASSISTANT_INTENTS.find(
      ({ keywords }) =>
        keywords.some((keyword) =>
          normalizedQuestion.includes(
            normalizeAssistantText(keyword)
          )
        )
    );

  if (matchedIntent) {
    return createTranslatedResponse(
      matchedIntent,
      t
    );
  }

  return {
    id: "fallback",
    response: t(
      "assistant.fallback.response"
    ),
    link: "/faq",
    linkLabel: t(
      "assistant.fallback.linkLabel"
    ),
    suggestions: [
      getSuggestion(t, "explore"),
      getSuggestion(t, "apod"),
      getSuggestion(t, "favorites"),
    ],
  };
}