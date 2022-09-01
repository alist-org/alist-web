import { getHideFiles, objStore } from "~/store";
import { pathJoin } from "~/utils";
import { useRouter } from ".";

export const useObjs = () => {
  const { pathname } = useRouter();
  const objsAfterHide = () => {
    const hideFiles = getHideFiles();
    return objStore.objs.filter((obj) => {
      for (const reg of hideFiles) {
        if (reg.test(pathJoin(pathname(), obj.name))) {
          return false;
        }
      }
      return true;
    });
  };
  return { objsAfterHide };
};
