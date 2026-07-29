import {
    useEffect,
    useRef,
    useState,
} from "react";
import { Link } from "react-router-dom";

import Icon from "../common/Icon/Icon";

import {
    findAssistantResponse,
    QUICK_QUESTIONS,
} from "./assistantData";

import "./SpaceVisionAssistant.css";

const INITIAL_MESSAGE = {
    id: "welcome",
    role: "assistant",
    content:
        "Olá! Sou o Assistente SpaceVision. Posso ajudar-te a explorar o universo e as funcionalidades do site.",
    suggestions: QUICK_QUESTIONS,
};

function createAssistantMessage(response, id) {
    return {
        id,
        role: "assistant",
        content: response.response,
        link: response.link,
        linkLabel: response.linkLabel,
        externalLink: response.externalLink,
        externalLinkLabel: response.externalLinkLabel,
        suggestions: response.suggestions ?? [],
    };
}

function SpaceVisionAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        INITIAL_MESSAGE,
    ]);

    const inputRef = useRef(null);
    const closeButtonRef = useRef(null);
    const triggerButtonRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        const focusTimeout = window.setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 0);

        function handleKeyDown(event) {
            if (event.key !== "Escape") return;

            setIsOpen(false);

            window.setTimeout(() => {
                triggerButtonRef.current?.focus();
            }, 0);
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            window.clearTimeout(focusTimeout);
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });

        return undefined;
    }, [messages, isOpen]);

    function openAssistant() {
        setIsOpen(true);
    }

    function closeAssistant() {
        setIsOpen(false);

        window.setTimeout(() => {
            triggerButtonRef.current?.focus();
        }, 0);
    }

    function sendQuestion(question) {
        const trimmedQuestion = question.trim();

        if (!trimmedQuestion) return;

        const response =
            findAssistantResponse(trimmedQuestion);

        setMessages((currentMessages) => {
            const nextMessageIndex =
                currentMessages.length;

            const userMessage = {
                id: `user-${nextMessageIndex}`,
                role: "user",
                content: trimmedQuestion,
            };

            const assistantMessage =
                createAssistantMessage(
                    response,
                    `assistant-${nextMessageIndex + 1}`
                );

            return [
                ...currentMessages,
                userMessage,
                assistantMessage,
            ];
        });

        setInput("");
    }

    function handleSubmit(event) {
        event.preventDefault();
        sendQuestion(input);
    }

    function handleSuggestion(question) {
        sendQuestion(question);
        inputRef.current?.focus();
    }

    return (
        <aside
            className="spacevision-assistant"
            aria-label="Assistente SpaceVision"
        >
            {isOpen && (
                <section
                    id="spacevision-assistant-panel"
                    className="spacevision-assistant__panel"
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="spacevision-assistant-title"
                >
                    <header className="spacevision-assistant__header">
                        <div className="spacevision-assistant__identity">
                            <span
                                className="spacevision-assistant__logo"
                                aria-hidden="true"
                            >
                                <Icon
                                    name="Sparkles"
                                    size={20}
                                />
                            </span>

                            <div>
                                <h2
                                    id="spacevision-assistant-title"
                                    className="spacevision-assistant__title"
                                >
                                    Assistente SpaceVision
                                </h2>

                                <p className="spacevision-assistant__status">
                                    Assistente virtual gratuito
                                </p>
                            </div>
                        </div>

                        <button
                            ref={closeButtonRef}
                            type="button"
                            className="spacevision-assistant__close"
                            onClick={closeAssistant}
                            aria-label="Fechar o assistente"
                        >
                            <Icon
                                name="X"
                                size={20}
                                aria-hidden="true"
                            />
                        </button>
                    </header>

                    <div
                        className="spacevision-assistant__messages"
                        aria-live="polite"
                        aria-relevant="additions"
                    >
                        {messages.map((message) => (
                            <article
                                key={message.id}
                                className={`spacevision-assistant__message spacevision-assistant__message--${message.role}`}
                            >
                                <p className="spacevision-assistant__bubble">
                                    {message.content}
                                </p>

                                {message.role === "assistant" && (
                                    <>
                                        {(message.link ||
                                            message.externalLink) && (
                                                <div className="spacevision-assistant__actions">
                                                    {message.link && (
                                                        <Link
                                                            to={message.link}
                                                            className="spacevision-assistant__link"
                                                            onClick={closeAssistant}
                                                        >
                                                            {message.linkLabel}

                                                            <Icon
                                                                name="ArrowRight"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        </Link>
                                                    )}

                                                    {message.externalLink && (
                                                        <a
                                                            href={message.externalLink}
                                                            className="spacevision-assistant__link spacevision-assistant__link--secondary"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {message.externalLinkLabel}

                                                            <Icon
                                                                name="ExternalLink"
                                                                size={15}
                                                                aria-hidden="true"
                                                            />
                                                        </a>
                                                    )}
                                                </div>
                                            )}

                                        {message.suggestions?.length >
                                            0 && (
                                                <div
                                                    className="spacevision-assistant__suggestions"
                                                    aria-label="Perguntas sugeridas"
                                                >
                                                    {message.suggestions.map(
                                                        (suggestion) => (
                                                            <button
                                                                key={suggestion}
                                                                type="button"
                                                                className="spacevision-assistant__suggestion"
                                                                onClick={() =>
                                                                    handleSuggestion(
                                                                        suggestion
                                                                    )
                                                                }
                                                            >
                                                                {suggestion}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </>
                                )}
                            </article>
                        ))}

                        <div
                            ref={messagesEndRef}
                            aria-hidden="true"
                        />
                    </div>

                    <form
                        className="spacevision-assistant__form"
                        onSubmit={handleSubmit}
                    >
                        <label
                            className="sr-only"
                            htmlFor="spacevision-assistant-input"
                        >
                            Escreve a tua pergunta
                        </label>

                        <input
                            ref={inputRef}
                            id="spacevision-assistant-input"
                            className="spacevision-assistant__input"
                            type="text"
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            placeholder="Pergunta sobre o SpaceVision..."
                            maxLength={250}
                            autoComplete="off"
                        />

                        <button
                            type="submit"
                            className="spacevision-assistant__send"
                            disabled={!input.trim()}
                            aria-label="Enviar pergunta"
                        >
                            <Icon
                                name="Send"
                                size={18}
                                aria-hidden="true"
                            />
                        </button>
                    </form>
                </section>
            )}

            {!isOpen && (
                <button
                    ref={triggerButtonRef}
                    type="button"
                    className="spacevision-assistant__trigger"
                    onClick={openAssistant}
                    aria-label="Abrir Assistente SpaceVision"
                    aria-expanded={isOpen}
                    aria-controls="spacevision-assistant-panel"
                >
                    <Icon
                        name="MessageCircle"
                        size={23}
                        aria-hidden="true"
                    />

                    <span className="spacevision-assistant__trigger-label">
                        Precisas de ajuda?
                    </span>
                </button>
            )}
        </aside>
    );
}

export default SpaceVisionAssistant;