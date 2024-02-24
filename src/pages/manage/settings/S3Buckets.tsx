import { VStack, Button, FormLabel } from "@hope-ui/solid"
import { For } from "solid-js"
import { SetStoreFunction } from "solid-js/store"
import { SettingItem } from "~/types"
import { S3BucketItem, S3Bucket } from "./S3BucketItem"
import { useT } from "~/hooks"

export type S3BucketsProps = {
  buckets: S3Bucket[]
  setSettings: SetStoreFunction<SettingItem[]>
}

const S3Buckets = (props: S3BucketsProps) => {
  const t = useT()
  console.log(props.buckets)
  return (
    <VStack alignItems="start" w="$full">
      <FormLabel display="flex" alignItems="center">
        {t("settings.s3_buckets")}
      </FormLabel>
      <Button
        onClick={() => {
          props.setSettings(
            (i) => i.key === "s3_buckets",
            "value",
            JSON.stringify([...props.buckets, { name: "", path: "" }]),
          )
          console.log(props.buckets)
        }}
      >
        {t("global.add")}
      </Button>
      <For each={props.buckets}>
        {(item) => (
          <S3BucketItem
            {...item}
            onChange={(val) => {
              console.log(val)
              props.setSettings(
                (i) => i.key === "s3_buckets",
                "value",
                JSON.stringify(
                  props.buckets.map((b) => (b.name === item.name ? val : b)),
                ),
              )
            }}
            onDelete={() => {
              props.setSettings(
                (i) => i.key === "s3_buckets",
                "value",
                JSON.stringify(
                  props.buckets.filter((b) => b.name !== item.name),
                ),
              )
            }}
          />
        )}
      </For>
    </VStack>
  )
}

export default S3Buckets
