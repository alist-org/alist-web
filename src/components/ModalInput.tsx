import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  FormHelperText,
} from "@hope-ui/solid";
import { createSignal, Show } from "solid-js";
import { useT } from "~/hooks";
export type ModalInputProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  onSubmit?: (text: string) => void;
  type?: string;
  defaultValue?: string;
  loading?: boolean;
  tips?: string;
};
export const ModalInput = (props: ModalInputProps) => {
  const [value, setValue] = createSignal(props.defaultValue ?? "");
  const t = useT();
  return (
    <Modal
      blockScrollOnMount={false}
      opened={props.opened}
      onClose={props.onClose}
      initialFocus="#modal-input"
    >
      <ModalOverlay />
      <ModalContent>
        {/* <ModalCloseButton /> */}
        <ModalHeader>{t(props.title)}</ModalHeader>
        <ModalBody>
          <Show
            when={props.type === "text"}
            fallback={
              <Input
                id="modal-input"
                type={props.type}
                value={value()}
                onInput={(e) => {
                  setValue(e.currentTarget.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    props.onSubmit?.(value());
                  }
                }}
              />
            }
          >
            <Textarea
              id="modal-input"
              value={value()}
              onInput={(e) => {
                setValue(e.currentTarget.value);
              }}
            />
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
            onClick={() => props.onSubmit?.(value())}
          >
            {t("global.ok")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
