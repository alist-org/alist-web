import { createDisclosure } from "@hope-ui/solid";
import { onCleanup } from "solid-js";
import { ModalInput } from "~/components";
import { useFetch, usePath, useRouter } from "~/hooks";
import { password } from "~/store";
import {
  bus,
  fsNewFile,
  handleRespWithNotifySuccess,
  pathJoin,
} from "~/utils";

export const NewFile = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [loading, ok] = useFetch(fsNewFile);
  const { refresh } = usePath();
  const { pathname } = useRouter();
  const handler = (name: string) => {
    if (name === "new_file") {
      onOpen();
    }
  };
  bus.on("tool", handler);
  onCleanup(() => {
    bus.off("tool", handler);
  });
  return (
    <ModalInput
      title="home.toolbar.input_filename"
      opened={isOpen()}
      onClose={onClose}
      loading={loading()}
      onSubmit={async (name) => {
        const resp = await ok(pathJoin(pathname(), name), password());
        handleRespWithNotifySuccess(resp, () => {
          refresh();
          onClose();
        });
      }}
    />
  );
};
