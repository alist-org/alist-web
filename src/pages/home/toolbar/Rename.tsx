import { createDisclosure } from "@hope-ui/solid";
import { ModalInput } from "~/components";
import { useFetch, usePath, useRouter, useT } from "~/hooks";
import { oneChecked, selectedObjs } from "~/store";
import {
  fsRename,
  handleRrespWithNotifySuccess,
  notify,
  pathJoin,
} from "~/utils";
import { CenterIcon } from "./Icon";

export const Rename = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const t = useT();
  const [loading, ok] = useFetch(fsRename);
  const { pathname } = useRouter();
  const { refresh } = usePath();
  return (
    <>
      <CenterIcon
        name="rename"
        onClick={() => {
          if (!oneChecked()) {
            notify.warning(t("home.toolbar.only_one-tips"));
            return;
          }
          onOpen();
        }}
      />
      <ModalInput
        title="home.toolbar.input_new_name"
        opened={isOpen()}
        onClose={onClose}
        defaultValue={selectedObjs()[0]?.name ?? ""}
        loading={loading()}
        onSubmit={async (name) => {
          const resp = await ok(
            pathJoin(pathname(), selectedObjs()[0].name),
            name
          );
          handleRrespWithNotifySuccess(resp, () => {
            refresh();
            onClose();
          });
        }}
      />
    </>
  );
};
