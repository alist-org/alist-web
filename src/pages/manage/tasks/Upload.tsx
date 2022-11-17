import { useManageTitle } from "~/hooks"
import { TypeTasks } from "./Tasks"

const Upload = () => {
  useManageTitle("manage.sidemenu.upload")
  return <TypeTasks type="upload" />
}

export default Upload
