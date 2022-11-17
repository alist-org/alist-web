import { Box, Button, notificationService } from "@hope-ui/solid"
import { r, handleResp } from "~/utils"
import { useFetch } from "~/hooks"
import { Meta, PageResp, Storage, SettingItem, User } from "~/types"

const BackupRestore = () => {
  return (
    <Box>
      <Button
        onClick={async () => {
          await backup()
        }}
      >
        Backup
      </Button>
      <Button
        onClick={async () => {
          await restore()
        }}
      >
        Restore
      </Button>
    </Box>
  )
}

function download(filename: string, data: any) {
  const file = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(file)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const backup = async () => {
  const data = {
    setting: [],
    users: [],
    storages: [],
    metas: [],
  }
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const dates = date.getDate()
  const todaysdate = year + "-" + month + "-" + dates
  var all_success = 1

  const [, getSettings] = useFetch(() => r.get("/admin/setting/list"))
  const setSettings = async () => {
    const resp: PageResp<SettingItem> = await getSettings()
    handleResp(resp, () => {
      if (resp.code == 200) {
        notificationService.show({
          title: "Settings Backup Succeeded~",
          description: "Settings Backup Succeeded~",
          status: "success",
        })
        data.setting = resp.data
      } else {
        notificationService.show({
          title: "Settings Backup Failed~",
          description: resp.message,
          status: "danger",
        })
        all_success = 0
      }
    })
  }
  await setSettings()

  const [, getUsers] = useFetch(() => r.get("/admin/user/list"))
  const setUsers = async () => {
    const resp: PageResp<User> = await getUsers()
    handleResp(resp, () => {
      if (resp.code == 200) {
        notificationService.show({
          title: "Users Backup Succeeded~",
          description: "Users Backup Succeeded~",
          status: "success",
        })
        data.users = resp.data.content
      } else {
        notificationService.show({
          title: "Users Backup Failed~",
          description: resp.message,
          status: "danger",
        })
        all_success = 0
      }
    })
  }
  await setUsers()

  const [, getMetas] = useFetch(() => r.get("/admin/meta/list"))
  const setmetas = async () => {
    const resp: PageResp<Meta> = await getMetas()
    handleResp(resp, () => {
      if (resp.code == 200) {
        notificationService.show({
          title: "Metas Backup Succeeded~",
          description: "Metas Backup Succeeded~",
          status: "success",
        })
        data.metas = resp.data.content
      } else {
        notificationService.show({
          title: "Metas Backup Failed~",
          description: resp.message,
          status: "danger",
        })
        all_success = 0
      }
    })
  }
  await setmetas()

  const [, getStorages] = useFetch(() => r.get("/admin/storage/list"))
  const setStorages = async () => {
    const resp: PageResp<Storage> = await getStorages()
    handleResp(resp, () => {
      if (resp.code == 200) {
        notificationService.show({
          title: "Storages Backup Succeeded~",
          description: "Storages Backup Succeeded~",
          status: "success",
        })
        data.storages = resp.data.content
      } else {
        notificationService.show({
          title: "Storages Backup Failed~",
          description: resp.message,
          status: "danger",
        })
        all_success = 0
      }
    })
  }
  await setStorages()

  if (all_success == 1) {
    download("alist_backup_" + todaysdate + ".json", data)
    notificationService.show({
      title: "Backup Downloaded Successfully~",
      description: "Backup Downloaded Successfully~",
      status: "success",
    })
  } else {
    notificationService.show({
      title: "Failed to Backup~",
      description: "Failed to Backup~",
      status: "danger",
    })
  }
}

const restore = async () => {
  var all_success = 1
  var success_all = 1
  const file = document.createElement("input")
  file.type = "file"
  file.accept = "application/json"
  file.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files[0]
    const reader = new FileReader()
    reader.onload = async () => {
      const data = JSON.parse(reader.result as string)

      const [, setSettings] = useFetch(() =>
        r.post("/admin/setting/save", data.setting)
      )
      const setSettings1 = async () => {
        const resp: PageResp<SettingItem> = await setSettings()
        handleResp(resp, () => {
          if (resp.code == 200) {
            notificationService.show({
              title: "Settings Restore Succeeded~",
              description: "Settings Restore Succeeded~",
              status: "success",
            })
          } else {
            notificationService.show({
              title: "Settings Restore Failed~",
              description: resp.message,
              status: "danger",
            })
            all_success = 0
          }
        })
      }
      await setSettings1()

      success_all = 1
      const [, getUsers] = useFetch(() => r.get("/admin/user/list"))
      const restoreusers = async () => {
        const resp: PageResp<User> = await getUsers()
        handleResp(resp, async () => {
          if (resp.code == 200) {
            for (let index in data.users) {
              var method = "add"
              for (let index1 in resp.data.content) {
                if (
                  data.users[index].username ==
                  resp.data.content[index1].username
                ) {
                  method = "save"
                }
              }
              if (method == "save") {
                const [, setUsers] = useFetch(() =>
                  r.post("/admin/user/update", data.users[index])
                )
                const setUsers1 = async () => {
                  const resp: PageResp<User> = await setUsers()
                  handleResp(resp, () => {
                    if (resp.code == 200) {
                    } else {
                      success_all = 0
                    }
                  })
                }
                await setUsers1()
              } else if (
                data.users[index].username == "admin" ||
                data.users[index].username == "guest"
              ) {
              } else {
                const [, setUsers] = useFetch(() =>
                  r.post("/admin/user/create", data.users[index])
                )
                const setUsers1 = async () => {
                  const resp: PageResp<User> = await setUsers()
                  handleResp(resp, () => {
                    if (resp.code == 200) {
                    } else {
                      success_all = 0
                    }
                  })
                }
                await setUsers1()
              }
            }
          } else {
            success_all = 0
          }
        })
      }
      await restoreusers()
      if (success_all == 1) {
        notificationService.show({
          title: "Users Restore Succeeded~",
          description: "Users Restore Succeeded~",
          status: "success",
        })
      } else {
        notificationService.show({
          title: "Users Restore Failed~",
          description: "Users Restore Failed~",
          status: "danger",
        })
        all_success = 0
      }

      success_all = 1
      const [, getMetas] = useFetch(() => r.get("/admin/meta/list"))
      const restoremetas = async () => {
        const resp: PageResp<Meta> = await getMetas()
        handleResp(resp, async () => {
          if (resp.code == 200) {
            for (let index in data.metas) {
              var method = "add"
              for (let index1 in resp.data.content) {
                if (data.metas[index].path == resp.data.content[index1].path) {
                  method = "save"
                }
              }
              if (method == "save") {
                const [, setMetas] = useFetch(() =>
                  r.post("/admin/meta/update", data.metas[index])
                )
                const setMetas1 = async () => {
                  const resp: PageResp<Meta> = await setMetas()
                  handleResp(resp, () => {
                    if (resp.code == 200) {
                    } else {
                      success_all = 0
                    }
                  })
                }
                await setMetas1()
              } else {
                const [, setMetas] = useFetch(() =>
                  r.post("/admin/meta/create", data.metas[index])
                )
                const setMetas1 = async () => {
                  const resp: PageResp<Meta> = await setMetas()
                  handleResp(resp, () => {
                    if (resp.code == 200) {
                    } else {
                      success_all = 0
                    }
                  })
                }
                await setMetas1()
              }
            }
          } else {
            success_all = 0
          }
        })
      }
      await restoremetas()
      if (success_all == 1) {
        notificationService.show({
          title: "Metas Restore Succeeded~",
          description: "Metas Restore Succeeded~",
          status: "success",
        })
      } else {
        notificationService.show({
          title: "Metas Restore Failed~",
          description: "Metas Restore Failed~",
          status: "danger",
        })
        all_success = 0
      }

      success_all = 1
      const [, getStorages] = useFetch(() => r.get("/admin/storage/list"))
      const restorestorages = async () => {
        const resp: PageResp<Storage> = await getStorages()
        handleResp(resp, async () => {
          if (resp.code == 200) {
            for (let index in data.storages) {
              var method = "add"
              for (let index1 in resp.data.content) {
                if (
                  data.storages[index].mount_path ==
                  resp.data.content[index1].mount_path
                ) {
                  method = "save"
                }
              }
              if (method == "save") {
                const [, setStorages] = useFetch(() =>
                  r.post("/admin/storage/update", data.storages[index])
                )
                const setStorages1 = async () => {
                  const resp: PageResp<Storage> = await setStorages()
                  handleResp(resp, () => {
                    if (resp.code == 200) {
                    } else {
                      success_all = 0
                    }
                  })
                }
                await setStorages1()
              } else {
                const [, setStorages] = useFetch(() =>
                  r.post("/admin/storage/create", data.storages[index])
                )
                const setStorages1 = async () => {
                  const resp: PageResp<Storage> = await setStorages()
                  handleResp(resp, () => {
                    if (resp.code == 200) {
                    } else {
                      success_all = 0
                    }
                  })
                }
                await setStorages1()
              }
            }
          } else {
            success_all = 0
          }
        })
      }
      await restorestorages()
      if (success_all == 1) {
        notificationService.show({
          title: "Storages Restore Succeeded~",
          description: "Storages Restore Succeeded~",
          status: "success",
        })
      } else {
        notificationService.show({
          title: "Storages Restore Failed~",
          description: "Storages Restore Failed~",
          status: "danger",
        })
        all_success = 0
      }

      if (all_success == 1) {
        notificationService.show({
          title: "Restore Succeeded~",
          description: "Restore Succeeded~",
          status: "success",
        })
      } else {
        notificationService.show({
          title: "Restore Failed~",
          description: "Restore Failed~",
          status: "danger",
        })
      }
    }
    reader.readAsText(file)
  }
  file.click()
}

export default BackupRestore
