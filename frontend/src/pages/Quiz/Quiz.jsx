import { useState } from "react";
import {
  Trans,
  useTranslation,
} from "react-i18next";
import {
  motion,
  MotionConfig,
} from "framer-motion";

import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";
import Button from "../../components/common/Button/Button";
import Section from "../../components/common/Section/Section";
import Icon from "../../components/common/Icon/Icon";
import CTASection from "../../components/home/CTASection/CTASection";
import PageMeta from "../../components/common/PageMeta/PageMeta";

import useSmoothScroll from "../../hooks/useSmoothScroll";

import {
  quizQuestions,
  quizRanks,
  quizFacts,
} from "../../data/quizQuestions";

import "./Quiz.css";

const EASE_OUT_QUART = [
  0.25,
  1,
  0.5,
  1,
];

const titleLineVariants = {
  hidden: {
    opacity: 0,
    y: 28,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      delay:
        0.15 +
        index * 0.12,
      ease: EASE_OUT_QUART,
    },
  }),
};

const heroDetailVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: EASE_OUT_QUART,
    },
  },
};

const cardPhaseVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.4,
      ease: EASE_OUT_QUART,
    },
  },

  exit: {
    opacity: 0,
    y: -8,

    transition: {
      duration: 0.3,
      ease: EASE_OUT_QUART,
    },
  },
};

const optionsContainerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const optionVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.35,
      ease: EASE_OUT_QUART,
    },
  },
};

function getRank(
  score
) {
  return quizRanks.find(
    (rank) =>
      score >= rank.min
  );
}

function getOptionLabel(
  option,
  t
) {
  const labelKey =
    typeof option === "object"
      ? option.labelKey
      : option;

  return t(
    `quiz.content.options.${labelKey}`,
    {
      defaultValue:
        typeof option ===
        "object"
          ? option.label ||
            labelKey
          : labelKey,
    }
  );
}

