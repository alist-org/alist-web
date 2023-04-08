import { useManageTitle } from "~/hooks"
import { TypeTasks } from "./Tasks"

const Copy = () => {
  useManageTitle("manage.sidemenu.copy")
  return <TypeTasks type="copy" canRetry />
}

export default Copy
