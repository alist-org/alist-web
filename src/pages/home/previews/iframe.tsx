import { BoxWithFullScreen } from "~/components"
import { objStore } from "~/store"
import { hope } from "@hope-ui/solid"
import { convertURL } from "~/utils"
import { Component } from "solid-js"

const IframePreview = (props: { scheme: string }) => {
  return (
    <BoxWithFullScreen w="$full" h="70vh">
      <hope.iframe
        w="$full"
        h="$full"
        src={convertURL(props.scheme, objStore.raw_url, objStore.obj.name)}
      />
    </BoxWithFullScreen>
  )
}

export const generateIframePreview = (scheme: string): Component => {
  return () => {
    return <IframePreview scheme={scheme} />
  }
}
