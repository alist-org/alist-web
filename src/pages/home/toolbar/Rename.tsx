import { createDisclosure } from "@hope-ui/solid";
import { CgRename } from "solid-icons/cg";
import { ModalInput } from "~/components";
import { useT } from "~/hooks";
import { oneChecked, selectedObjs } from "~/store";
import { notify } from "~/utils";
import { CenterIcon } from "./Icon";

export const Rename = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const t = useT();
  return (
    <>
      <CenterIcon
        tip="rename"
        as={CgRename}
        onClick={() => {
          if (!oneChecked()) {
            notify.warning(t("home.toolbar.only_one_tip"));
            return;
          }
          onOpen();
        }}
      />
      <ModalInput
        title="home.toolbar.input_new_name"
        opened={isOpen()}
        onClose={onClose}
        defaultValue={selectedObjs()[0].name}
      />
    </>
  );
};
