import { createI18nContext } from "@solid-primitives/i18n";

const langs = import.meta.globEager("./lang/*/index.ts");
const dict: Record<string, Record<string, any>> = {};
for (const path in langs) {
  const name = path.split("/")[2];
  dict[name] = langs[path].default;
}
console.log(dict);
const i18n = createI18nContext(dict, "en");

export default i18n;
