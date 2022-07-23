import {
  Badge,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  VStack,
} from "@hope-ui/solid";
import { createSignal, JSXElement } from "solid-js";
import { useFetch, useRouter, useT } from "~/hooks";
import { setUser, user } from "~/store";
import { UserMethods } from "~/types";
import { handleRresp, notify, r } from "~/utils";

const PermissionBadge = (props: { can: boolean; children: JSXElement }) => {
  return (
    <Badge colorScheme={props.can ? "success" : "danger"}>
      {props.children}
    </Badge>
  );
};

const Profile = () => {
  const t = useT();
  const { to } = useRouter();
  const [username, setUsername] = createSignal(user().username);
  const [password, setPassword] = createSignal("");
  const [loading, save] = useFetch(() =>
    r.post("/me/update", {
      username: username(),
      password: password(),
    })
  );
  return (
    <VStack spacing="$2" alignItems="start">
      <Heading>{t("settings.update_profile")}</Heading>
      <SimpleGrid gap="$2" columns={{ "@initial": 1, "@md": 2 }}>
        <FormControl>
          <FormLabel for="username">{t("settings.change_username")}</FormLabel>
          <Input
            id="username"
            value={username()}
            onInput={(e) => {
              setUsername(e.currentTarget.value);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel for="password">{t("settings.change_password")}</FormLabel>
          <Input
            id="password"
            type="password"
            value={password()}
            onInput={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
          <FormHelperText>{t("settings.change_password_tips")}</FormHelperText>
        </FormControl>
      </SimpleGrid>
      <Button
        loading={loading()}
        onClick={async () => {
          const resp = await save();
          handleRresp(resp, () => {
            setUser({ ...user(), username: username() });
            notify.success(t("settings.update_profile_success"));
            to(`/@login?redirect=${encodeURIComponent(location.pathname)}`);
          });
        }}
      >
        {t("global.save")}
      </Button>
      <HStack wrap="wrap" gap="$2" mt="$2">
        <PermissionBadge can={UserMethods.can_see_hides(user())}>
          {t("user.permission.see_hides")}
        </PermissionBadge>
        <PermissionBadge can={UserMethods.can_access_without_password(user())}>
          {t("user.permission.access_without_password")}
        </PermissionBadge>
        <PermissionBadge can={UserMethods.can_add_aria2_tasks(user())}>
          {t("user.permission.add_aria2")}
        </PermissionBadge>
        <PermissionBadge can={UserMethods.can_write(user())}>
          {t("user.permission.write")}
        </PermissionBadge>
        <PermissionBadge can={UserMethods.can_rename(user())}>
          {t("user.permission.rename")}
        </PermissionBadge>
        <PermissionBadge can={UserMethods.can_move(user())}>
          {t("user.permission.move")}
        </PermissionBadge>
        <PermissionBadge can={UserMethods.can_copy(user())}>
          {t("user.permission.copy")}
        </PermissionBadge>
        <PermissionBadge can={UserMethods.can_remove(user())}>
          {t("user.permission.remove")}
        </PermissionBadge>
        <PermissionBadge can={UserMethods.can_webdav_read(user())}>
          {t("user.permission.webdav_read")}
        </PermissionBadge>
        <PermissionBadge can={UserMethods.can_webdav_manage(user())}>
          {t("user.permission.webdav_manage")}
        </PermissionBadge>
      </HStack>
    </VStack>
  );
};

export default Profile;
