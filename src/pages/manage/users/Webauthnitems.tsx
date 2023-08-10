import { Button, Heading, Stack, VStack } from "@hope-ui/solid"
import { createSignal, Show } from "solid-js"
import { useT, useFetch } from "~/hooks"
import { PEmptyResp } from "~/types"
import { handleResp, notify, r } from "~/utils"

interface WebauthnItemProps {
  id: string
  fingerprint: string
}

export const WebauthnItem = (props: WebauthnItemProps) => {
  const t = useT()
  const [removeLoading, remove] = useFetch(
    (): PEmptyResp =>
      r.post(`/authn/delete_authn`, {
        id: props.id,
      }),
  )
  const [deleted, setDeleted] = createSignal(false)
  return (
    <Show when={!deleted()}>
      <Stack
        w="$full"
        overflowX="auto"
        shadow="$md"
        rounded="$lg"
        p="$2"
        direction={{ "@initial": "column", "@xl": "row" }}
        spacing="$2"
      >
        <VStack w="$full" alignItems="start" spacing="$1">
          <Heading
            color="$info9"
            css={{
              wordBreak: "break-all",
            }}
          >
            {"Fingerprint: " + props.fingerprint + "\tID: " + props.id}
          </Heading>
        </VStack>

        <Stack
          direction={{ "@initial": "row", "@xl": "column" }}
          justifyContent={{ "@xl": "center" }}
          spacing="$1"
        >
          <Button
            colorScheme="danger"
            loading={removeLoading()}
            onClick={async () => {
              const resp = await remove()
              handleResp(resp, () => {
                notify.success(t("global.delete_success"))
                setDeleted(true)
              })
            }}
          >
            {t("global.delete")}
          </Button>
        </Stack>
      </Stack>
    </Show>
  )
}
