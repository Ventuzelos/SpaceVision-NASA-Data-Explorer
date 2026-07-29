export default function getApiErrorMessage(
  error,
  fallbackMessage = "Ocorreu um problema inesperado."
) {
  const status = error?.response?.status;

  if (!error?.response) {
    return "Não foi possível estabelecer ligação ao servidor. Confirma a tua ligação e tenta novamente.";
  }

  if (status >= 500) {
    switch (status) {
      case 502:
      case 503:
      case 504:
        return "O serviço está temporariamente indisponível. Tenta novamente dentro de alguns momentos.";

      default:
        return "O servidor encontrou um problema ao processar o pedido. Tenta novamente mais tarde.";
    }
  }

  const backendMessage = error?.response?.data?.message;

  if (
    typeof backendMessage === "string" &&
    backendMessage.trim()
  ) {
    return backendMessage;
  }

  switch (status) {
    case 400:
      return "O pedido enviado não é válido.";

    case 404:
      return "Não foram encontrados dados para esta pesquisa.";

    case 422:
      return "Os dados introduzidos não são válidos.";

    case 429:
      return "Foram realizados demasiados pedidos. Aguarda alguns momentos e tenta novamente.";

    default:
      return fallbackMessage;
  }
}