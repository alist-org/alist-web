import {
  NavigateOptions,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "@solidjs/router"
import { createMemo } from "solid-js"
import { encodePath, joinBase, log, pathDir, pathJoin, trimBase } from "~/utils"

const useRouter = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const params = useParams()
  const pathname = createMemo(() => {
    return trimBase(location.pathname)
  })
  return {
    to: (
      path: string,
      ignore_root?: boolean,
      options?: Partial<NavigateOptions>,
    ) => {
      if (!ignore_root && path.startsWith("/")) {
        path = joinBase(path)
      }
      log("to:", path)
      navigate(path, options)
    },
    replace: (to: string) => {
      navigate(encodePath(pathJoin(pathDir(location.pathname), to), true))
    },
    pushHref: (to: string): string => {
      const href = encodePath(pathJoin(pathname(), to))
      return href
    },
    back: () => {
      navigate(-1)
    },
    forward: () => {
      navigate(1)
    },
    pathname: pathname,
    searchParams: searchParams,
    setSearchParams: setSearchParams,
    params: params,
  }
}

export { useRouter }
