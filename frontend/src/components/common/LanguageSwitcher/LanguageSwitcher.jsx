import { useTranslation } from "react-i18next";

import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage?.startsWith("en")
    ? "en"
    : "pt";

  async function handleLanguageChange(language) {
    await i18n.changeLanguage(language);

    document.documentElement.lang =
      language === "en" ? "en" : "pt-PT";
  }

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={t("language.changeLanguage")}
    >
      <button
        type="button"
        className={`language-switcher__button ${
          currentLanguage === "pt" ? "is-active" : ""
        }`}
        aria-pressed={currentLanguage === "pt"}
        onClick={() => handleLanguageChange("pt")}
      >
        PT
      </button>

      <span
        className="language-switcher__separator"
        aria-hidden="true"
      >
        |
      </span>

      <button
        type="button"
        className={`language-switcher__button ${
          currentLanguage === "en" ? "is-active" : ""
        }`}
        aria-pressed={currentLanguage === "en"}
        onClick={() => handleLanguageChange("en")}
      >
        EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;