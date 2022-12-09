import { Button, Input } from "@hope-ui/solid"
import { createSignal } from "solid-js"
import { useFetch } from "~/hooks"
import { handleResp, notify, r } from "~/utils"
import { PEmptyResp } from "~/types"
import { useRouter } from "~/hooks"
import { me } from "~/store"

const GithubLogin = () => {
  const [ID, setID] = createSignal("")
  const params = useRouter()
  const callback = params.searchParams["callback-id"]
  const [loading, save] = useFetch(
    (): PEmptyResp =>
      r.post("/me/update_githubsign", {
        githubid: parseInt(ID()),
      })
  )

  const saveconfig = async () => {
    const saveresult = await save()
    handleResp(saveresult, () => {
      if (saveresult.code == 200) {
        notify.success("Github ID saved")
      } else {
        notify.error(saveresult.message)
      }
    })
  }

  if (callback != undefined && callback != "") {
    setID(params.searchParams["callback-id"])
    saveconfig()
  } else {
    setID(me().github_id)
  }

  return (
    <>
      <Input
        maxW="$xs"
        placeholder="Github ID"
        value={ID()}
        onInput={(e) => setID(e.currentTarget.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            saveconfig()
          }
        }}
      />
      <Button
        loading={loading()}
        colorScheme="accent"
        onClick={async () => {
          const saveresult = await save()
          handleResp(saveresult, () => {
            if (saveresult.code == 200) {
              notify.success("Github ID saved")
            } else {
              notify.error(saveresult.message)
            }
          })
        }}
      >
        Save
      </Button>
      <Button
        loading={loading()}
        colorScheme="accent"
        onClick={() => {
          window.location.href =
            r.getUri() +
            "/auth/github?callback_url=" +
            window.location.href +
            "&method=get_github_id"
        }}
      >
        Get Github ID
      </Button>
    </>
  )
}

export default GithubLogin
