import { produce } from "solid-js/store";
import {
  getSetting,
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
  const { pathname, to, searchParams, setSearchParams } = useRouter();
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
      page_index: parseInt(searchParams.index) ?? 1,
      page_size: parseInt(searchParams.size) ?? getSetting("page_size") ?? 50,
    })
  );

  const handlePath = async (
    path: string,
    router = false,
    link = true,
    append = false
  ) => {
    if (router) {
      to(encodePath(path), false, { replace: link });
    }
    setState(append ? State.FetchingMore : State.FetchingObjs);
    const resp: Resp<Obj[]> = await getObjs(path);
    handleRresp(
      resp,
      (objs) => {
        if (append) {
          setObjStore(
            "objs",
            produce((prev) => prev.push(...objs))
          );
        } else {
          setObjStore("objs", objs);
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
  const turnPage = (pageIndex: number) => {
    setSearchParams({ index: pageIndex.toString() });
    handlePath(pathname(), false);
  };
  const loadMore = () => {
    setSearchParams({ index: (parseInt(searchParams.index) + 1).toString() });
    handlePath(pathname(), false, false, true);
  };
  return {
    init: refreshObj,
    enterObj,
    enterDir,
    turnPage,
    loadMore,
  };
};
