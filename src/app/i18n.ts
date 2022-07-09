import { createI18nContext } from "@solid-primitives/i18n";

interface Language {
  lang: string;
  text: string;
}
const langs = import.meta.globEager("~/lang/*/index.ts");
const languages: Language[] = [];
const dict: Record<string, Record<string, any>> = {};
for (const path in langs) {
  const name = path.split("/")[2];
  dict[name] = langs[path].default;
  languages.push({
    lang: name,
    text: langs[path].text,
  });
}
const defaultLang =
  languages.find((lang) => lang.lang === navigator.language.toLowerCase())
    ?.lang || "en";

const initialLang = localStorage.getItem("lang") || defaultLang;
const i18n = createI18nContext(dict, initialLang);

export { languages, i18n };
