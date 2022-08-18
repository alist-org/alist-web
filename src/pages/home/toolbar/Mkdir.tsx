import { RightIcon } from "./Icon";
import { CgFolderAdd } from "solid-icons/cg";
import { createDisclosure } from "@hope-ui/solid";
import { ModalInput } from "~/components";

export const Mkdir = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  return (
    <>
      <RightIcon as={CgFolderAdd} p="$1_5" tip="mkdir" onClick={onOpen} />
      <ModalInput
        title="home.toolbar.input_dir_name"
        opened={isOpen()}
        onClose={onClose}
      />
    </>
  );
};
