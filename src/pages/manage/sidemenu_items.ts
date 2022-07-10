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
import { FaSolidTasks } from "solid-icons/fa";
import { IoCopy } from "solid-icons/io";
import { BiSolidDashboard } from "solid-icons/bi";
import { Component, lazy } from "solid-js";

export type SideMenuItem = SideMenuItemProps & {
  component?: Component;
};

export const side_menu_items: SideMenuItem[] = [
  {
    title: "manage.sidemenu.dashboard",
    icon: BiSolidDashboard,
    to: "/@manage",
    component: lazy(() => import("./dashboard")),
  },
  {
    title: "manage.sidemenu.settings",
    icon: BsGearFill,
    children: [
      {
        title: "manage.sidemenu.site",
        icon: BsWindow,
        to: "/@manage/settings/site",
      },
      {
        title: "manage.sidemenu.style",
        icon: BsPaletteFill,
        to: "/@manage/settings/style",
      },
      {
        title: "manage.sidemenu.preview",
        icon: BsCameraFill,
        to: "/@manage/settings/preview",
      },
      {
        title: "manage.sidemenu.global",
        icon: BsJoystick,
        to: "/@manage/settings/global",
      },
      {
        title: "manage.sidemenu.other",
        icon: BsMedium,
        to: "/@manage/settings/other",
      },
    ],
  },
  {
    title: "manage.sidemenu.tasks",
    icon: FaSolidTasks,
    children: [
      {
        title: "manage.sidemenu.aria2",
        icon: BsCloudArrowDownFill,
        to: "/@manage/tasks/aria2",
      },
      {
        title: "manage.sidemenu.upload",
        icon: BsCloudUploadFill,
        to: "/@manage/tasks/upload",
      },
      {
        title: "manage.sidemenu.copy",
        icon: IoCopy,
        to: "/@manage/tasks/copy",
      },
    ],
  },
  {
    title: "manage.sidemenu.users",
    icon: BsPersonCircle,
    to: "/@manage/users",
  },
  {
    title: "manage.sidemenu.storages",
    icon: CgDatabase,
    to: "/@manage/storages",
  },
  {
    title: "manage.sidemenu.metas",
    icon: SiMetabase,
    to: "/@manage/metas",
  },
  {
    title: "manage.sidemenu.profile",
    icon: BsFingerprint,
    to: "/@manage/profile",
  },
  {
    title: "manage.sidemenu.about",
    icon: BsFront,
    to: "/@manage/about",
  },
];
