import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ptTranslation from "./locales/pt/translation.json";
import enTranslation from "./locales/en/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: {
        translation: ptTranslation,
      },
      en: {
        translation: enTranslation,
      },
    },

    fallbackLng: "pt",

    supportedLngs: ["pt", "en"],

    load: "languageOnly",

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "spacevision-language",
    },

    interpolation: {
      escapeValue: false,
    },
  });

  function syncHtmlLang(language) {
  document.documentElement.lang =
    language === "en" ? "en" : "pt-PT";
}

i18n.on("languageChanged", syncHtmlLang);


syncHtmlLang(i18n.resolvedLanguage);

export default i18n;