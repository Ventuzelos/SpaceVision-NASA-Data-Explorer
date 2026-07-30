import i18n from "../i18n";

const API_ERROR_TRANSLATION_KEYS = {
  NASA_RATE_LIMIT_EXCEEDED:
    "apiErrors.codes.nasaRateLimitExceeded",
  NASA_UPSTREAM_ERROR:
    "apiErrors.codes.nasaUpstreamError",
  NASA_CONNECTION_ERROR:
    "apiErrors.codes.nasaConnectionError",
  NASA_PROCESSING_ERROR:
    "apiErrors.codes.nasaProcessingError",
};

export default function getApiErrorMessage(
  error,
  fallbackMessage
) {
  const response = error?.response;
  const status = response?.status;
  const errorCode = response?.data?.code;

  if (!response) {
    return i18n.t(
      "apiErrors.connection"
    );
  }

  const translationKey =
    API_ERROR_TRANSLATION_KEYS[
      errorCode
    ];

  if (translationKey) {
    return i18n.t(
      translationKey
    );
  }

  if (status >= 500) {
    switch (status) {
      case 502:
      case 503:
      case 504:
        return i18n.t(
          "apiErrors.serviceUnavailable"
        );

      default:
        return i18n.t(
          "apiErrors.server"
        );
    }
  }

  /*
   * Mantém mensagens específicas do backend
   * apenas quando não existe um código conhecido
   * que possa ser traduzido no frontend.
   */
  const backendMessage =
    response?.data?.message;

  if (
    typeof backendMessage ===
      "string" &&
    backendMessage.trim()
  ) {
    return backendMessage;
  }

  switch (status) {
    case 400:
      return i18n.t(
        "apiErrors.status.badRequest"
      );

    case 401:
      return i18n.t(
        "apiErrors.status.unauthorized"
      );

    case 403:
      return i18n.t(
        "apiErrors.status.forbidden"
      );

    case 404:
      return i18n.t(
        "apiErrors.status.notFound"
      );

    case 422:
      return i18n.t(
        "apiErrors.status.validation"
      );

    case 429:
      return i18n.t(
        "apiErrors.status.tooManyRequests"
      );

    default:
      if (
        typeof fallbackMessage ===
          "string" &&
        fallbackMessage.trim()
      ) {
        return fallbackMessage;
      }

      return i18n.t(
        "apiErrors.generic"
      );
  }
}