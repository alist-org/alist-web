import { Resp } from "~/types";
import { bus, notify } from ".";

export const handleRresp = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code: number) => void,
  auth: boolean = true,
  notify_error: boolean = true,
  notify_success?: boolean
) => {
  if (resp.code === 200) {
    notify_success && notify.success(resp.message);
    success?.(resp.data);
  } else {
    notify_error && notify.error(resp.message);
    if (auth && resp.code === 401) {
      bus.emit(
        "to",
        `/@login?redirect=${encodeURIComponent(location.pathname)}`
      );
      return;
    }
    fail?.(resp.message, resp.code);
  }
};

export const handleRrespWithoutAuth = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
  notify_error: boolean = true
) => {
  return handleRresp(resp, success, fail, false, notify_error);
};

export const handleRrespWithoutNotify = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
  auth: boolean = true
) => {
  return handleRresp(resp, success, fail, auth, false);
};

export const handleRrespWithoutAuthAndNotify = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void
) => {
  return handleRresp(resp, success, fail, false, false);
};

export const handleRrespWithNotifySuccess = <T>(
  resp: Resp<T>,
  success?: (data: T) => void,
  fail?: (message: string, code?: number) => void,
  auth: boolean = true,
  notify_error: boolean = true
) => {
  return handleRresp(resp, success, fail, auth, notify_error, true);
};
