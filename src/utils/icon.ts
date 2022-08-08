import {
  BsFileEarmarkWordFill,
  BsFileEarmarkExcelFill,
  BsFileEarmarkPptFill,
  BsFileEarmarkPdfFill,
  BsFileEarmarkPlayFill,
  BsFileEarmarkMusicFill,
  BsFileEarmarkFontFill,
  BsFileEarmarkImageFill,
  BsFileEarmarkMinusFill,
  BsApple,
  BsWindows,
  BsFileEarmarkZipFill,
  BsMarkdownFill,
} from "solid-icons/bs";
import { FaSolidDatabase, FaSolidBook, FaSolidCompactDisc } from "solid-icons/fa";
import { IoFolder } from "solid-icons/io";
import { ImAndroid } from 'solid-icons/im'

const iconMap = {
  "dmg,ipa,plist": BsApple,
  "exe,msi": BsWindows,
  "zip,gz,rar,7z,tar,jar,xz": BsFileEarmarkZipFill,
  apk: ImAndroid,
  db: FaSolidDatabase,
  md: BsMarkdownFill,
  epub: FaSolidBook,
  iso: FaSolidCompactDisc,
  m3u8: BsFileEarmarkPlayFill,
};

const getIcon = (type: number, ext: string) => {
  if (type !== 1) {
    for (const [extensions, icon] of Object.entries(iconMap)) {
      if (extensions.split(",").includes(ext.toLowerCase())) {
        return icon;
      }
    }
  }
  switch (type) {
    case 1:
      return IoFolder;
    case 2: {
      if (ext === "doc" || ext === "docx") {
        return BsFileEarmarkWordFill;
      }
      if (ext === "xls" || ext === "xlsx") {
        return BsFileEarmarkExcelFill;
      }
      if (ext === "ppt" || ext === "pptx") {
        return BsFileEarmarkPptFill;
      } else {
        return BsFileEarmarkPdfFill;
      }
    }
    case 3:
      return BsFileEarmarkPlayFill;
    case 4:
      return BsFileEarmarkMusicFill;
    case 5:
      return BsFileEarmarkFontFill;
    case 6:
      return BsFileEarmarkImageFill;
    default:
      return BsFileEarmarkMinusFill;
  }
};

export default getIcon;