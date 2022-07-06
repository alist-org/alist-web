import { createI18nContext } from "@solid-primitives/i18n";

interface Language {
  lang: string;
  text: string;
}
const langs = import.meta.globEager("./lang/*/index.ts");
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

const i18n = createI18nContext(dict, "en");

export { languages, i18n };
