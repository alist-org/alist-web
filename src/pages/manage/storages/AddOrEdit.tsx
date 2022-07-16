import { Heading } from "@hope-ui/solid";
import { Show } from "solid-js";
import { useRouter } from "~/hooks";

const AddOrEdit = () => {
  const { params } = useRouter();
  const { id } = params;
  return (
    <>
      <Show when={id} fallback={<Heading>Add</Heading>}>
        <Heading>Edit: {id}</Heading>
      </Show>
    </>
  );
};

export default AddOrEdit;
