import { Button } from "@hope-ui/solid";
import { useT } from "~/hooks";
import { objStore } from "~/store";
import { IconName } from "./icon-name";

const Download = () => {
  const t = useT();
  return (
    <IconName>
      <Button as="a" href={objStore.raw_url} target="_blank">
        {t("home.preview.download")}
      </Button>
    </IconName>
  );
};

export default Download;
