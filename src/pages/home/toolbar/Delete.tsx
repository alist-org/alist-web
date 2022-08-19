import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  createDisclosure,
} from "@hope-ui/solid";
import { AiOutlineDelete } from "solid-icons/ai";
import { useFetch, usePath, useRouter, useT } from "~/hooks";
import { selectedObjs } from "~/store";
import { fsRemove, handleRrespWithNotifySuccess } from "~/utils";
import { CenterIcon } from "./Icon";

export const Delete = () => {
  const t = useT();
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [loading, ok] = useFetch(fsRemove);
  const { refresh } = usePath();
  const { pathname } = useRouter();
  return (
    <>
      <CenterIcon tip="delete" as={AiOutlineDelete} onClick={onOpen} />
      <Modal
        opened={isOpen()}
        onClose={onClose}
        size={{
          "@initial": "xs",
          "@md": "md",
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("home.toolbar.delete")}</ModalHeader>
          <ModalBody>
            <p>{t("home.toolbar.delete_tips")}</p>
          </ModalBody>
          <ModalFooter display="flex" gap="$2">
            <Button onClick={onClose} colorScheme="neutral">
              {t("global.cancel")}
            </Button>
            <Button
              colorScheme="danger"
              loading={loading()}
              onClick={async () => {
                const resp = await ok(
                  pathname(),
                  selectedObjs().map((obj) => obj.name)
                );
                handleRrespWithNotifySuccess(resp, () => {
                  refresh();
                  onClose();
                });
              }}
            >
              {t("global.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
