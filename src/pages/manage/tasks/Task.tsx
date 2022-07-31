import {
  Badge,
  Button,
  Heading,
  HStack,
  Progress,
  ProgressIndicator,
  ProgressLabel,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@hope-ui/solid";
import { Show } from "solid-js";
import { useT } from "~/hooks";
import { TaskInfo } from "~/types";
import { TasksProps } from "./Tasks";

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
};
export const TaskState = (props: { state: string }) => {
  const t = useT();
  return (
    <Badge colorScheme={StateMap[props.state] ?? "info"}>
      {t(`tasks.${props.state}`)}
    </Badge>
  );
};

const DONE = ["succeeded", "canceled", "errored"];
const UNDONE = ["pending", "running", "canceling"];

export const Task = (props: TaskInfo & TasksProps) => {
  const t = useT();
  return (
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
        <Heading size="sm">{props.name}</Heading>
        <TaskState state={props.state} />
        <Text>{props.status}</Text>
        <Progress w="$full" trackColor="$info3" value={props.progress}>
          <ProgressIndicator color="$info8" rounded="$md" />
          {/* <ProgressLabel /> */}
        </Progress>
      </VStack>
      <Show when={props.done === "undone"}>
        <Stack
          direction={{ "@initial": "row", "@xl": "column" }}
          justifyContent={{ "@xl": "center" }}
          spacing="$1"
        >
          <Button colorScheme="danger">{t("global.cancel")}</Button>
        </Stack>
      </Show>
    </Stack>
  );
};
