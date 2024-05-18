import { BoxWithFullScreen } from "~/components"
import { objStore } from "~/store"
import { Icon, hope } from "@hope-ui/solid"
import { convertURL, hoverColor } from "~/utils"
import { Component, createMemo } from "solid-js"
import { useLink } from "~/hooks"
import { TbExternalLink } from "solid-icons/tb"

const IframePreview = (props: { scheme: string }) => {
  const { currentObjLink } = useLink()
  const iframeSrc = createMemo(() => {
    return convertURL(props.scheme, {
      raw_url: objStore.raw_url,
      name: objStore.obj.name,
      d_url: currentObjLink(true),
      ts: true,
    })
  })
  return (
    <BoxWithFullScreen w="$full" h="70vh">
      <hope.iframe w="$full" h="$full" src={iframeSrc()} />
      <Icon
        pos="absolute"
        right="$2"
        bottom="$10"
        aria-label="Open in new tab"
        as={TbExternalLink}
        onClick={() => {
          window.open(iframeSrc(), "_blank")
        }}
        cursor="pointer"
        rounded="$md"
        bgColor={hoverColor()}
        p="$1"
        boxSize="$7"
      />
    </BoxWithFullScreen>
  )
}

export const generateIframePreview = (scheme: string): Component => {
  return () => {
    return <IframePreview scheme={scheme} />
  }
}
