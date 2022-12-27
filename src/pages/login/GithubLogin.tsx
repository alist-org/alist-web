import { Icon } from "@hope-ui/solid"
import { FiGithub } from "solid-icons/fi"
import { base_path, changeToken, r } from "~/utils"
import { getSettingBool } from "~/store"
import { useRouter } from "~/hooks"

const GithubLogin = () => {
  const githubSignEnabled = getSettingBool("github_login_enabled")
  const { searchParams, to } = useRouter()
  const token = searchParams["token"]
  if (token != undefined && token != "") {
    changeToken(token)
    to(decodeURIComponent(searchParams.redirect || base_path || "/"), true)
  }
  if (githubSignEnabled) {
    return (
      <Icon
        cursor="pointer"
        boxSize="$8"
        as={FiGithub}
        p="$0_5"
        onclick={() => {
          window.location.href =
            r.getUri() +
            "/auth/github?callback_url=" +
            window.location.href +
            "&method=github_login&with_params=" +
            Boolean(searchParams["redirect"] != undefined)
        }}
      />
    )
  }
}

export { GithubLogin }
