import { color, opacity, shadow } from '@/tokens';

/** Hex + alpha → rgba(), so shadows stay built from tokens. */
export function alpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Card shadow from the Week 8 hi-fi. */
export const cardShadow = {
  boxShadow: `0px ${shadow.card.offsetY}px ${shadow.card.blur}px ${alpha(color.shadow, shadow.card.opacity)}`,
};
/** Refined homepage workspace preview shadow (0 24 48, 14%). */
export const previewShadow = {
  boxShadow: `0px ${shadow.preview.offsetY}px ${shadow.preview.blur}px ${alpha(color.previewShadow, shadow.preview.opacity)}`,
};
export const softShadow = {
  boxShadow: `0px ${shadow.soft.offsetY}px ${shadow.soft.blur}px ${alpha(color.shadow, shadow.soft.opacity)}`,
};
/** R4 dialog shadow (two layers) and the 32% ink scrim behind it. */
export const dialogShadow = {
  boxShadow: `0px ${shadow.dialog.offsetY}px ${shadow.dialog.blur}px ${shadow.dialog.spread}px ${alpha(color.dialogShadow, shadow.dialog.opacity)}, 0px ${shadow.dialog.nearOffsetY}px ${shadow.dialog.nearBlur}px ${alpha(color.dialogShadow, shadow.dialog.nearOpacity)}`,
};
export const scrim = { backgroundColor: alpha(color.ink, opacity.scrim) };

/** Every static Figma export the screens use. */
export const asset = {
  wordmark: require('@/assets/figma/wordmark.svg'),
  heroPreview: require('@/assets/figma/home-workspace-preview.png'),
  pathBrief: require('@/assets/figma/hero-path/brief.svg'),
  pathMake: require('@/assets/figma/hero-path/make.svg'),
  pathRevise: require('@/assets/figma/hero-path/revise.svg'),
  pathReflect: require('@/assets/figma/hero-path/reflect.svg'),
  pathArrow: require('@/assets/figma/hero-path/arrow.svg'),
  crewMosaicTile: require('@/assets/figma/crew-mosaic-tile.svg'),
  crewV2: {
    mate: require('@/assets/figma/crew-v2/mate-orient.svg'),
    opus: require('@/assets/figma/crew-v2/opus-read.svg'),
    versa: require('@/assets/figma/crew-v2/versa-compare.svg'),
    arti: require('@/assets/figma/crew-v2/arti-focus.svg'),
    mateEncourage: require('@/assets/figma/crew-v2/mate-encourage.svg'),
  },
  cafe1: require('@/assets/figma/cafe-sample-v1.jpg'),
  cafe2: require('@/assets/figma/cafe-sample-v2.jpg'),
  cafe3: require('@/assets/figma/cafe-sample-v3.jpg'),
  peekMateGoal: require('@/assets/figma/peek-mate-goal.png'),
  peekMateMake: require('@/assets/figma/peek-mate-make.png'),
  peekArtiInspect: require('@/assets/figma/peek-arti-inspect.png'),
  motionRevise: require('@/assets/figma/motion-revise.png'),
  motionReflect: require('@/assets/figma/motion-reflect.png'),
  edgeCritique: require('@/assets/figma/tool-edge-critique.png'),
  edgeCompare: require('@/assets/figma/tool-edge-compare.png'),
  edgeTutorials: require('@/assets/figma/tool-edge-tutorials.png'),
  shapeBrief: require('@/assets/figma/shape-brief.svg'),
  shapeMake: require('@/assets/figma/plan-studio.svg'),
  shapeRevise: require('@/assets/figma/shape-make.svg'),
  shapeReflect: require('@/assets/figma/shape-reflect.svg'),
  shapeReviseSmall: require('@/assets/figma/shape-revise.svg'),
  planFree: require('@/assets/figma/plan-free.svg'),
  planPass: require('@/assets/figma/plan-pass.svg'),
  planStudio: require('@/assets/figma/plan-studio.svg'),
  planNote: require('@/assets/figma/plan-note.svg'),
  checkWhite: require('@/assets/figma/check-white.svg'),
  checkInk: require('@/assets/figma/check-ink.svg'),
  crewMate: require('@/assets/figma/crew-shape-mate.svg'),
  crewVersa: require('@/assets/figma/crew-shape-versa.svg'),
  crewArti: require('@/assets/figma/crew-shape-arti.svg'),
  luA: require('@/assets/figma/lu-a.svg'),
  luB: require('@/assets/figma/lu-b.svg'),
  luC: require('@/assets/figma/lu-c.svg'),
  luD: require('@/assets/figma/lu-d.svg'),
  iconHelp: require('@/assets/figma/icon-help.svg'),
  iconHelpSmall: require('@/assets/figma/icon-help-small.svg'),
  iconFolder: require('@/assets/figma/icon-folder.svg'),
  iconArrowRight: require('@/assets/figma/icon-arrow-right.svg'),
  iconArrowRightWhite: require('@/assets/figma/icon-arrow-right-white.svg'),
  iconArrowLeft: require('@/assets/figma/icon-arrow-left.svg'),
  iconChevronDown: require('@/assets/figma/icon-chevron-down.svg'),
  iconZap: require('@/assets/figma/icon-zap.svg'),
  iconCheckSmall: require('@/assets/figma/icon-check-small.svg'),
  iconEdit: require('@/assets/figma/icon-edit.svg'),
  iconFinish: require('@/assets/figma/icon-finish.svg'),
  iconUpload: require('@/assets/figma/icon-upload.svg'),
  iconX: require('@/assets/figma/icon-x.svg'),
  iconImage: require('@/assets/figma/icon-image.svg'),
  motionBrief: require('@/assets/figma/motion-brief.svg'),
} as const;
