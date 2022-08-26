import { createDisclosure } from "@hope-ui/solid";
import { ModalInput } from "~/components";
import { useFetch, usePath, useRouter } from "~/hooks";
import { bus, fsMkdir, handleRrespWithNotifySuccess, pathJoin } from "~/utils";
import { onCleanup } from "solid-js";

export const Mkdir = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [loading, ok] = useFetch(fsMkdir);
  const { pathname } = useRouter();
  const { refresh } = usePath();
  bus.on("tool", (name) => {
    if (name === "mkdir") {
      onOpen();
    }
  });
  onCleanup(() => {
    bus.off("tool");
  });
  return (
    <ModalInput
      title="home.toolbar.input_dir_name"
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
