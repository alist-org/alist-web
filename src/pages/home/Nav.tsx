import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbProps,
  BreadcrumbSeparator,
} from "@hope-ui/solid"
import { Link } from "@solidjs/router"
import { createMemo, For, Show } from "solid-js"
import { usePath, useRouter, useT } from "~/hooks"
import { getSetting, local } from "~/store"
import { encodePath, hoverColor, joinBase } from "~/utils"

export const Nav = () => {
  const { pathname } = useRouter()
  const paths = createMemo(() => ["", ...pathname().split("/").filter(Boolean)])
  const t = useT()
  const { setPathAs } = usePath()

  const stickyProps = createMemo<BreadcrumbProps>(() => {
    const mask: BreadcrumbProps = {
      _after: {
        content: "",
        bgColor: "$background",
        position: "absolute",
        height: "100%",
        width: "99vw",
        zIndex: -1,
        transform: "translateX(-50%)",
        left: "50%",
        top: 0,
      },
    }

    switch (local["position_of_header_navbar"]) {
      case "only_navbar_sticky":
        return { ...mask, position: "sticky", zIndex: "$sticky", top: 0 }
      case "sticky":
        return { ...mask, position: "sticky", zIndex: "$sticky", top: 60 }
      default:
        return {
          _after: undefined,
          position: undefined,
          zIndex: undefined,
          top: undefined,
        }
    }
  })

  return (
    <Breadcrumb {...stickyProps} background="$background" class="nav" w="$full">
      <For each={paths()}>
        {(name, i) => {
          const isLast = createMemo(() => i() === paths().length - 1)
          const path = paths()
            .slice(0, i() + 1)
            .join("/")
          const href = encodePath(path)
          let text = () => name
          if (text() === "") {
            text = () => getSetting("home_icon") + t("manage.sidemenu.home")
          }
          return (
            <BreadcrumbItem class="nav-item">
              <BreadcrumbLink
                class="nav-link"
                css={{
                  wordBreak: "break-all",
                }}
                color="unset"
                _hover={{ bgColor: hoverColor(), color: "unset" }}
                _active={{ transform: "scale(.95)", transition: "0.1s" }}
                cursor="pointer"
                p="$1"
                rounded="$lg"
                currentPage={isLast()}
                as={isLast() ? undefined : Link}
                href={joinBase(href)}
                onMouseEnter={() => setPathAs(path)}
              >
                {text}
              </BreadcrumbLink>
              <Show when={!isLast()}>
                <BreadcrumbSeparator class="nav-separator" />
              </Show>
            </BreadcrumbItem>
          )
        }}
      </For>
    </Breadcrumb>
  )
}
