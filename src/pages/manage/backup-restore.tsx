import { Box, Button, notificationService } from "@hope-ui/solid";
import {r, handleResp} from "~/utils";
import { useFetch} from "~/hooks";
import { Meta, PageResp , Storage, SettingItem, User, EmptyResp} from "~/types";

const BackupRestore = () => {
  return (
    <Box>
      <Button
        onClick={async () => {
          await backup();
        }}
      >
        Backup
      </Button>
      <Button
        onClick={async () => {
          await restore();
        }}
      >
        Restore
      </Button>
      </Box>
  )
        
};


function download(filename: string, data: any) {
  console.log(data)
  console.log(JSON.stringify(data, null, 2))
  const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const backup = async() => {
  const data = {
    "setting": [],
    "users": [],
    "storages": [],
    "metas": [],
  }
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dates = date.getDate();
  const todaysdate = year + "-" + month + "-" + dates;
  let all_success = 1

  const [, getSettings] = useFetch(() => r.get("/admin/setting/list"));
  const setSettings = async () => {
    const resp: PageResp<SettingItem> = await getSettings();
    handleResp(resp, () => {
      if (resp.code == 200)
      {
        notificationService.show({
          title: "Settings Backup Succeeded~",
          description: "Settings Backup Succeeded~",
          status: "success",
        })
        data.setting = resp.data
      }
      else
      {
        notificationService.show({
          title: "Settings Backup Failed~",
          description: resp.message,
          status: "danger",
        })
        all_success = 0
      }
    });
  };
  setSettings();

  const [, getUsers] = useFetch(() => r.get("/admin/user/list"));
  const setUsers = async () => {
    const resp: PageResp<User> = await getUsers();
    handleResp(resp, () => {
      if (resp.code == 200)
      {
        notificationService.show({
          title: "Users Backup Succeeded~",
          description: "Users Backup Succeeded~",
          status: "success",
        })
        data.users = resp.data
      }
      else
      {
        notificationService.show({
          title: "Users Backup Failed~",
          description: resp.message,
          status: "danger",
        })
        all_success = 0
      }
    });
  };
  setUsers();

  const [, getMetas] = useFetch(() => r.get("/admin/meta/list"));
  const setmetas = async () => {
    const resp: PageResp<Meta> = await getMetas();
    handleResp(resp, () => {
      console.log(resp)
      if (resp.code == 200)
      {
        notificationService.show({
          title: "Metas Backup Succeeded~",
          description: "Metas Backup Succeeded~",
          status: "success",
        })
        data.metas = resp.data
      }
      else
      {
        notificationService.show({
          title: "Metas Backup Failed~",
          description: resp.message,
          status: "danger",
        })
        all_success = 0
      }
    });
  };
  setmetas();

  const [, getStorages] = useFetch(() => r.get("/admin/storage/list"));
  const setStorages = async () => {
    const resp: PageResp<Storage> = await getStorages();
    handleResp(resp, () => {
      if (resp.code == 200)
      {
        notificationService.show({
          title: "Storages Backup Succeeded~",
          description: "Storages Backup Succeeded~",
          status: "success",
        })
        data.storages = resp.data
      }
      else
      {
        notificationService.show({
          title: "Storages Backup Failed~",
          description: resp.message,
          status: "danger",
        })
        all_success = 0
      }
    });
  };
  setStorages();


if (all_success == 1) {
    download("alist_backup_" + todaysdate + ".json", data);
    notificationService.show({
      title: "Backup Downloaded Successfully~",
      description: "Backup Downloaded Successfully~",
      status: "success",
    })
  }
else {
    notificationService.show({
      title: "Failed to Backup~",
      description: "Failed to Backup~",
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