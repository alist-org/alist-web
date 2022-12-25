import { BoxWithFullScreen } from "~/components"
import { objStore } from "~/store"
import { hope } from "@hope-ui/solid"
import { convertURL } from "~/utils"
import { Component } from "solid-js"
import { useLink } from "~/hooks"

const IframePreview = (props: { scheme: string }) => {
  const { currentObjLink } = useLink()
  return (
    <BoxWithFullScreen w="$full" h="70vh">
      <hope.iframe
        w="$full"
        h="$full"
        src={convertURL(props.scheme, {
          raw_url: objStore.raw_url,
          name: objStore.obj.name,
          d_url: currentObjLink(true),
        })}
      />
    </BoxWithFullScreen>
  )
}

export const generateIframePreview = (scheme: string): Component => {
  return () => {
    return <IframePreview scheme={scheme} />
  }
}