function Quiz() {
  const { t } =
    useTranslation();

  useSmoothScroll();

  const [phase, setPhase] =
    useState("idle");

  const [
    questionIndex,
    setQuestionIndex,
  ] = useState(0);

  const [
    pickedIndex,
    setPickedIndex,
  ] = useState(null);

  const [score, setScore] =
    useState(0);

  const titleLines = t(
    "quiz.hero.titleLines",
    {
      returnObjects: true,
    }
  );

  const totalQuestions =
    quizQuestions.length;

  const question =
    quizQuestions[
      questionIndex
    ];

  const answered =
    pickedIndex !== null;

  const isCorrect =
    answered &&
    pickedIndex ===
      question.correctIndex;

  const answeredCount =
    phase === "done"
      ? totalQuestions
      : questionIndex +
        (answered ? 1 : 0);

  const progressPct =
    Math.round(
      (answeredCount /
        totalQuestions) *
        100
    );

  const rank =
    phase === "done"
      ? getRank(score)
      : null;

  function handleStart() {
    setPhase("question");
    setQuestionIndex(0);
    setPickedIndex(null);
    setScore(0);
  }

  function handlePick(
    index
  ) {
    if (
      pickedIndex !== null
    ) {
      return;
    }

    setPickedIndex(index);

    if (
      index ===
      question.correctIndex
    ) {
      setScore(
        (current) =>
          current + 1
      );
    }
  }

  function handleNext() {
    if (
      questionIndex ===
      totalQuestions - 1
    ) {
      setPhase("done");

      return;
    }

    setQuestionIndex(
      (current) =>
        current + 1
    );

    setPickedIndex(null);
  }

  const questionType = t(
    `quiz.content.questions.${question.id}.type`,
    {
      defaultValue:
        question.type,
    }
  );

  const questionText = t(
    `quiz.content.questions.${question.id}.text`,
    {
      defaultValue:
        question.text,
    }
  );

  const questionFact = t(
    `quiz.content.questions.${question.id}.fact`,
    {
      defaultValue:
        question.fact,
    }
  );

  const correctOption =
    question.options[
      question.correctIndex
    ];

  const correctOptionLabel =
    getOptionLabel(
      correctOption,
      t
    );

  const rankName =
    rank
      ? t(
          `quiz.content.ranks.${rank.id}.name`,
          {
            defaultValue:
              rank.name,
          }
        )
      : "";

  const rankDescription =
    rank
      ? t(
          `quiz.content.ranks.${rank.id}.description`,
          {
            defaultValue:
              rank.description,
          }
        )
      : "";

  return (
    <MotionConfig reducedMotion="user">
      <PageMeta
        title={t(
          "quiz.meta.title"
        )}
        description={t(
          "quiz.meta.description"
        )}
      />

      <main className="quiz-page">
        <Container>
          <Breadcrumb
            title={t(
              "quiz.breadcrumb"
            )}
          />

          <div className="quiz-hero-section">
            {phase ===
              "idle" && (
              <header className="quiz-hero">
                <div className="quiz-hero__content">
                  <motion.p
                    className="quiz-hero__eyebrow"
                    variants={
                      heroDetailVariants
                    }
                    initial="hidden"
                    animate="visible"
                  >
                    {t(
                      "quiz.hero.eyebrow"
                    )}
                  </motion.p>

                  <h1 className="quiz-hero__title">
                    {Array.isArray(
                      titleLines
                    ) &&
                      titleLines.map(
                        (
                          line,
                          index
                        ) => (
                          <motion.span
                            key={`${line}-${index}`}
                            className="quiz-hero__title-line"
                            custom={
                              index
                            }
                            variants={
                              titleLineVariants
                            }
                            initial="hidden"
                            animate="visible"
                          >
                            {
                              line
                            }
                          </motion.span>
                        )
                      )}
                  </h1>

                  <motion.p
                    className="quiz-hero__description"
                    variants={
                      heroDetailVariants
                    }
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: 0.45,
                    }}
                  >
                    {t(
                      "quiz.hero.description",
                      {
                        count:
                          totalQuestions,
                      }
                    )}
                  </motion.p>

                  <motion.div
                    variants={
                      heroDetailVariants
                    }
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: 0.55,
                    }}
                  >
                    <Button
                      onClick={
                        handleStart
                      }
                    >
                      {t(
                        "quiz.hero.start"
                      )}

                      <Icon
                        name="ArrowRight"
                        size={18}
                        aria-hidden="true"
                      />
                    </Button>
                  </motion.div>

                  <motion.p
                    className="quiz-hero__mission"
                    variants={
                      heroDetailVariants
                    }
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: 0.6,
                    }}
                  >
                    {t(
                      "quiz.hero.mission"
                    )}
                  </motion.p>
                </div>
              </header>
            )}

            {phase !==
              "idle" && (
              <div className="quiz-card">
                <div className="quiz-card__top">
                  <span className="quiz-card__badge">
                    {t(
                      "quiz.card.badge"
                    )}
                  </span>

                  <span className="quiz-card__progress-label">
                    {phase ===
                    "done"
                      ? t(
                          "quiz.card.completed"
                        )
                      : t(
                          "quiz.card.questionProgress",
                          {
                            current:
                              questionIndex +
                              1,
                            total:
                              totalQuestions,
                          }
                        )}
                  </span>
                </div>

                <div
                  className="quiz-card__bar"
                  role="progressbar"
                  aria-valuenow={
                    progressPct
                  }
                  aria-valuemin={
                    0
                  }
                  aria-valuemax={
                    100
                  }
                  aria-label={t(
                    "quiz.card.progressAria"
                  )}
                >
                  <motion.div
                    className="quiz-card__bar-fill"
                    animate={{
                      width: `${progressPct}%`,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: EASE_OUT_QUART,
                    }}
                  />
                </div>

                {phase ===
                  "question" && (
                  <motion.div
                    key={`question-${questionIndex}`}
                    className="quiz-card__question"
                    variants={
                      cardPhaseVariants
                    }
                    initial="hidden"
                    animate="visible"
                  >
                    <span className="quiz-card__type">
                      {
                        questionType
                      }
                    </span>

                    <h2>
                      {
                        questionText
                      }
                    </h2>

                    <motion.div
                      className={`quiz-card__options ${
                        question.visual
                          ? "quiz-card__options--visual"
                          : ""
                      }`}
                      variants={
                        optionsContainerVariants
                      }
                      initial="hidden"
                      animate="visible"
                    >
                      {question.options.map(
                        (
                          option,
                          index
                        ) => {
                          const isObj =
                            typeof option ===
                            "object";

                          const label =
                            getOptionLabel(
                              option,
                              t
                            );

                          const isOptionCorrect =
                            index ===
                            question.correctIndex;

                          const isPicked =
                            index ===
                            pickedIndex;

                          let state =
                            "";

                          if (
                            answered &&
                            isOptionCorrect
                          ) {
                            state =
                              "correct";
                          } else if (
                            answered &&
                            isPicked
                          ) {
                            state =
                              "incorrect";
                          } else if (
                            answered
                          ) {
                            state =
                              "faded";
                          }

                          return (
                            <motion.button
                              key={`${question.id}-${index}`}
                              type="button"
                              className={`quiz-option ${
                                state
                                  ? `quiz-option--${state}`
                                  : ""
                              }`}
                              variants={
                                optionVariants
                              }
                              onClick={() =>
                                handlePick(
                                  index
                                )
                              }
                              disabled={
                                answered
                              }
                              whileHover={
                                answered
                                  ? undefined
                                  : {
                                      scale:
                                        1.015,
                                    }
                              }
                              whileTap={
                                answered
                                  ? undefined
                                  : {
                                      scale:
                                        0.985,
                                    }
                              }
                            >
                              {isObj && (
                                <span className="quiz-option__swatch-wrap">
                                  <span
                                    className="quiz-option__swatch"
                                    style={{
                                      background:
                                        option.swatch,
                                    }}
                                    aria-hidden="true"
                                  />

                                  {option.ring && (
                                    <span
                                      className="quiz-option__ring"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              )}

                              <span className="quiz-option__label">
                                {
                                  label
                                }
                              </span>

                              {answered &&
                                isOptionCorrect && (
                                  <Icon
                                    name="CheckCircle"
                                    size={18}
                                    className="quiz-option__mark"
                                    aria-hidden="true"
                                  />
                                )}

                              {answered &&
                                isPicked &&
                                !isOptionCorrect && (
                                  <Icon
                                    name="X"
                                    size={18}
                                    className="quiz-option__mark"
                                    aria-hidden="true"
                                  />
                                )}
                            </motion.button>
                          );
                        }
                      )}
                    </motion.div>

                    {answered && (
                      <motion.div
                        className={`quiz-feedback ${
                          isCorrect
                            ? "quiz-feedback--correct"
                            : "quiz-feedback--incorrect"
                        }`}
                        initial={{
                          opacity: 0,
                          y: 10,
                          scale:
                            0.98,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          duration:
                            0.35,
                          ease: EASE_OUT_QUART,
                        }}
                        role="status"
                        aria-live="polite"
                      >
                        <p className="quiz-feedback__title">
                          {isCorrect
                            ? t(
                                "quiz.feedback.correct"
                              )
                            : t(
                                "quiz.feedback.incorrect",
                                {
                                  answer:
                                    correctOptionLabel,
                                }
                              )}
                        </p>

                        <p className="quiz-feedback__fact">
                          {
                            questionFact
                          }
                        </p>

                        <Button
                          onClick={
                            handleNext
                          }
                          className="quiz-feedback__next"
                        >
                          {questionIndex ===
                          totalQuestions -
                            1
                            ? t(
                                "quiz.feedback.result"
                              )
                            : t(
                                "quiz.feedback.next"
                              )}

                          <Icon
                            name="ArrowRight"
                            size={16}
                            aria-hidden="true"
                          />
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {phase ===
                  "done" && (
                  <motion.div
                    key="done"
                    className="quiz-card__done"
                    variants={
                      cardPhaseVariants
                    }
                    initial="hidden"
                    animate="visible"
                  >
                    <p className="quiz-card__done-eyebrow">
                      {t(
                        "quiz.result.eyebrow"
                      )}
                    </p>

                    <motion.p
                      className="quiz-card__score"
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15,
                        ease: EASE_OUT_QUART,
                      }}
                      aria-label={t(
                        "quiz.result.scoreAria",
                        {
                          score,
                          total:
                            totalQuestions,
                        }
                      )}
                    >
                      {score}/
                      {
                        totalQuestions
                      }
                    </motion.p>

                    <p className="quiz-card__rank">
                      {
                        rankName
                      }
                    </p>

                    <p className="quiz-card__rank-description">
                      {
                        rankDescription
                      }
                    </p>

                    <Button
                      variant="secondary"
                      onClick={
                        handleStart
                      }
                    >
                      <Icon
                        name="RefreshCw"
                        size={16}
                        aria-hidden="true"
                      />

                      {t(
                        "quiz.result.restart"
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          <Section
            eyebrow={t(
              "quiz.facts.eyebrow"
            )}
            title={t(
              "quiz.facts.title"
            )}
            description={t(
              "quiz.facts.description"
            )}
          >
            <div className="quiz-facts">
              {quizFacts.map(
                (fact) => (
                  <div
                    className="quiz-facts__card"
                    key={fact.id}
                  >
                    <span className="quiz-facts__stat">
                      {t(
                        `quiz.content.facts.${fact.id}.stat`,
                        {
                          defaultValue:
                            fact.stat,
                        }
                      )}
                    </span>

                    <h3>
                      {t(
                        `quiz.content.facts.${fact.id}.title`,
                        {
                          defaultValue:
                            fact.title,
                        }
                      )}
                    </h3>

                    <p>
                      <Trans
                        i18nKey={`quiz.content.facts.${fact.id}.description`}
                        defaults={
                          fact.description
                        }
                      />
                    </p>
                  </div>
                )
              )}
            </div>
          </Section>
        </Container>

        <CTASection />
      </main>
    </MotionConfig>
  );
}

export default Quiz;