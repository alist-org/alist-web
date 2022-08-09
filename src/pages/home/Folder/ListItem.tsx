import { HStack } from "@hope-ui/solid";
import { LinkWithBase } from "~/components";
import { usePath, useRouter } from "~/hooks";
import { Obj } from "~/types";

export const ListItem = (props: { obj: Obj }) => {
  const { pushHref } = useRouter();
  const { setPathAsDir } = usePath();
  return (
    <HStack
      w="$full"
      p="$2"
      as={LinkWithBase}
      href={pushHref(props.obj.name)}
      onMouseEnter={() => {
        if (props.obj.is_dir) {
          setPathAsDir(props.obj.name, true);
        }
      }}
    >
      <div>{props.obj.name}</div>
    </HStack>
  );
};
