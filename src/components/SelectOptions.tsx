import { createSignal, createEffect, on, Show, For } from "solid-js"
import {
  hope,
  useSelectContext,
  SelectTrigger,
  SelectPlaceholder,
  SelectValue,
  SelectIcon,
  Input,
  SelectContent,
  SelectListbox,
  SelectOption,
  SelectOptionText,
  SelectOptionIndicator,
} from "@hope-ui/solid"
import { BsSearch } from "solid-icons/bs"
import { useT } from "~/hooks"

interface SelectOptionsProps {
  options: { key: string; label: string }[]
  searchable?: boolean
  readonly?: boolean
}

const SearchIcon = hope(BsSearch, { baseStyle: { color: "$neutral11" } })

export const SelectOptions = (props: SelectOptionsProps) => {
  const t = useT()
  const selectContext = useSelectContext()

  const [searching, setSearching] = createSignal(false)
  const [displayValue, setDisplayValue] = createSignal("")

  let tid: ReturnType<typeof setTimeout>

  const displayOptions = () => {
    if (!props.searchable) return props.options
    return props.options.filter((o) =>
      new RegExp(displayValue(), "i").test(o.label),
    )
  }

  const selectedLabel = () =>
    selectContext.state.selectedOptions.map((o) => o.textValue).join(",")

  createEffect(on(selectedLabel, setDisplayValue))

  return (
    <>
      <SelectTrigger
        as={
          props.searchable
            ? "div" // pressing "Space" will open option list, prevent this behavior by setting as "div"
            : undefined
        }
      >
        <Show
          fallback={
            <>
              <SelectPlaceholder>{t("global.choose")}</SelectPlaceholder>
              <SelectValue />
              <SelectIcon />
            </>
          }
          when={!props.readonly && props.searchable}
        >
          <Input
            border="none"
            variant="unstyled"
            placeholder={
              searching()
                ? selectedLabel() || t("global.choose")
                : t("global.choose")
            }
            value={searching() ? displayValue() : selectedLabel()}
            onKeyDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              if (!selectContext.state.opened) return
              e.stopPropagation()
            }}
            onInput={(e) => {
              clearTimeout(tid)
              setDisplayValue(e.currentTarget.value)
            }}
            onBlur={() => {
              setSearching(false)
              tid = setTimeout(
                () => setDisplayValue(""),
                300 /* transition duration of <SelectContent /> */,
              )
            }}
            onFocus={() => {
              clearTimeout(tid)
              setDisplayValue("")
              setSearching(true)
            }}
          />
          <Show when={searching()} fallback={<SelectIcon />}>
            <SearchIcon />
          </Show>
        </Show>
      </SelectTrigger>
      <SelectContent>
        <SelectListbox>
          <For each={displayOptions()}>
            {(item) => (
              <SelectOption value={item.key}>
                <SelectOptionText>{item.label}</SelectOptionText>
                <SelectOptionIndicator />
              </SelectOption>
            )}
          </For>
        </SelectListbox>
      </SelectContent>
    </>
  )
}
