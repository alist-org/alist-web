import {
  Box,
  Button,
  createDisclosure,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@hope-ui/solid";
import { BiSolidRightArrow } from "solid-icons/bi";
import {
  Accessor,
  createContext,
  createSignal,
  useContext,
  Show,
  For,
} from "solid-js";
import { useFetch, useT } from "~/hooks";
import { getIconColor } from "~/store";
import { Obj, Resp } from "~/types";
import { pathBase, handleRresp, hoverColor, pathJoin, r } from "~/utils";

export interface FolderTreeProps {
  onChange: (path: string) => void;
}
const context = createContext<{
  value: Accessor<string>;
  onChange: (val: string) => void;
}>();
export const FolderTree = (props: FolderTreeProps) => {
  const [path, setPath] = createSignal("/");
  return (
    <Box class="folder-tree-box" w="$full" overflowX="auto">
      <context.Provider
        value={{
          value: path,
          onChange: (val) => {
            setPath(val);
            props.onChange(val);
          },
        }}
      >
        <FolderTreeNode path="/" />
      </context.Provider>
    </Box>
  );
};

const FolderTreeNode = (props: { path: string }) => {
  const [children, setChildren] = createSignal<Obj[]>([]);
  const { value, onChange } = useContext(context)!;
  const [loading, fetchDirs] = useFetch(() =>
    r.post("/fs/dirs", { path: props.path })
  );
  const load = async () => {
    if (children().length > 0) return;
    const resp: Resp<Obj[]> = await fetchDirs();
    handleRresp(resp, setChildren);
  };
  const { isOpen, onToggle } = createDisclosure();
  const active = () => value() === props.path;
  return (
    <Box>
      <HStack spacing="$2">
        <Show
          when={!loading()}
          fallback={<Spinner size="sm" color={getIconColor()} />}
        >
          <Icon
            color={getIconColor()}
            as={BiSolidRightArrow}
            transform={isOpen() ? "rotate(90deg)" : "none"}
            transition="transform 0.2s"
            cursor="pointer"
            onClick={() => {
              onToggle();
              if (isOpen()) {
                load();
              }
            }}
          />
        </Show>
        <Text
          css={{
            // textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          // overflow="hidden"
          fontSize="$md"
          cursor="pointer"
          px="$1"
          rounded="$md"
          bgColor={active() ? "$info8" : "transparent"}
          _hover={{
            bgColor: active() ? "$info8" : hoverColor,
          }}
          onClick={() => {
            onChange(props.path);
          }}
        >
          {props.path === "/" ? "root" : pathBase(props.path)}
        </Text>
      </HStack>
      <Show when={isOpen()}>
        <VStack pl="$4" alignItems="start" spacing="$1">
          <For each={children()}>
            {(item) => (
              <FolderTreeNode path={pathJoin(props.path, item.name)} />
            )}
          </For>
        </VStack>
      </Show>
    </Box>
  );
};

export const FolderChooseInput = (props: {
  value: string;
  onChange: (path: string) => void;
  id?: string;
}) => {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const t = useT();
  return (
    <>
      <Input
        id={props.id}
        onClick={onOpen}
        value={props.value}
        readOnly
        placeholder={t("global.choose_folder")}
      />
      <Modal size="xl" opened={isOpen()} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{t("global.choose_folder")}</ModalHeader>
          <ModalBody>
            <FolderTree onChange={props.onChange} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>{t("global.confirm")}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
