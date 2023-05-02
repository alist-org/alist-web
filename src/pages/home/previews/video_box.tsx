import { Flex, VStack, Image, Anchor, Tooltip } from "@hope-ui/solid"
import { For, JSXElement } from "solid-js"
import { useRouter, useLink } from "~/hooks"
import { objStore } from "~/store"
import { ObjType } from "~/types"
import { convertURL } from "~/utils"
import Artplayer from "artplayer"
import { SelectWrapper } from "~/components"

Artplayer.PLAYBACK_RATE = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4]

const players: { icon: string; name: string; scheme: string }[] = [
  { icon: "iina", name: "IINA", scheme: "iina://weblink?url=$durl" },
  { icon: "potplayer", name: "PotPlayer", scheme: "potplayer://$durl" },
  { icon: "vlc", name: "VLC", scheme: "vlc://$durl" },
  { icon: "nplayer", name: "nPlayer", scheme: "nplayer-$durl" },
  {
    icon: "infuse",
    name: "Infuse",
    scheme: "infuse://x-callback-url/play?url=$durl",
  },
  {
    icon: "mxplayer",
    name: "MX Player",
    scheme:
      "intent:$durl#Intent;package=com.mxtech.videoplayer.ad;S.title=$name;end",
  },
  {
    icon: "mxplayer-pro",
    name: "MX Player Pro",
    scheme:
      "intent:$durl#Intent;package=com.mxtech.videoplayer.pro;S.title=$name;end",
  },
]

export const VideoBox = (props: { children: JSXElement }) => {
  const { replace } = useRouter()
  const { currentObjLink } = useLink()
  let videos = objStore.objs.filter((obj) => obj.type === ObjType.VIDEO)
  if (videos.length === 0) {
    videos = [objStore.obj]
  }

  return (
    <VStack w="$full" spacing="$2">
      {props.children}
      <SelectWrapper
        onChange={(name: string) => {
          replace(name)
        }}
        value={objStore.obj.name}
        options={videos.map((obj) => ({ value: obj.name }))}
      />
      <Flex wrap="wrap" gap="$1" justifyContent="center">
        <For each={players}>
          {(item) => {
            return (
              <Tooltip placement="top" withArrow label={item.name}>
                <Anchor
                  // external
                  href={convertURL(item.scheme, {
                    raw_url: objStore.raw_url,
                    name: objStore.obj.name,
                    d_url: currentObjLink(true),
                  })}
                >
                  <Image
                    m="0 auto"
                    boxSize="$8"
                    src={`${window.__dynamic_base__}/images/${item.icon}.webp`}
                  />
                </Anchor>
              </Tooltip>
            )
          }}
        </For>
      </Flex>
    </VStack>
  )
}
