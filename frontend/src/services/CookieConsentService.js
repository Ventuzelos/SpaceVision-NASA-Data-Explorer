const STORAGE_KEY = "spacevision_cookie_consent";

/**
 * Devolve a escolha guardada do utilizador, ou null se ainda
 * não respondeu ao aviso de cookies.
 * @returns {{ status: "accepted" | "rejected", decidedAt: string } | null}
 */
export function getCookieConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Guarda a escolha do utilizador ("accepted" ou "rejected").
 * @param {"accepted" | "rejected"} status
 */
export function setCookieConsent(status) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ status, decidedAt: new Date().toISOString() })
    );
  } catch {
    // localStorage indisponível (ex: modo privado) — ignora em silêncio
  }
}