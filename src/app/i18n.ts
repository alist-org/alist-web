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

const initialLang = localStorage.getItem("lang") || defaultLang;

// store lang and import
export const langMap = new Map<string, any>();
const imports = import.meta.glob("~/lang/*/index.ts");
for (const path in imports) {
  const name = path.split("/")[2];
  langMap.set(name, imports[path]);
}

const init = {
  [initialLang]: (await langMap.get(initialLang)()).default,
};

export const loadedLangs = new Set<string>();
loadedLangs.add(initialLang);

const i18n = createI18nContext(init, initialLang);

export { languages, i18n };
