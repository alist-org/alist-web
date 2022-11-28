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
import { PEmptyResp, PResp, SettingItem } from "~/types"
import {
  buildIndex,
  formatDate,
  getTarget,
  handleResp,
  handleRespWithNotifySuccess,
  r,
} from "~/utils"
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
  const [searchIndex, setSearchIndex] = createStore<SettingItem>(
    {} as SettingItem
  )
  const [searchIndexLoading, searchIndexDataReq] = useFetch(
    (): PResp<SettingItem> => r.get("/admin/setting/get?key=search_index")
  )
  const refreshSearchIndex = async () => {
    const resp = await searchIndexDataReq()
    handleResp(resp, (data) => {
      setSearchIndex(data)
    })
  }
  refreshSearchIndex()
  const [saveSearchIndexLoading, saveSearchIndexReq] = useFetch(
    (): PEmptyResp => r.post("/admin/setting/save", [getTarget(searchIndex)])
  )
  const saveSearchIndex = async () => {
    const resp = await saveSearchIndexReq()
    handleRespWithNotifySuccess(resp, () => {
      refreshProgress()
    })
  }
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
  }
  return (
    <VStack spacing="$2" w="$full" alignItems="start">
      <Heading>{t("indexes.search_index")}</Heading>
      <Item
        hideLabel
        w="min($sm, 100%)"
        {...searchIndex}
        onChange={(str) => setSearchIndex("value", str)}
      />
      <Button
        onClick={[saveSearchIndex, undefined]}
        loading={saveSearchIndexLoading()}
      >
        {t("global.save")}
      </Button>
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
              {t("indexes.obj_count")}:
              <Badge colorScheme="accent" ml="$2">
                {formatDate(progress()!.last_done_time)}
              </Badge>
            </Text>
            <Show when={progress()?.error}>
              <Text css={{ wordBreak: "break-all" }}>
                {t("indexes.obj_count")}:
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
        <Button onClick={[rebuild, undefined]} loading={reBuildLoading()}>
          {t(`indexes.${progress()?.is_done ? "rebuild" : "build"}`)}
        </Button>
      </HStack>
    </VStack>
  )
}

export default Indexes
