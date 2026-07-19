import { useState } from "react";

import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Button from "../../components/common/Button/Button";
import Section from "../../components/common/Section/Section";
import Icon from "../../components/common/Icon/Icon";
import CTASection from "../../components/home/CTASection/CTASection";

import { quizQuestions, quizRanks, quizFacts } from "../../data/quizQuestions";

import "./Quiz.css";

const HERO_STARS = Array.from({ length: 14 });

function getRank(score) {
  return quizRanks.find((rank) => score >= rank.min);
}

function Quiz() {
  const [phase, setPhase] = useState("idle");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [pickedIndex, setPickedIndex] = useState(null);
  const [score, setScore] = useState(0);

  const totalQuestions = quizQuestions.length;
  const question = quizQuestions[questionIndex];
  const answered = pickedIndex !== null;
  const isCorrect = answered && pickedIndex === question.correctIndex;

  const answeredCount =
    phase === "done"
      ? totalQuestions
      : questionIndex + (answered ? 1 : 0);
  const progressPct = Math.round(
    (answeredCount / totalQuestions) * 100
  );

  function handleStart() {
    setPhase("question");
    setQuestionIndex(0);
    setPickedIndex(null);
    setScore(0);
  }

  function handlePick(index) {
    if (pickedIndex !== null) return;

    setPickedIndex(index);

    if (index === question.correctIndex) {
      setScore((current) => current + 1);
    }
  }

  function handleNext() {
    if (questionIndex === totalQuestions - 1) {
      setPhase("done");
      return;
    }

    setQuestionIndex((current) => current + 1);
    setPickedIndex(null);
  }

  const rank = phase === "done" ? getRank(score) : null;

  return (
    <main className="quiz-page">
      <Container>
        <Breadcrumb title="Quiz" />

        <header className="quiz-hero">
          <div className="quiz-hero__decor" aria-hidden="true">
            {HERO_STARS.map((_, index) => (
              <span key={index} className="quiz-hero__star" />
            ))}

            <span className="quiz-hero__planet">
              <span className="quiz-hero__planet-ring" />
            </span>

            <span className="quiz-hero__moon" />
          </div>

          <div className="quiz-hero__content">
            <p className="quiz-hero__eyebrow">
              Space Vision · Quiz
            </p>

            <h1>Quanto sabes sobre o espaço?</h1>

            <p className="quiz-hero__description">
              Oito perguntas, factos surpreendentes e uma patente cósmica
              à tua espera. Preparado para a descolagem?
            </p>

            {phase === "idle" && (
              <Button onClick={handleStart}>
                Iniciar missão
                <Icon name="ArrowRight" size={18} aria-hidden="true" />
              </Button>
            )}

            <p className="quiz-hero__mission">
              Missão nº 08 · Sistema Solar
            </p>
          </div>
        </header>

        <div className="quiz-card">
          <div className="quiz-card__top">
            <span className="quiz-card__badge">Quiz Espacial</span>

            <span className="quiz-card__progress-label">
              {phase === "done"
                ? "Concluído"
                : `Pergunta ${questionIndex + 1} de ${totalQuestions}`}
            </span>
          </div>

          <div
            className="quiz-card__bar"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso do quiz"
          >
            <div
              className="quiz-card__bar-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {phase === "idle" && (
            <div className="quiz-card__idle">
              <Icon
                name="Rocket"
                size={40}
                className="quiz-card__idle-icon"
                aria-hidden="true"
              />

              <p>
                Responde a 8 perguntas de escolha múltipla,
                verdadeiro/falso e desafios visuais. Recebes um facto
                curioso a cada resposta!
              </p>

              <Button onClick={handleStart}>Começar</Button>
            </div>
          )}

          {phase === "question" && (
            <div className="quiz-card__question">
              <span className="quiz-card__type">{question.type}</span>

              <h2>{question.text}</h2>

              <div
                className={`quiz-card__options ${
                  question.visual ? "quiz-card__options--visual" : ""
                }`}
              >
                {question.options.map((option, index) => {
                  const isObj = typeof option === "object";
                  const label = isObj ? option.label : option;
                  const isOptionCorrect =
                    index === question.correctIndex;
                  const isPicked = index === pickedIndex;

                  let state = "";
                  if (answered && isOptionCorrect) state = "correct";
                  else if (answered && isPicked) state = "incorrect";
                  else if (answered) state = "faded";

                  return (
                    <button
                      key={label}
                      type="button"
                      className={`quiz-option ${
                        state ? `quiz-option--${state}` : ""
                      }`}
                      onClick={() => handlePick(index)}
                      disabled={answered}
                    >
                      {isObj && (
                        <span className="quiz-option__swatch-wrap">
                          <span
                            className="quiz-option__swatch"
                            style={{ background: option.swatch }}
                          />

                          {option.ring && (
                            <span className="quiz-option__ring" />
                          )}
                        </span>
                      )}

                      <span className="quiz-option__label">
                        {label}
                      </span>

                      {answered && isOptionCorrect && (
                        <Icon
                          name="CheckCircle"
                          size={18}
                          className="quiz-option__mark"
                          aria-hidden="true"
                        />
                      )}

                      {answered && isPicked && !isOptionCorrect && (
                        <Icon
                          name="X"
                          size={18}
                          className="quiz-option__mark"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div
                  className={`quiz-feedback ${
                    isCorrect
                      ? "quiz-feedback--correct"
                      : "quiz-feedback--incorrect"
                  }`}
                >
                  <p className="quiz-feedback__title">
                    {isCorrect
                      ? "Certíssimo!"
                      : `Quase! A resposta era: ${
                          typeof question.options[question.correctIndex] ===
                          "object"
                            ? question.options[question.correctIndex].label
                            : question.options[question.correctIndex]
                        }`}
                  </p>

                  <p className="quiz-feedback__fact">{question.fact}</p>

                  <Button onClick={handleNext} className="quiz-feedback__next">
                    {questionIndex === totalQuestions - 1
                      ? "Ver resultado"
                      : "Seguinte"}
                    <Icon name="ArrowRight" size={16} aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {phase === "done" && (
            <div className="quiz-card__done">
              <p className="quiz-card__done-eyebrow">
                Missão concluída
              </p>

              <p className="quiz-card__score">
                {score}/{totalQuestions}
              </p>

              <p className="quiz-card__rank">{rank.name}</p>

              <p className="quiz-card__rank-description">
                {rank.description}
              </p>

              <Button variant="secondary" onClick={handleStart}>
                <Icon name="RefreshCw" size={16} aria-hidden="true" />
                Repetir missão
              </Button>
            </div>
          )}
        </div>

        <Section
          eyebrow="Curiosidades"
          title="Factos que parecem ficção"
          description="O universo é mais estranho do que imaginas."
        >
          <div className="quiz-facts">
            {quizFacts.map((fact) => (
              <div className="quiz-facts__card" key={fact.title}>
                <span className="quiz-facts__stat">{fact.stat}</span>
                <h3>{fact.title}</h3>
                <p>{fact.description}</p>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      <CTASection />
    </main>
  );
}

export default Quiz;
