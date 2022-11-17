import {
  Badge,
  Button,
  Heading,
  Progress,
  ProgressIndicator,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@hope-ui/solid"
import { createSignal, Show } from "solid-js"
import { useT, useFetch } from "~/hooks"
import { PEmptyResp, TaskInfo } from "~/types"
import { handleResp, notify, r } from "~/utils"
import { TasksProps } from "./Tasks"

const StateMap: Record<
  string,
  | "primary"
  | "accent"
  | "neutral"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | undefined
> = {
  errored: "danger",
  succeeded: "success",
  canceled: "neutral",
}
export const TaskState = (props: { state: string }) => {
  const t = useT()
  return (
    <Badge colorScheme={StateMap[props.state] ?? "info"}>
      {t(`tasks.${props.state}`)}
    </Badge>
  )
}

const DONE = ["succeeded", "canceled", "errored"]
const UNDONE = ["pending", "running", "canceling"]

export const Task = (props: TaskInfo & TasksProps) => {
  const t = useT()
  const operateName = props.done === "undone" ? "cancel" : "delete"
  const [operateLoading, operate] = useFetch(
    (): PEmptyResp =>
      r.post(`/admin/task/${props.type}/${operateName}?tid=${props.id}`)
  )
  const [deleted, setDeleted] = createSignal(false)
  return (
    <Show when={!deleted()}>
      <Stack
        bgColor={useColorModeValue("$background", "$neutral3")()}
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
            size="sm"
            css={{
              wordBreak: "break-all",
            }}
          >
            {props.name}
          </Heading>
          <TaskState state={props.state} />
          <Text
            css={{
              wordBreak: "break-all",
            }}
          >
            {props.status}
          </Text>
          <Progress
            w="$full"
            trackColor="$info3"
            rounded="$full"
            size="sm"
            value={props.progress}
          >
            <ProgressIndicator color="$info8" rounded="$md" />
            {/* <ProgressLabel /> */}
          </Progress>
        </VStack>

        <Stack
          direction={{ "@initial": "row", "@xl": "column" }}
          justifyContent={{ "@xl": "center" }}
          spacing="$1"
        >
          <Button
            colorScheme="danger"
            loading={operateLoading()}
            onClick={async () => {
              const resp = await operate()
              handleResp(resp, () => {
                notify.success(t("global.delete_success"))
                setDeleted(true)
              })
            }}
          >
            {t(`global.${operateName}`)}
          </Button>
        </Stack>
      </Stack>
    </Show>
  )
}
