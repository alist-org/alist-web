import { createDisclosure } from "@hope-ui/solid";
import { CgFileAdd } from "solid-icons/cg";
import { ModalInput } from "~/components";
import { RightIcon } from "./Icon";

export const NewFile = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  return (
    <>
      <RightIcon as={CgFileAdd} tip="new_file" onClick={onOpen} />
      <ModalInput
        title="home.toolbar.input_filename"
        opened={isOpen()}
        onClose={onClose}
      />
    </>
  );
};
