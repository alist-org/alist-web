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
  VStack,
} from "@hope-ui/solid"
import { For, onCleanup } from "solid-js"
import { SwitchLanguageWhite, SwitchColorMode } from "~/components"
import { useT } from "~/hooks"
import { initialLocalSettings, local, setLocal } from "~/store"
import { bus } from "~/utils"

const LocalSettingsInput = (props: { name: string }) => {
  const t = useT()
  return (
    <FormControl>
      <FormLabel>{t(`home.local_settings.${props.name}`)}</FormLabel>
      <Input
        value={local[props.name]}
        onInput={(e) => {
          setLocal(props.name, e.currentTarget.value)
        }}
      />
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
            <For each={Object.keys(initialLocalSettings)}>
              {(name) => <LocalSettingsInput name={name} />}
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
