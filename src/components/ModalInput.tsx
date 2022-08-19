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
} from "@hope-ui/solid";
import { createSignal } from "solid-js";
import { useT } from "~/hooks";
export type ModalInputProps = {
  opened: boolean;
  onClose: () => void;
  title: string;
  onSubmit?: (text: string) => void;
  type?: string;
  defaultValue?: string;
  loading?: boolean;
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
