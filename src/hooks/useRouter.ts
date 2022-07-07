import { useLocation, useNavigate } from "solid-app-router";
import { createMemo } from "solid-js";
import { joinRoot, pathJoin, trimRoot } from "~/utils/path_join";

const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return {
    to: (path: string) => {
      console.log("to:", path);
      if (path.startsWith("/")) {
        path = joinRoot(path);
      }
      navigate(path);
    },
    push: (path: string) => {
      if (path.startsWith("/")) {
        path = joinRoot(path);
      }
      navigate(pathJoin(location.pathname, path));
    },
    pathname: createMemo(() => {
      return trimRoot(location.pathname);
    }),
  };
};

export { useRouter };
