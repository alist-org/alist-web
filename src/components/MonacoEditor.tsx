import { Box } from "@hope-ui/solid"
import { createEffect, createSignal, onCleanup, onMount } from "solid-js"
import { MaybeLoading } from "./FullLoading"
import loader from "@monaco-editor/loader"
import { monaco_cdn } from "~/utils"

loader.config({
  paths: {
    vs: monaco_cdn,
  },
})
export interface MonacoEditorProps {
  value: string
  onChange?: (value: string) => void
  theme: "vs" | "vs-dark"
  path?: string
  language?: string
}
let monaco: any

export const MonacoEditorLoader = (props: MonacoEditorProps) => {
  const [loading, setLoading] = createSignal(true)
  loader.init().then((m) => {
    monaco = m
    setLoading(false)
  })
  return (
    <MaybeLoading loading={loading()}>
      <MonacoEditor {...props} />
    </MaybeLoading>
  )
}

export const MonacoEditor = (props: MonacoEditorProps) => {
  let monacoEditorDiv: HTMLDivElement
  let monacoEditor: any /*monaco.editor.IStandaloneCodeEditor*/
  let model: any /*monaco.editor.ITextModel*/
  onMount(() => {
    monacoEditor = monaco.editor.create(monacoEditorDiv!, {
      value: props.value,
      theme: props.theme,
    })
    model = monaco.editor.createModel(
      props.value,
      props.language,
      props.path ? monaco.Uri.parse(props.path) : undefined
    )
    monacoEditor.setModel(model)
    monacoEditor.onDidChangeModelContent(() => {
      props.onChange?.(monacoEditor.getValue())
    })
  })

  createEffect(() => {
    monaco.editor.setTheme(props.theme)
  })
  onCleanup(() => {
    model && model.dispose()
    monacoEditor && monacoEditor.dispose()
  })
  return <Box w="$full" h="70vh" ref={monacoEditorDiv!} />
}
