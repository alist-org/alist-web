import { VStack } from "@hope-ui/solid"
import { useManageTitle } from "~/hooks"
import { TypeTasks } from "./Tasks"

const OfflineDownload = () => {
  useManageTitle("manage.sidemenu.offline_download")
  return (
    <VStack w="$full" alignItems="start" spacing="$4">
      <TypeTasks type="offline_download" canRetry />
      <TypeTasks type="offline_download_transfer" canRetry />
    </VStack>
  )
}

export default OfflineDownload
