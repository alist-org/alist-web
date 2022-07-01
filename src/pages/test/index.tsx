import { Center, Heading } from "@hope-ui/solid"
import { useI18n } from "@solid-primitives/i18n";

const Index = () => {
  const [t] = useI18n()
  return <Center h="100vh">
    <Heading>{t("test.hello")}</Heading>
  </Center>
}

export default Index;