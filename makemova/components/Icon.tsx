import { Image } from 'expo-image';

import { asset } from '@/lib/ui';
import { size as s } from '@/tokens';

export type IconName =
  | 'help'
  | 'helpSmall'
  | 'folder'
  | 'arrowRight'
  | 'arrowRightWhite'
  | 'arrowLeft'
  | 'chevronDown'
  | 'zap'
  | 'checkSmall'
  | 'edit'
  | 'finish'
  | 'upload'
  | 'uploadWhite'
  | 'x'
  | 'image'
  | 'bulb'
  | 'book';

const map = {
  help: [asset.iconHelp, s.iconMd],
  helpSmall: [asset.iconHelpSmall, s.iconXs],
  folder: [asset.iconFolder, s.iconLg],
  arrowRight: [asset.iconArrowRight, s.icon],
  arrowRightWhite: [asset.iconArrowRightWhite, s.icon],
  arrowLeft: [asset.iconArrowLeft, s.icon],
  chevronDown: [asset.iconChevronDown, s.iconSmall],
  zap: [asset.iconZap, s.iconSmall],
  checkSmall: [asset.iconCheckSmall, s.iconTiny],
  edit: [asset.iconEdit, s.iconSmall],
  finish: [asset.iconFinish, s.iconSmall],
  upload: [asset.iconUpload, s.icon],
  uploadWhite: [asset.iconUploadWhite, s.iconMd],
  x: [asset.iconX, s.icon],
  image: [asset.iconImage, s.iconSmall],
  bulb: [asset.iconBulb, s.tutorialIcon],
  book: [asset.iconBook, s.tutorialIcon],
} as const;

/** R4 icons exported from the Week 8 file. `size` overrides the default box. */
export function Icon({ name, size }: { name: IconName; size?: number }) {
  const [source, base] = map[name];
  const d = size ?? base;
  return <Image source={source} style={{ width: d, height: d }} contentFit="contain" />;
}
