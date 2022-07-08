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

export const side_menu_items: SideMenuItemProps[] = [
  {
    title: "sidemenu.settings",
    icon: BsGearFill,
    children: [
      {
        title: "sidemenu.site",
        icon: BsWindow,
        to: "/@manage/settings/site",
      },
      {
        title: "sidemenu.style",
        icon: BsPaletteFill,
        to: "/@manage/settings/style",
      },
      {
        title: "sidemenu.preview",
        icon: BsCameraFill,
        to: "/@manage/settings/preview",
      },
      {
        title: "sidemenu.global",
        icon: BsJoystick,
        to: "/@manage/settings/global",
      },
      {
        title: "sidemenu.other",
        icon: BsMedium,
        to: "/@manage/settings/other",
      },
    ],
  },
  {
    title: "sidemenu.tasks",
    icon: FaSolidTasks,
    children: [
      {
        title: "sidemenu.aria2",
        icon: BsCloudArrowDownFill,
        to: "/@manage/tasks/aria2",
      },
      {
        title: "sidemenu.upload",
        icon: BsCloudUploadFill,
        to: "/@manage/tasks/upload",
      },
      {
        title: "sidemenu.copy",
        icon: IoCopy,
        to: "/@manage/tasks/copy",
      },
    ],
  },
  {
    title: "sidemenu.users",
    icon: BsPersonCircle,
    to: "/@manage/users",
  },
  {
    title: "sidemenu.accounts",
    icon: CgDatabase,
  },
  {
    title: "sidemenu.metas",
    icon: SiMetabase,
    to: "/@manage/metas",
  },
  {
    title: "sidemenu.profile",
    icon: BsFingerprint,
    to: "/@manage/profile",
  },
  {
    title: "sidemenu.about",
    icon: BsFront,
    to: "/@manage/about",
  },
];
