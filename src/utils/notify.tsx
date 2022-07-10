import { notificationService } from "@hope-ui/solid";

const notify = {
  success: (message: string) => {
    notificationService.show({
      status: "success",
      title: message,
    });
  },
  error: (message: string) => {
    notificationService.show({
      status: "danger",
      title: message,
    });
  },
  info: (message: string) => {
    notificationService.show({
      status: "info",
      title: message,
    });
  },
  warning: (message: string) => {
    notificationService.show({
      status: "warning",
      title: message,
    });
  },
};

export { notify };
