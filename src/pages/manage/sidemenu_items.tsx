import { SideMenuItemProps } from "./SideMenu";
import {
  BsGearFill,
  BsPaletteFill,
  BsCameraFill,
  BsWindow,
  BsPersonCircle,
  BsJoystick,
  BsMedium,
  BsFingerprint,
  BsFront,
  BsCloudArrowDownFill,
  BsCloudUploadFill,
} from "solid-icons/bs";
import { SiMetabase } from "solid-icons/si";
import { CgDatabase } from "solid-icons/cg";
import { OcWorkflow2 } from "solid-icons/oc";
import { IoCopy, IoHome } from "solid-icons/io";
import { Component, lazy } from "solid-js";
import { Group, UserRole } from "~/types";
import { FaSolidDatabase } from 'solid-icons/fa'

export type SideMenuItem = SideMenuItemProps & {
  component?: Component;
  children?: SideMenuItem[];
};

const CommonSettings = lazy(() => import("./settings/Common"));

export const side_menu_items: SideMenuItem[] = [
  // {
  //   title: "manage.sidemenu.dashboard",
  //   icon: BiSolidDashboard,
  //   to: "/@manage",
  //   component: lazy(() => import("./Dashboard")),
  // },
  {
    title: "manage.sidemenu.profile",
    icon: BsFingerprint,
    to: "/@manage",
    role: UserRole.GUEST,
    component: lazy(() => import("./users/Profile")),
  },
  {
    title: "manage.sidemenu.settings",
    icon: BsGearFill,
    to: "/@manage/settings",
    children: [
      {
        title: "manage.sidemenu.site",
        icon: BsWindow,
        to: "/@manage/settings/site",
        component: () => <CommonSettings group={Group.SITE} />,
      },
      {
        title: "manage.sidemenu.style",
        icon: BsPaletteFill,
        to: "/@manage/settings/style",
        component: () => <CommonSettings group={Group.STYLE} />,
      },
      {
        title: "manage.sidemenu.preview",
        icon: BsCameraFill,
        to: "/@manage/settings/preview",
        component: () => <CommonSettings group={Group.PREVIEW} />,
      },
      {
        title: "manage.sidemenu.global",
        icon: BsJoystick,
        to: "/@manage/settings/global",
        component: () => <CommonSettings group={Group.GLOBAL} />,
      },
      {
        title: "manage.sidemenu.other",
        icon: BsMedium,
        to: "/@manage/settings/other",
        component: lazy(() => import("./settings/Other")),
      },
    ],
  },
  {
    title: "manage.sidemenu.tasks",
    icon: OcWorkflow2,
    to: "/@manage/tasks",
    children: [
      {
        title: "manage.sidemenu.aria2",
        icon: BsCloudArrowDownFill,
        to: "/@manage/tasks/aria2",
        component: lazy(() => import("./tasks/Aria2")),
      },
      {
        title: "manage.sidemenu.upload",
        icon: BsCloudUploadFill,
        to: "/@manage/tasks/upload",
        component: lazy(() => import("./tasks/Upload")),
      },
      {
        title: "manage.sidemenu.copy",
        icon: IoCopy,
        to: "/@manage/tasks/copy",
        component: lazy(() => import("./tasks/Copy")),
      },
    ],
  },
  {
    title: "manage.sidemenu.users",
    icon: BsPersonCircle,
    to: "/@manage/users",
    component: lazy(() => import("./users/Users")),
  },
  {
    title: "manage.sidemenu.storages",
    icon: CgDatabase,
    to: "/@manage/storages",
    component: lazy(() => import("./storages/Storages")),
  },
  {
    title: "manage.sidemenu.metas",
    icon: SiMetabase,
    to: "/@manage/metas",
    component: lazy(() => import("./metas/Metas")),
  },
  {
    title: "manage.sidemenu.backup-restore",
    to: "/@manage/backup-restore",
    icon: FaSolidDatabase,
    component: lazy(() => import("./backup-restore")),
  },
  {
    title: "manage.sidemenu.about",
    icon: BsFront,
    to: "/@manage/about",
    role: UserRole.GUEST,
    component: lazy(() => import("./About")),
  },
  {
    title: "manage.sidemenu.home",
    icon: IoHome,
    to: "/",
    role: UserRole.GUEST,
    external: true,
  }
];
