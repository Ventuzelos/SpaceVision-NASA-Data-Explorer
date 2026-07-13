import { useEffect, useRef } from "react";

/**
 * Hook de parallax simples: desloca o elemento devolvido
 * verticalmente em função do scroll da página, criando uma
 * sensação de profundidade.
 *
 * @param {number} [speed] - multiplicador do deslocamento (valores
 * mais baixos deslocam o elemento mais devagar que o scroll)
 * @returns {import('react').RefObject}
 */
export function useParallax(speed = 0.2) {
  const ref = useRef(null);

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) return;

      ref.current.style.transform = `translateY(${window.scrollY * speed}px)`;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return ref;
}
