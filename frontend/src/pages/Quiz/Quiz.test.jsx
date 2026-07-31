import {
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import Quiz from "./Quiz";
import i18n from "../../i18n";
import { getAiQuizQuestions } from "../../services/quizService";

vi.mock("../../services/quizService", () => ({
  getAiQuizQuestions: vi.fn(),
  localizeQuizType: (type) => type,
}));

vi.mock("../../hooks/useSmoothScroll", () => ({
  default: () => {},
}));

function makeAiQuestion(overrides = {}) {
  return {
    id: "ai-1",
    source: "ai",
    type: "Escolha múltipla",
    text_pt: "Qual sonda cruzou primeiro a heliopausa?",
    text_en: "Which probe first crossed the heliopause?",
    options_pt: ["Voyager 1", "Voyager 2", "Pioneer 10"],
    options_en: ["Voyager 1", "Voyager 2", "Pioneer 10"],
    correctIndex: 0,
    fact_pt: "A Voyager 1 saiu da heliosfera em 2012.",
    fact_en: "Voyager 1 left the heliosphere in 2012.",
    ...overrides,
  };
}

function renderQuiz() {
  return render(
    <MemoryRouter>
      <Quiz />
    </MemoryRouter>
  );
}

async function startQuiz() {
  const user = userEvent.setup();

  await user.click(
    screen.getByRole("button", {
      name: /iniciar missão|start mission/i,
    })
  );

  return user;
}

describe("Quiz", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("pt");
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("usa as perguntas estáticas quando a API de IA falha", async () => {
    getAiQuizQuestions.mockRejectedValue(
      new Error("network error")
    );

    renderQuiz();

    await startQuiz();

    expect(
      await screen.findByText(
        "Qual é o planeta mais próximo do Sol?"
      )
    ).toBeInTheDocument();
  });

  it("usa as perguntas de IA quando a API responde com sucesso", async () => {
    getAiQuizQuestions.mockResolvedValue([
      makeAiQuestion(),
    ]);

    renderQuiz();

    await waitFor(() =>
      expect(
        getAiQuizQuestions
      ).toHaveBeenCalled()
    );

    await startQuiz();

    expect(
      await screen.findByText(
        "Qual sonda cruzou primeiro a heliopausa?"
      )
    ).toBeInTheDocument();
  });

  it("mostra o texto em inglês quando o idioma muda a meio da partida", async () => {
    getAiQuizQuestions.mockResolvedValue([
      makeAiQuestion(),
    ]);

    renderQuiz();

    await waitFor(() =>
      expect(
        getAiQuizQuestions
      ).toHaveBeenCalled()
    );

    await startQuiz();

    await screen.findByText(
      "Qual sonda cruzou primeiro a heliopausa?"
    );

    await act(async () => {
      await i18n.changeLanguage("en");
    });

    expect(
      await screen.findByText(
        "Which probe first crossed the heliopause?"
      )
    ).toBeInTheDocument();
  });

  it("não substitui a pergunta atual se a IA responder depois de a partida já ter começado", async () => {
    let resolveAiQuestions;

    getAiQuizQuestions.mockReturnValue(
      new Promise((resolve) => {
        resolveAiQuestions = resolve;
      })
    );

    renderQuiz();

    await startQuiz();

    expect(
      screen.getByText(
        "Qual é o planeta mais próximo do Sol?"
      )
    ).toBeInTheDocument();

    resolveAiQuestions([makeAiQuestion()]);

    await new Promise((resolve) =>
      setTimeout(resolve, 0)
    );

    expect(
      screen.getByText(
        "Qual é o planeta mais próximo do Sol?"
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "Qual sonda cruzou primeiro a heliopausa?"
      )
    ).not.toBeInTheDocument();
  });

  it("ignora uma pool de IA vazia e mantém as perguntas estáticas", async () => {
    getAiQuizQuestions.mockResolvedValue([]);

    renderQuiz();

    await startQuiz();

    expect(
      screen.getByText(
        "Qual é o planeta mais próximo do Sol?"
      )
    ).toBeInTheDocument();
  });
});
