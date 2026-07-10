import Button from "../Button/Button";
import "./ErrorState.css";

function ErrorState({
  title = "Não foi possível carregar o conteúdo",
  message = "Ocorreu um problema inesperado. Tenta novamente.",
  onRetry,
  retryLabel = "Tentar novamente",
}) {
  return (
    <div
      className="error-state"
      role="alert"
      aria-live="assertive"
    >
      <div className="error-state__icon" aria-hidden="true">
        !
      </div>

      <div className="error-state__content">
        <h2 className="error-state__title">{title}</h2>

        <p className="error-state__message">{message}</p>

        {onRetry && (
          <Button
            type="button"
            variant="secondary"
            onClick={onRetry}
          >
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;