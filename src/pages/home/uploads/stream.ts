import { password } from "~/store"
import { EmptyResp } from "~/types"
import { r } from "~/utils"
import { SetUpload, Upload } from "./types"
export const StreamUpload: Upload = async (
  uploadPath: string,
  file: File,
  setUpload: SetUpload,
  asTask = false,
): Promise<Error | undefined> => {
  let oldTimestamp = new Date().valueOf()
  let oldLoaded = 0
  const resp: EmptyResp = await r.put("/fs/put", file, {
    headers: {
      "File-Path": encodeURIComponent(uploadPath),
      "As-Task": asTask,
      "Content-Type": file.type || "application/octet-stream",
      Password: password(),
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const complete =
          ((progressEvent.loaded / progressEvent.total) * 100) | 0
        setUpload("progress", complete)

        const timestamp = new Date().valueOf()
        const duration = (timestamp - oldTimestamp) / 1000
        if (duration > 1) {
          const loaded = progressEvent.loaded - oldLoaded
          const speed = loaded / duration
          const remain = progressEvent.total - progressEvent.loaded
          const remainTime = remain / speed
          setUpload("speed", speed)
          console.log(remainTime)

          oldTimestamp = timestamp
          oldLoaded = progressEvent.loaded
        }

        if (complete === 100) {
          setUpload("status", "backending")
        }
      }
    },
  })
  if (resp.code === 200) {
    return
  } else {
    return new Error(resp.message)
  }
}
