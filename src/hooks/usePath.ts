import {
  appendObjs,
  getSettingNumber,
  password,
  ObjStore,
  State,
} from "~/store";
import {
  fsGet,
  fsList,
  handleRrespWithoutNotify,
  log,
  notify,
  pathJoin,
} from "~/utils";
import { useFetch } from "./useFetch";
import { useRouter } from "./useRouter";

const IsDirRecord: Record<string, boolean> = {};

export const usePath = () => {
  const { pathname, setSearchParams } = useRouter();
  const [, getObj] = useFetch((path?: string) => fsGet(path, password()));
  const [, getObjs] = useFetch(
    (arg?: { path: string; index?: number; size?: number }) => {
      const page = {
        index: arg?.index ?? 1,
        size: arg?.size ?? getSettingNumber("page_size") ?? 50,
      };
      // setSearchParams(page);
      return fsList(arg?.path, password(), page.index, page.size);
    }
  );
  // set a path must be a dir
  const setPathAsDir = (path: string, push = false) => {
    if (push) {
      path = pathJoin(pathname(), path);
    }
    log(`set [${path}] as dir`);
    IsDirRecord[path] = true;
  };

  // record is second time password is wrong
  let retry_pass = false;
  // handle pathname change
  // if confirm current path is dir, fetch List directly
  // if not, fetch get then determine if it is dir or file
  const handlePathChange = (path: string, rp?: boolean) => {
    log(`handle [${path}] change`);
    retry_pass = rp ?? false;
    handleErr("");
    if (IsDirRecord[path]) {
      handleFolder(path, 1);
    } else {
      handleObj(path);
    }
  };

  // handle enter obj that don't know if it is dir or file
  const handleObj = async (path: string) => {
    ObjStore.setState(State.FetchingObj);
    const resp = await getObj(path);
    handleRrespWithoutNotify(
      resp,
      (data) => {
        ObjStore.setObj(data);
        ObjStore.setProvider(data.provider);
        if (data.is_dir) {
          handleFolder(path, 1);
        } else {
          ObjStore.setReadme(data.readme);
          ObjStore.setRelated(data.related);
          ObjStore.setRawUrl(data.raw_url);
          ObjStore.setState(State.File);
        }
      },
      handleErr
    );
  };

  // change enter a folder or turn page or load more
  const handleFolder = async (
    path: string,
    index?: number,
    size?: number,
    append = false
  ) => {
    ObjStore.setState(append ? State.FetchingMore : State.FetchingObjs);
    const resp = await getObjs({ path, index, size });
    handleRrespWithoutNotify(
      resp,
      (data) => {
        if (append) {
          appendObjs(data.content);
        } else {
          ObjStore.setObjs(data.content);
        }
        ObjStore.setReadme(data.readme);
        ObjStore.setWrite(data.write);
        ObjStore.setState(State.Folder);
      },
      handleErr
    );
  };

  const handleErr = (msg: string, code?: number) => {
    if (code === 403) {
      ObjStore.setState(State.NeedPassword);
      if (retry_pass) {
        notify.error(msg);
      }
    } else {
      ObjStore.setErr(msg);
    }
  };

  return {
    handlePathChange,
    setPathAsDir,
    refresh: (retry_pass?: boolean) => {
      handlePathChange(pathname(), retry_pass);
    },
  };
};
