import { VStack } from "@hope-ui/solid"
import { useManageTitle } from "~/hooks"
import { TypeTasks } from "./Tasks"

const Qbit = () => {
  useManageTitle("manage.sidemenu.qbit")
  return (
    <VStack w="$full" alignItems="start" spacing="$4">
      <TypeTasks type="qbit_down" canRetry />
      <TypeTasks type="qbit_transfer" />
    </VStack>
  )
}

export default Qbit
