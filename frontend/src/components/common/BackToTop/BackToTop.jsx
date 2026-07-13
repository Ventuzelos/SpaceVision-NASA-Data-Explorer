import { useEffect, useState } from "react";

import Icon from "../Icon/Icon";

import "./BackToTop.css";

const SHOW_AFTER_PX = 480;

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo"
    >
      <Icon name="ArrowUp" size={20} />
    </button>
  );
}

export default BackToTop;
