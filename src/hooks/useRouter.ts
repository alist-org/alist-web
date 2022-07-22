import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "solid-app-router";
import { createMemo } from "solid-js";
import { joinRoot, log, pathJoin, trimRoot } from "~/utils";

const useRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  return {
    to: (path: string, ignore_root?: boolean) => {
      if (!ignore_root && path.startsWith("/")) {
        path = joinRoot(path);
      }
      log("to:", path);
      navigate(path);
    },
    push: (path: string) => {
      if (path.startsWith("/")) {
        path = joinRoot(path);
      }
      navigate(pathJoin(location.pathname, path));
    },
    back: () => {
      navigate(-1);
    },
    forward: () => {
      navigate(1);
    },
    pathname: createMemo(() => {
      return trimRoot(location.pathname);
    }),
    searchParams,
    setSearchParams,
    params,
  };
};

export { useRouter };
