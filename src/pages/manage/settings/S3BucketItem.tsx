import { Button, FormControl, FormLabel, Input, Stack } from "@hope-ui/solid"
import { FolderChooseInput } from "~/components"
import { useT } from "~/hooks"

export type S3Bucket = {
  name: string
  path: string
}

type props = S3Bucket & {
  onChange: (val: S3Bucket) => void
  onDelete: () => void
}

export const S3BucketItem = (props: props) => {
  const t = useT()
  return (
    <Stack
      w="$full"
      overflowX="auto"
      shadow="$md"
      rounded="$lg"
      p="$2"
      direction={{ "@initial": "column", "@xl": "row" }}
      spacing="$2"
    >
      <FormControl w="$full" display="flex" flexDirection="column" required>
        <FormLabel for="path" display="flex" alignItems="center">
          {t(`global.name`)}
        </FormLabel>
        <Input
          id="name"
          value={props.name}
          onChange={(e) =>
            props.onChange({ ...props, name: e.currentTarget.value })
          }
        />
      </FormControl>

      <FormControl w="$full" display="flex" flexDirection="column" required>
        <FormLabel for="path" display="flex" alignItems="center">
          {t(`metas.path`)}
        </FormLabel>
        <FolderChooseInput
          id="path"
          value={props.path}
          onChange={(e) => props.onChange({ ...props, path: e })}
        />
      </FormControl>

      <Stack
        direction={{ "@initial": "row", "@xl": "column" }}
        justifyContent={{ "@xl": "center" }}
        spacing="$1"
      >
        <Button
          colorScheme="danger"
          onClick={async () => {
            props.onDelete()
          }}
        >
          {t("global.delete")}
        </Button>
      </Stack>
    </Stack>
  )
}
