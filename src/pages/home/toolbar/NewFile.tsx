import { createDisclosure } from "@hope-ui/solid";
import { onCleanup } from "solid-js";
import { ModalInput } from "~/components";
import { useFetch, usePath, useRouter } from "~/hooks";
import {
  bus,
  fsNewFile,
  handleRrespWithNotifySuccess,
  pathJoin,
} from "~/utils";

export const NewFile = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [loading, ok] = useFetch(fsNewFile);
  const { refresh } = usePath();
  const { pathname } = useRouter();
  bus.on("tool", (name) => {
    if (name === "new_file") {
      onOpen();
    }
  });
  onCleanup(() => {
    bus.off("tool");
  });
  return (
    <ModalInput
      title="home.toolbar.input_filename"
      opened={isOpen()}
      onClose={onClose}
      loading={loading()}
      onSubmit={async (name) => {
        const resp = await ok(pathJoin(pathname(), name));
        handleRrespWithNotifySuccess(resp, () => {
          refresh();
          onClose();
        });
      }}
    />
  );
};
