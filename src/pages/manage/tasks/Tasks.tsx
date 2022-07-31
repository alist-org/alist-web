import { Heading, VStack } from "@hope-ui/solid";
import { createSignal, For, onCleanup } from "solid-js";
import { useFetch, useT } from "~/hooks";
import { Resp, TaskInfo } from "~/types";
import { handleRresp, r } from "~/utils";
import { Task } from "./Task";

export interface TasksProps {
  type: string;
  done: string;
}
export const Tasks = (props: TasksProps) => {
  const t = useT();
  const [loading, get] = useFetch(() =>
    r.get(`/admin/task/${props.type}/${props.done}`)
  );
  const [tasks, setTasks] = createSignal<TaskInfo[]>([]);
  const refresh = async () => {
    const resp: Resp<TaskInfo[]> = await get();
    handleRresp(resp, (data) => setTasks(data));
  };
  refresh();
  if (props.done === "undone") {
    const interval = setInterval(refresh, 2000);
    onCleanup(() => clearInterval(interval));
  }
  return (
    <VStack w="$full" alignItems="start">
      <Heading size="lg">{t(`tasks.${props.done}`)}</Heading>
      <VStack w="$full" spacing="$2">
        <For each={tasks()}>{(task) => <Task {...task} {...props} />}</For>
      </VStack>
    </VStack>
  );
};

export const TypeTasks = (props: { type: string }) => {
  const t = useT();
  return (
    <VStack w="$full" alignItems="start" spacing="$4">
      <Heading size="xl">{t(`tasks.${props.type}`)}</Heading>
      <VStack w="$full" spacing="$2">
        <For each={["undone", "done"]}>
          {(done) => <Tasks type={props.type} done={done} />}
        </For>
      </VStack>
    </VStack>
  );
};
