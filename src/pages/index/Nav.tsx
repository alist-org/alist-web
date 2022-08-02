import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@hope-ui/solid";
import { Link } from "solid-app-router";
import { createMemo, For, Show } from "solid-js";
import { useRouter, useT } from "~/hooks";
import { getSetting } from "~/store";

export const Nav = () => {
  const { pathname, to } = useRouter();
  const paths = createMemo(() => [
    "",
    ...pathname().split("/").filter(Boolean),
  ]);
  // console.log(pathname(), paths());
  const t = useT();
  return (
    <Breadcrumb>
      <For each={paths()}>
        {(path, i) => {
          const isLast = createMemo(() => i() === paths().length - 1);
          const href = `${paths()
            .slice(0, i() + 1)
            .map((p) =>
              ["/", "#", "?"].some((c) => p.includes(c))
                ? encodeURIComponent(p)
                : p
            )
            .join("/")}`;
          let text = path;
          if (text === "") {
            text = getSetting("home_icon") + t("manage.sidemenu.home");
          }
          return (
            <BreadcrumbItem>
              <BreadcrumbLink
                color="unset"
                _hover={{ bgColor: "$neutral4", color: "unset" }}
                _active={{ transform: "scale(.95)", transition: "0.1s" }}
                cursor="pointer"
                p="$1"
                rounded="$lg"
                currentPage={isLast()}
                as={isLast() ? undefined : Link}
                href={href}
                onClick={() => {
                  to(href, false, { replace: true });
                }}
              >
                {text}
              </BreadcrumbLink>
              <Show when={!isLast()}>
                <BreadcrumbSeparator />
              </Show>
            </BreadcrumbItem>
          );
        }}
      </For>
    </Breadcrumb>
  );
};
