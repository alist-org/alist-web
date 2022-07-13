import { createI18nContext } from "@solid-primitives/i18n";

interface Language {
  code: string;
  lang: string;
}
const langs = import.meta.globEager("~/lang/*/index.json");
const languages: Language[] = [];

for (const path in langs) {
  const name = path.split("/")[2];
  languages.push({
    code: name,
    lang: langs[path].lang,
  });
}
const defaultLang =
  languages.find(
    (lang) => lang.code.toLowerCase() === navigator.language.toLowerCase()
  )?.code ||
  languages.find(
    (lang) =>
      lang.code.toLowerCase().split("_")[0] ===
      navigator.language.toLowerCase().split("_")[0]
  )?.code ||
  "en";

export const initialLang = localStorage.getItem("lang") || defaultLang;

// store lang and import
export const langMap: Record<string, any> = {};
const imports = import.meta.glob("~/lang/*/index.ts");
for (const path in imports) {
  const name = path.split("/")[2];
  langMap[name] = imports[path];
}

export const loadedLangs = new Set<string>();

const i18n = createI18nContext({}, initialLang);

export { languages, i18n };
