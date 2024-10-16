import en from "./translation.en.json";
import ja from "./translation.ja.json";

const i18n = {
  translations: {
    en: en,
    ja: ja,
  },
  defaultLang: "en",
  useBrowserDefault: true,
  // optional property will default to "query" if not set
  languageDataStore: "query" || "localStorage",
};

module.exports = i18n;
