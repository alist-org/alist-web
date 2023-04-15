import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  FormHelperText,
  VStack,
} from "@hope-ui/solid"
import { createSignal, JSXElement, Show } from "solid-js"
import { useT } from "~/hooks"
import { notify } from "~/utils"
export type ModalTwoInputProps = {
  opened: boolean
  onClose: () => void
  title: string
  onSubmit?: (text1: string, text2: string) => void // Update onSubmit to accept two input texts
  type?: string
  defaultValue1?: string // Update defaultValue to defaultValue1
  defaultValue2?: string // Add defaultValue2 for second input
  loading?: boolean
  tips?: string
  topSlot?: JSXElement
}
export const ModalTwoInput = (props: ModalTwoInputProps) => {
  const [value1, setValue1] = createSignal(props.defaultValue1 ?? "") // Update value and setValue to value1 and setValue1
  const [value2, setValue2] = createSignal(props.defaultValue2 ?? "") // Add value2 and setValue2 for second input
  const t = useT()
  const submit = () => {
    if (!value1() || !value2()) {
      // Check if both input values are not empty
      notify.warning(t("global.empty_input"))
      return
    }
    props.onSubmit?.(value1(), value2()) // Update onSubmit to pass both input values
    setValue1("")
    setValue2("")
  }
  return (
    <Modal
      blockScrollOnMount={false}
      opened={props.opened}
      onClose={props.onClose}
      initialFocus="#modal-input1"
    >
      <ModalOverlay />
      <ModalContent>
        {/* <ModalCloseButton /> */}
        <ModalHeader>{t(props.title)}</ModalHeader>
        <ModalBody>
          <Show when={props.topSlot}>{props.topSlot}</Show>
          <Show
            when={props.type === "text"}
            fallback={
              <VStack spacing="$2">
                <Input
                  id="modal-input1" // Update id to "modal-input1" for first input
                  type={props.type}
                  value={value1()} // Update value to value1 for first input
                  onInput={(e) => {
                    setValue1(e.currentTarget.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submit()
                    }
                  }}
                />
                <Input
                  id="modal-input2" // Add second input with id "modal-input2"
                  type={props.type}
                  value={value2()} // Bind value to value2 for second input
                  onInput={(e) => {
                    setValue2(e.currentTarget.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submit()
                    }
                  }}
                />
              </VStack>
            }
          >
            <div>
              <Textarea
                id="modal-input1" // Update id to "modal-input1" for first input
                value={value1()} // Update value to value1 for first input
                onInput={(e) => {
                  setValue1(e.currentTarget.value)
                }}
              />
              <Textarea
                id="modal-input2" // Add second input with id "modal-input2"
                value={value2()} // Bind value to value2 for second input
                onInput={(e) => {
                  setValue2(e.currentTarget.value)
                }}
              />
            </div>
          </Show>
          <Show when={props.tips}>
            <FormHelperText>{props.tips}</FormHelperText>
          </Show>
        </ModalBody>
        <ModalFooter display="flex" gap="$2">
          <Button onClick={props.onClose} colorScheme="neutral">
            {t("global.cancel")}
          </Button>
          <Button
            loading={props.loading}
            onClick={() => submit()}
            disabled={!value1() || !value2()}
          >
            {t("global.ok")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
