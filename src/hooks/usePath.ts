import {
  objStore,
  password,
  setErr,
  setObjStore,
  setState,
  State,
} from "~/store";
import { Obj, Resp } from "~/types";
import { encodePath, handleRresp, pathJoin, r } from "~/utils";
import { useFetch } from "./useFetch";
import { useRouter } from "./useRouter";

export const usePath = () => {
  const { pathname, to } = useRouter();
  const [, getObj] = useFetch(() =>
    r.post("/fs/get", {
      path: pathname(),
      password: password(),
    })
  );
  const [, getObjs] = useFetch((path?: string) =>
    r.post("/fs/list", {
      path: path,
      password: password(),
      page_index: objStore.pageIndex,
      page_size: objStore.pageSize,
    })
  );

  const handlePath = async (path: string, router = false, link = true) => {
    if (router) {
      to(encodePath(path), false, { replace: link });
    }
    setState(State.FetchingObjs);
    const resp: Resp<Obj[]> = await getObjs(path);
    handleRresp(
      resp,
      (objs) => {
        setObjStore("objs", objs);
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

  // reget obj and handle it
  const refreshObj = async () => {
    setState(State.FetchingObj);
    const resp: Resp<Obj> = await getObj();
    handleRresp(
      resp,
      (obj: Obj) => {
        setObjStore("obj", obj);
        if (obj.is_dir) {
          handlePath(pathname(), false);
        } else {
          setState(State.File);
        }
      },
      handleErr
    );
  };

  // enter obj from obj list
  const enterObj = (obj: Obj, link = true) => {
    to(encodePath(pathJoin(pathname(), obj.name)), false, { replace: link });
    if (obj.is_dir) {
      setObjStore("obj", obj);
      handlePath(pathname(), false);
    } else {
      refreshObj();
    }
  };
  // enter path that must be a folder
  const enterDir = (path: string, link = true) => {
    handlePath(path, true);
  };
  return {
    init: refreshObj,
    enterObj,
    enterDir,
  };
};
