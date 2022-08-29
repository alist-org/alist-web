import { createDisclosure } from "@hope-ui/solid";
import { ModalInput } from "~/components";
import { useFetch, usePath, useRouter, useT } from "~/hooks";
import { addAria2, bus, handleRrespWithNotifySuccess } from "~/utils";
import { onCleanup } from "solid-js";

export const Aria2 = () => {
  const t = useT();
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [loading, ok] = useFetch(addAria2);
  const { pathname } = useRouter();
  const { refresh } = usePath();
  const handler = (name: string) => {
    if (name === "add_aria2") {
      onOpen();
    }
  };
  bus.on("tool", handler);
  onCleanup(() => {
    bus.off("tool", handler);
  });
  return (
    <ModalInput
      title="home.toolbar.add_aria2"
      type="text"
      opened={isOpen()}
      onClose={onClose}
      loading={loading()}
      tips={t("home.toolbar.add_aria2-tips")}
      onSubmit={async (urls) => {
        const resp = await ok(pathname(), urls.split("\n"));
        handleRrespWithNotifySuccess(resp, () => {
          refresh();
          onClose();
        });
      }}
    />
  );
};
