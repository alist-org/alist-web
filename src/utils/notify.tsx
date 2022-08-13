import {
  Box,
  // Alert,
  // AlertDescription,
  // AlertIcon,
  // AlertTitle,
  // CloseButton,
  notificationService,
} from "@hope-ui/solid";
import { JSXElement } from "solid-js";
import { alphaBgColor } from ".";

const notify = {
  render: (element: JSXElement) => {
    notificationService.show({
      render: (props) => {
        return (
          <Box
            class="notify-render"
            css={{
              backdropFilter: "blur(8px)",
            }}
            bgColor={alphaBgColor()}
            shadow="$md"
            rounded="$lg"
            p="$3"
          >
            {element}
          </Box>
        );
      },
    });
  },
  success: (message: string) => {
    notificationService.show({
      status: "success",
      title: message,
      // render: (props) => (
      //   <Alert status="success" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    });
  },
  error: (message: string) => {
    notificationService.show({
      status: "danger",
      title: message,
      // render: (props) => (
      //   <Alert status="danger" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    });
  },
  info: (message: string) => {
    notificationService.show({
      status: "info",
      title: message,
      // render: (props) => (
      //   <Alert status="info" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    });
  },
  warning: (message: string) => {
    notificationService.show({
      status: "warning",
      title: message,
      // render: (props) => (
      //   <Alert status="warning" shadow="$md">
      //     <AlertIcon mr="$2_5" />
      //     <AlertDescription mr="$2_5">{message}</AlertDescription>
      //     <CloseButton size="sm" onClick={props.close} />
      //   </Alert>
      // ),
    });
  },
};

export { notify };
