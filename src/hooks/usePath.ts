import {
  appendObjs,
  getSettingNumber,
  password,
  setErr,
  setObjStore,
  setState,
  State,
} from "~/store";
import { Obj, PageResp, Resp } from "~/types";
import { handleRresp, pathJoin, r } from "~/utils";
import { useFetch } from "./useFetch";
import { useRouter } from "./useRouter";

const IsDirRecord: Record<string, boolean> = {};

export const usePath = () => {
  const { pathname, setSearchParams } = useRouter();
  const [, getObj] = useFetch(() =>
    r.post("/fs/get", {
      path: pathname(),
      password: password(),
    })
  );
  const [, getObjs] = useFetch(
    (arg?: { path: string; index?: number; size?: number }) => {
      const page = {
        index: arg?.index ?? 1,
        size: arg?.size ?? getSettingNumber("page_size") ?? 50,
      };
      // setSearchParams(page);
      return r.post("/fs/list", {
        path: arg?.path,
        password: password(),
        page_index: page.index,
        page_size: page.size,
      });
    }
  );
  // set a path must be a dir
  const setPathAsDir = (path: string, push = false) => {
    if (push) {
      path = pathJoin(pathname(), path);
    }
    console.log(`set [${path}] as dir`);
    IsDirRecord[path] = true;
  };

  // handle pathname change
  // if confirm current path is dir, fetch List directly
  // if not, fetch get then determine if it is dir or file
  const handlePathChange = (path: string) => {
    console.log(`handle [${path}] change`);
    if (IsDirRecord[path]) {
      handleFolder(path, 1);
    } else {
      handleObj(path);
    }
  };

  // handle enter obj that don't know if it is dir or file
  const handleObj = async (path: string) => {
    setState(State.FetchingObj);
    const resp: Resp<Obj> = await getObj();
    handleRresp(
      resp,
      (obj: Obj) => {
        setObjStore("obj", obj);
        if (obj.is_dir) {
          handleFolder(path, 1);
        } else {
          setState(State.File);
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
    setState(append ? State.FetchingMore : State.FetchingObjs);
    const resp: PageResp<Obj> = await getObjs({ path, index, size });
    handleRresp(
      resp,
      (data) => {
        if (append) {
          appendObjs(data.content);
        } else {
          setObjStore("objs", data.content);
        }
        setState(State.Folder);
      },
      handleErr
    );
  };

  const handleErr = (msg: string, code: number) => {
    setErr(msg);
    if (code === 403) {
      setState(State.NeedPassword);
    }
  };

  return {
    handlePathChange,
    setPathAsDir,
  };
};
