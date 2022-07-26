import {
  Badge,
  Box,
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@hope-ui/solid";
import { createSignal, For } from "solid-js";
import {
  useFetch,
  useListFetch,
  useManageTitle,
  useRouter,
  useT,
} from "~/hooks";
import { handleRresp, notify, r } from "~/utils";
import { PageResp, User, UserMethods } from "~/types";

const Role = (props: { role: number }) => {
  const roles = [
    { name: "general", color: "info" },
    { name: "guest", color: "neutral" },
    { name: "admin", color: "accent" },
  ];
  return (
    <Badge colorScheme={roles[props.role].color as any}>
      {roles[props.role].name}
    </Badge>
  );
};

const Permissions = (props: { user: User }) => {
  const t = useT();
  const color = (can: boolean) => `$${can ? "success" : "danger"}9`;
  return (
    <HStack spacing="$0_5">
      <For
        each={[
          { name: "see_hides", can: UserMethods.can_see_hides(props.user) },
          {
            name: "access_without_password",
            can: UserMethods.can_access_without_password(props.user),
          },
          {
            name: "add_aria2",
            can: UserMethods.can_add_aria2_tasks(props.user),
          },
          {
            name: "write",
            can: UserMethods.can_write(props.user),
          },
          { name: "rename", can: UserMethods.can_rename(props.user) },
          { name: "move", can: UserMethods.can_move(props.user) },
          { name: "copy", can: UserMethods.can_copy(props.user) },
          { name: "remove", can: UserMethods.can_remove(props.user) },
          { name: "webdav_read", can: UserMethods.can_webdav_read(props.user) },
          {
            name: "webdav_manage",
            can: UserMethods.can_webdav_manage(props.user),
          },
        ]}
      >
        {(item) => (
          <Tooltip label={t(`users.permissions.${item.name}`)}>
            <Box boxSize="$2" rounded="$full" bg={color(item.can)}></Box>
          </Tooltip>
        )}
      </For>
    </HStack>
  );
};

const Users = () => {
  const t = useT();
  useManageTitle("manage.sidemenu.users");
  const { to } = useRouter();
  const [getUsersLoading, getUsers] = useFetch(() => r.get("/admin/user/list"));
  const [users, setUsers] = createSignal<User[]>([]);
  const refresh = async () => {
    const resp: PageResp<User> = await getUsers();
    handleRresp(resp, (data) => setUsers(data.content));
  };
  refresh();

  const [deleting, deleteUser] = useListFetch((id: number) =>
    r.post(`/admin/user/delete?id=${id}`)
  );
  return (
    <VStack spacing="$2" alignItems="start" w="$full">
      <HStack spacing="$2">
        <Button
          colorScheme="accent"
          loading={getUsersLoading()}
          onClick={refresh}
        >
          {t("global.refresh")}
        </Button>
        <Button
          onClick={() => {
            to("/@manage/users/add");
          }}
        >
          {t("global.add")}
        </Button>
      </HStack>
      <Box w="$full" overflowX="auto">
        <Table highlightOnHover dense>
          <Thead>
            <Tr>
              <For
                each={[
                  "username",
                  "base_path",
                  "role",
                  "permissions",
                  "operations",
                ]}
              >
                {(title) => <Th>{t(`users.${title}`)}</Th>}
              </For>
            </Tr>
          </Thead>
          <Tbody>
            <For each={users()}>
              {(user) => (
                <Tr>
                  <Td>{user.username}</Td>
                  <Td>{user.base_path}</Td>
                  <Td>
                    <Role role={user.role} />
                  </Td>
                  <Td>
                    <Permissions user={user} />
                  </Td>
                  <Td>
                    <HStack spacing="$2">
                      <Button
                        onClick={() => {
                          to(`/@manage/users/edit/${user.id}`);
                        }}
                      >
                        {t("global.edit")}
                      </Button>
                      <Popover>
                        {({ onClose }) => (
                          <>
                            <PopoverTrigger as={Button} colorScheme="danger">
                              {t("global.delete")}
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverHeader>
                                {t("global.delete_confirm", {
                                  name: user.username,
                                })}
                              </PopoverHeader>
                              <PopoverBody>
                                <HStack spacing="$2">
                                  <Button
                                    onClick={onClose}
                                    colorScheme="neutral"
                                  >
                                    {t("global.cancel")}
                                  </Button>
                                  <Button
                                    colorScheme="danger"
                                    loading={deleting() === user.id}
                                    onClick={async () => {
                                      const resp = await deleteUser(user.id);
                                      handleRresp(resp, () => {
                                        notify.success(
                                          t("global.delete_success")
                                        );
                                        refresh();
                                      });
                                    }}
                                  >
                                    {t("global.confirm")}
                                  </Button>
                                </HStack>
                              </PopoverBody>
                            </PopoverContent>
                          </>
                        )}
                      </Popover>
                    </HStack>
                  </Td>
                </Tr>
              )}
            </For>
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default Users;
