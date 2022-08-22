import { createDisclosure } from "@hope-ui/solid";
import { ModalInput } from "~/components";
import { useFetch, usePath, useRouter } from "~/hooks";
import { fsNewFile, handleRrespWithNotifySuccess, pathJoin } from "~/utils";
import { RightIcon } from "./Icon";
import { operations } from "./operations";

export const NewFile = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [loading, ok] = useFetch(fsNewFile);
  const { refresh } = usePath();
  const { pathname } = useRouter();
  return (
    <>
      <RightIcon
        as={operations.new_file.icon}
        tip="new_file"
        onClick={onOpen}
      />
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
    </>
  );
};
