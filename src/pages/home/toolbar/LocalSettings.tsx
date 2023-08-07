import {
  Center,
  createDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionIndicator,
  SelectOptionText,
  SelectPlaceholder,
  SelectTrigger,
  SelectValue,
  VStack,
} from "@hope-ui/solid"
import { For, Match, onCleanup, Switch } from "solid-js"
import { SwitchLanguageWhite, SwitchColorMode } from "~/components"
import { useT } from "~/hooks"
import { initialLocalSettings, local, LocalSetting, setLocal } from "~/store"
import { bus } from "~/utils"

function LocalSettingEdit(props: LocalSetting) {
  const t = useT()
  return (
    <FormControl>
      <FormLabel>{t(`home.local_settings.${props.key}`)}</FormLabel>
      <Switch
        fallback={
          <Input
            value={local[props.key]}
            onInput={(e) => {
              setLocal(props.key, e.currentTarget.value)
            }}
          />
        }
      >
        <Match when={props.type === "select"}>
          <Select
            id={props.key}
            defaultValue={local[props.key]}
            onChange={(v) => setLocal(props.key, v)}
          >
            <SelectTrigger>
              <SelectPlaceholder>{t("global.choose")}</SelectPlaceholder>
              <SelectValue />
              <SelectIcon />
            </SelectTrigger>
            <SelectContent>
              <SelectListbox>
                <For each={props.options}>
                  {(item) => (
                    <SelectOption value={item}>
                      <SelectOptionText>
                        {t(`home.local_settings.${props.key}_options.${item}`)}
                      </SelectOptionText>
                      <SelectOptionIndicator />
                    </SelectOption>
                  )}
                </For>
              </SelectListbox>
            </SelectContent>
          </Select>
        </Match>
      </Switch>
    </FormControl>
  )
}

export const LocalSettings = () => {
  const { isOpen, onOpen, onClose } = createDisclosure()
  const t = useT()
  const handler = (name: string) => {
    if (name === "local_settings") {
      onOpen()
    }
  }
  bus.on("tool", handler)
  onCleanup(() => {
    bus.off("tool", handler)
  })
  return (
    <Drawer opened={isOpen()} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader color="$info9">
          {t("home.toolbar.local_settings")}
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing="$2">
            <For each={initialLocalSettings}>
              {(setting) => <LocalSettingEdit {...setting} />}
            </For>
          </VStack>
          <Center mt="$4">
            <HStack spacing="$4" p="$2" color="$neutral11">
              <SwitchLanguageWhite />
              <SwitchColorMode />
            </HStack>
          </Center>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
