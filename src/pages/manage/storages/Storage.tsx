import {
  Badge,
  Button,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@hope-ui/solid"
import { useFetch, useRouter, useT } from "~/hooks"
import { getMainColor } from "~/store"
import { EmptyResp, Storage } from "~/types"
import { handleResp, handleRespWithNotifySuccess, notify, r } from "~/utils"
import { DeletePopover } from "../common/DeletePopover"

interface StorageProps {
  storage: Storage
  refresh: () => void
}

export const StorageC = (props: StorageProps) => {
  const t = useT()
  const { to } = useRouter()
  const [deleteLoading, deleteStorage] = useFetch(
    (): Promise<EmptyResp> =>
      r.post(`/admin/storage/delete?id=${props.storage.id}`)
  )
  const [enableOrDisableLoading, enableOrDisable] = useFetch(
    (): Promise<EmptyResp> =>
      r.post(
        `/admin/storage/${props.storage.disabled ? "enable" : "disable"}?id=${
          props.storage.id
        }`
      )
  )
  return (
    <VStack
      w="$full"
      spacing="$2"
      rounded="$lg"
      border="1px solid $neutral7"
      background={useColorModeValue("$neutral2", "$neutral3")()}
      // alignItems="start"
      p="$3"
      _hover={{
        border: `1px solid ${getMainColor()}`,
      }}
    >
      <HStack spacing="$2">
        <Text
          fontWeight="$medium"
          css={{
            wordBreak: "break-all",
          }}
        >
          {props.storage.mount_path}
        </Text>
        <Badge colorScheme="info">
          {t(`drivers.drivers.${props.storage.driver}`)}
        </Badge>
      </HStack>
      <Text css={{ wordBreak: "break-all" }}>
        {t("storages.common.status")}: {props.storage.status}
      </Text>
      <Text css={{ wordBreak: "break-all" }}>{props.storage.remark}</Text>
      <HStack spacing="$2">
        <Button
          onClick={() => {
            to(`/@manage/storages/edit/${props.storage.id}`)
          }}
        >
          {t("global.edit")}
        </Button>
        <Button
          loading={enableOrDisableLoading()}
          colorScheme="warning"
          onClick={async () => {
            const resp = await enableOrDisable()
            handleRespWithNotifySuccess(resp, () => {
              props.refresh()
            })
          }}
        >
          {t(`global.${props.storage.disabled ? "enable" : "disable"}`)}
        </Button>
        <DeletePopover
          name={props.storage.mount_path}
          loading={deleteLoading()}
          onClick={async () => {
            const resp = await deleteStorage()
            handleResp(resp, () => {
              notify.success(t("global.delete_success"))
              props.refresh()
            })
          }}
        />
      </HStack>
    </VStack>
  )
}
