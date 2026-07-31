import backendApi from "./backendApi";

const TYPE_LABELS = {
  "Escolha múltipla": {
    pt: "Escolha múltipla",
    en: "Multiple choice",
  },
  "Verdadeiro ou Falso": {
    pt: "Verdadeiro ou Falso",
    en: "True or false",
  },
};

export function localizeQuizType(type, isEnglish) {
  const label = TYPE_LABELS[type];

  if (!label) {
    return type;
  }

  return isEnglish ? label.en : label.pt;
}

export async function getAiQuizQuestions() {
  const { data } = await backendApi.get("/quiz/questions");

  const questions = Array.isArray(data?.questions)
    ? data.questions
    : [];

  return questions.map((question) => ({
    id: `ai-${question.id}`,
    source: "ai",
    type: question.type,
    text_pt: question.text_pt,
    text_en: question.text_en,
    options_pt: question.options_pt,
    options_en: question.options_en,
    correctIndex: question.correct_index,
    fact_pt: question.fact_pt,
    fact_en: question.fact_en,
  }));
}
