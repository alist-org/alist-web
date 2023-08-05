import {
  Box,
  CloseButton,
  // Alert,
  // AlertDescription,
  // AlertIcon,
  // AlertTitle,
  // CloseButton,
  notificationService,
} from "@hope-ui/solid"
import { JSXElement } from "solid-js"
import { alphaBgColor, firstUpperCase } from "."

const notify = {
  render: (element: JSXElement) => {
    notificationService.show({
      render: (props) => {
        return (
          <Box
            css={{
              display: "flex",
              backdropFilter: "blur(8px)",
              backgroundColor: alphaBgColor(),
              boxShadow: "$md",
              borderRadius: "$lg",
              padding: "$3",
            }}
          >
            <div style={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <div style={{ margin: "auto" }}>{element}</div>
            </div>
            <div style={{ display: "inline-block", padding: "5px" }}>
              <CloseButton
                style={{ float: "right" }}
                right="$2"
                top="$2"
                onClick={props.close}
              />
            </div>
          </Box>
        )
      },
    })
  },
  success: (message: string) => {
    notificationService.show({
      status: "success",
      title: firstUpperCase(message),
      // render: (props) => (
      //   <Alert status="success" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    })
  },
  error: (message: string) => {
    notificationService.show({
      status: "danger",
      title: firstUpperCase(message),
      // render: (props) => (
      //   <Alert status="danger" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    })
  },
  info: (message: string) => {
    notificationService.show({
      status: "info",
      title: firstUpperCase(message),
      // render: (props) => (
      //   <Alert status="info" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    })
  },
  warning: (message: string) => {
    notificationService.show({
      status: "warning",
      title: firstUpperCase(message),
      // render: (props) => (
      //   <Alert status="warning" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    })
  },
}

export { notify }
