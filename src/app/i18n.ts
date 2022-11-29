import { createI18nContext } from "@solid-primitives/i18n"
import { createSignal } from "solid-js"

interface Language {
  code: string
  lang: string
}
const langs = import.meta.glob("~/lang/*/index.json", {
  eager: true,
  import: "lang",
})
const languages: Language[] = []

for (const path in langs) {
  const name = path.split("/")[3]
  languages.push({
    code: name,
    lang: langs[path] as string,
  })
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
  "en"

export let initialLang = localStorage.getItem("lang") ?? ""
if (!initialLang || !languages.find((lang) => lang.code === initialLang)) {
  initialLang = defaultLang
}

// store lang and import
export const langMap: Record<string, any> = {}
const imports = import.meta.glob("~/lang/*/entry.ts")
for (const path in imports) {
  const name = path.split("/")[3]
  langMap[name] = imports[path]
}

export const loadedLangs = new Set<string>()

const i18n = createI18nContext({}, initialLang)

const [currentLang, setLang] = createSignal(initialLang)

export { languages, i18n, currentLang, setLang }
