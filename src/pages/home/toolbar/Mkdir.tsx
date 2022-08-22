import { RightIcon } from "./Icon";
import { createDisclosure } from "@hope-ui/solid";
import { ModalInput } from "~/components";
import { useFetch, usePath, useRouter } from "~/hooks";
import { fsMkdir, handleRrespWithNotifySuccess, pathJoin } from "~/utils";
import { operations } from "./operations";

export const Mkdir = () => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [loading, ok] = useFetch(fsMkdir);
  const { pathname } = useRouter();
  const { refresh } = usePath();
  return (
    <>
      <RightIcon
        as={operations.mkdir.icon}
        p="$1_5"
        tip="mkdir"
        onClick={onOpen}
      />
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
    </>
  );
};
