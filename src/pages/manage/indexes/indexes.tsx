import {
  Badge,
  Button,
  Heading,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  VStack,
} from "@hope-ui/solid"
import { createSignal, For, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { useFetch, useT } from "~/hooks"
import { Group, PEmptyResp, PResp, SettingItem } from "~/types"
import {
  buildIndex,
  formatDate,
  getTarget,
  handleResp,
  handleRespWithNotifySuccess,
  r,
} from "~/utils"
import CommonSettings from "../settings/Common"
import { Item } from "../settings/SettingItem"
import { LineMdConfirmCircleTwotone, LineMdLoadingTwotoneLoop } from "./icons"

type Progress = {
  obj_count: number
  is_done: boolean
  last_done_time: string
  error: string
}

const Indexes = () => {
  const t = useT()
  const [progress, setProgress] = createSignal<Progress>()
  const [progressLoading, getProgressReq] = useFetch(
    (): PResp<Progress> => r.get("/admin/index/progress")
  )
  const refreshProgress = async () => {
    const resp = await getProgressReq()
    handleResp(resp, (data) => {
      setProgress(data)
    })
  }
  refreshProgress()
  const [reBuildLoading, rebuildReq] = useFetch(buildIndex)
  const rebuild = async () => {
    const resp = await rebuildReq()
    handleRespWithNotifySuccess(resp)
    refreshProgress()
  }
  const [stopBuildLoading, stopBuildReq] = useFetch(
    (): PResp<Progress> => r.post("/admin/index/stop")
  )
  const stopBuild = async () => {
    const resp = await stopBuildReq()
    handleRespWithNotifySuccess(resp)
    refreshProgress()
  }
  return (
    <VStack spacing="$2" w="$full" alignItems="start">
      <Heading>{t("manage.sidemenu.settings")}</Heading>
      <CommonSettings group={Group.INDEX} />
      <Heading>{t("indexes.current")}</Heading>
      <Show when={progress()}>
        <HStack
          spacing="$2"
          // w="$full"
          w="fit-content"
          shadow="$md"
          rounded="$lg"
          bg={useColorModeValue("", "$neutral3")()}
        >
          <Icon
            boxSize="$28"
            color="$accent9"
            p="$2"
            as={
              progress()?.is_done
                ? LineMdConfirmCircleTwotone
                : LineMdLoadingTwotoneLoop
            }
          />
          <VStack spacing="$2" flex="1" alignItems="start" mr="$2">
            <Text>
              {t("indexes.obj_count")}:
              <Badge colorScheme="info" ml="$2">
                {progress()?.obj_count}
              </Badge>
            </Text>
            <Text>
              {t("indexes.last_done_time")}:
              <Badge colorScheme="accent" ml="$2">
                {progress()!.last_done_time ? formatDate(progress()!.last_done_time) : t("indexes.unknown")}
              </Badge>
            </Text>
            <Show when={progress()?.error}>
              <Text css={{ wordBreak: "break-all" }}>
                {t("indexes.error")}:
                <Badge colorScheme="danger" ml="$2">
                  {progress()!.error}
                </Badge>
              </Text>
            </Show>
          </VStack>
        </HStack>
      </Show>
      <HStack spacing="$2">
        <Button
          colorScheme="accent"
          onClick={[refreshProgress, undefined]}
          loading={progressLoading()}
        >
          {t("global.refresh")}
        </Button>
        <Button
          colorScheme="warning"
          onClick={[stopBuild, undefined]}
          loading={stopBuildLoading()}
        >
          {t("indexes.stop")}
        </Button>
        <Button onClick={[rebuild, undefined]} loading={reBuildLoading()}>
          {t(`indexes.${progress()?.is_done ? "rebuild" : "build"}`)}
        </Button>
      </HStack>
    </VStack>
  )
}

export default Indexes
