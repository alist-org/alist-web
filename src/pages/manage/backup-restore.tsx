import { Box, Button, notificationService, HopeProvider, NotificationsProvider } from "@hope-ui/solid";
import {r} from "~/utils";

const BackupRestore = () => {
  return (
    <Box>
      <Button
        onClick={async () => {
          const resp = await backup();
        }}
      >
        Backup
      </Button>
      <Button
        onClick={async () => {
          const resp = await restore();
        }}
      >
        Restore
      </Button>
      </Box>
  )
        
};

function download(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data,null,2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const backup = async() => {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var dates = date.getDate();

  const todaysdate = year + "-" + month + "-" + dates;
  const data = r.get("/admin/setting/list");
  if ((await data).code == 200)
  {
    download("alist_backup_" + todaysdate + ".json", (await data).data);
    notificationService.show({
      title: "Backup Succeeded~",
      description: "Backup Succeeded~",
      status: "success",
    })
  }
  else
  {
    notificationService.show({
      title: "Backup Failed~",
      description: data.message,
      status: "danger",
    })
  }
  
}

const restore = async() => {
  const file = document.createElement("input");
  file.type = "file";
  file.accept = "application/json";
  file.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = JSON.parse(e.target.result as string);
      const resp = await r.post("/admin/setting/save", data);
      console.log(resp);
      if (resp.code == 200)
      {
        notificationService.show({
          title: "Restore Succeeded~",
          description: "Restore Succeeded~",
          status: "success",
        })
      }
      else
      {
        notificationService.show({
          title: "Restore Failed~",
          description: resp.message,
          status: "danger",
        })
      }
    };
    reader.readAsText(file);
  };
  file.click();
}

export default BackupRestore;