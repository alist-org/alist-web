import { base_path } from "."

export const standardizePath = (path: string, noRootSlash?: boolean) => {
  if (path.endsWith("/")) {
    path = path.slice(0, -1)
  }
  if (!path.startsWith("/")) {
    path = "/" + path
  }
  if (noRootSlash && path === "/") {
    return ""
  }
  return path
}

export const pathJoin = (...paths: string[]) => {
  return paths.join("/").replace(/\/{2,}/g, "/")
}

export const joinBase = (...paths: string[]) => {
  return pathJoin(base_path, ...paths)
}

export const trimBase = (path: string) => {
  const res = path.replace(base_path, "")
  if (res.startsWith("/")) {
    return res
  }
  return "/" + res
}

export const pathBase = (path: string) => {
  return path.split("/").pop()
}

export const pathDir = (path: string) => {
  return path.split("/").slice(0, -1).join("/")
}

export const encodePath = (path: string, all?: boolean) => {
  return path
    .split("/")
    .map((p) =>
      all
        ? encodeURIComponent(p)
        : p
            .replace(/%/g, "%25")
            .replace(/\?/g, "%3F")
            .replace(/#/g, "%23")
            .replace(/ /g, "%20"),
    )
    .join("/")
}

export const ext = (path: string): string => {
  return path.split(".").pop() ?? ""
}

export const baseName = (fullName: string) => {
  return fullName.split(".").slice(0, -1).join(".")
}

export function createMatcher(path: string) {
  const segments = path.split("/").filter(Boolean)
  const len = segments.length

  return (location: string) => {
    const locSegments = location.split("/").filter(Boolean)
    const lenDiff = locSegments.length - len
    if (lenDiff < 0) return null

    let matchPath = len ? "" : "/"

    for (let i = 0; i < len; i++) {
      const segment = segments[i]
      const locSegment = locSegments[i]

      if (
        segment.localeCompare(locSegment, undefined, {
          sensitivity: "base",
        }) !== 0
      ) {
        return null
      }
      matchPath += `/${locSegment}`
    }

    return matchPath
  }
}
