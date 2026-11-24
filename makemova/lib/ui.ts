import { blur, color, opacity, shadow } from '@/tokens';

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
export const scrim = {
  backgroundColor: alpha(color.ink, opacity.scrim),
  backdropFilter: `blur(${blur.scrim}px)`,
} as object;
/** R7 · Tools panel shadow (0 10 28, 14%). */
export const toolsShadow = {
  boxShadow: `0px ${shadow.tools.offsetY}px ${shadow.tools.blur}px ${alpha(color.toolsShadow, shadow.tools.opacity)}`,
};
/** MOVA · Hover preview shadow (0 8 24, 16%). */
export const hoverShadow = {
  boxShadow: `0px ${shadow.hover.offsetY}px ${shadow.hover.blur}px ${alpha(color.hoverShadow, shadow.hover.opacity)}`,
};

/** Crew sticker drop shadow, drawn around the art itself (web). */
export const stickerShadow = {
  filter: `drop-shadow(0px ${shadow.sticker.offsetY}px ${shadow.sticker.blur}px ${alpha(color.ink, shadow.sticker.opacity)})`,
} as object;

/** Every static Figma export the screens use. */
export const asset = {
  wordmark: require('@/assets/figma/wordmark.svg'),
  heroPreview: require('@/assets/figma/home/workspace-preview.png'),
  visualBring: require('@/assets/figma/home/visual-bring-your-work.png'),
  versionsPreview: require('@/assets/figma/home/versions-preview.png'),
  step1: require('@/assets/figma/home/step-1.svg'),
  step2: require('@/assets/figma/home/step-2.svg'),
  step3: require('@/assets/figma/home/step-3.svg'),
  toolIconCritique: require('@/assets/figma/tool-icon-critique.svg'),
  toolIconCompare: require('@/assets/figma/tool-icon-compare.svg'),
  toolIconTutorials: require('@/assets/figma/tool-icon-tutorials.svg'),
  crewMosaicTile: require('@/assets/figma/crew-mosaic-tile.svg'),
  crewV3: {
    mate: require('@/assets/figma/crew-v3/sticker-mate.png'),
    arti: require('@/assets/figma/crew-v3/sticker-arti.png'),
    versa: require('@/assets/figma/crew-v3/sticker-versa.png'),
    opus: require('@/assets/figma/crew-v3/sticker-opus.png'),
    mateShowTheWay: require('@/assets/figma/crew-v3/peek-mate-show-the-way.png'),
    mateSetTheGoal: require('@/assets/figma/crew-v3/peek-mate-set-the-goal.png'),
    mateReflectDone: require('@/assets/figma/crew-v3/peek-mate-reflect-done.png'),
    mateMake: require('@/assets/figma/crew-v3/peek-mate-make.png'),
    artiInspect: require('@/assets/figma/crew-v3/peek-arti-inspect.png'),
    mateMoveIt: require('@/assets/figma/crew-v3/peek-mate-move-it.png'),
    opusGuide: require('@/assets/figma/crew-v3/peek-opus-guide.png'),
  },
  /** Crew v3 in layers, back to front. The arm, hand and eyes layers move. */
  crewLayers: {
    mate: {
      back: require('@/assets/figma/crew-layers/mate-back.svg'),
      arm: require('@/assets/figma/crew-layers/mate-arm.svg'),
      body: require('@/assets/figma/crew-layers/mate-body.svg'),
      hand: require('@/assets/figma/crew-layers/mate-hand.svg'),
      eyes: require('@/assets/figma/crew-layers/mate-eyes.svg'),
    },
    versa: {
      back: require('@/assets/figma/crew-layers/versa-back.svg'),
      arm: require('@/assets/figma/crew-layers/versa-arm.svg'),
      body: require('@/assets/figma/crew-layers/versa-body.svg'),
      hand: require('@/assets/figma/crew-layers/versa-hand.svg'),
      eyes: require('@/assets/figma/crew-layers/versa-eyes.svg'),
    },
    opus: {
      back: require('@/assets/figma/crew-layers/opus-back.svg'),
      body: require('@/assets/figma/crew-layers/opus-body.svg'),
      eyes: require('@/assets/figma/crew-layers/opus-eyes.svg'),
    },
    arti: {
      back: require('@/assets/figma/crew-layers/arti-back.svg'),
      glassBack: require('@/assets/figma/crew-layers/arti-glass-back.svg'),
      arm: require('@/assets/figma/crew-layers/arti-arm.svg'),
      body: require('@/assets/figma/crew-layers/arti-body.svg'),
      glass: require('@/assets/figma/crew-layers/arti-glass.svg'),
      hand: require('@/assets/figma/crew-layers/arti-hand.svg'),
    },
  },
  /** Arti's magnifier on its own, in three layers: die-cut edge, ring and handle, glass tint and marks. */
  lens: {
    back: require('@/assets/figma/crew-layers/lens-back.svg'),
    ring: require('@/assets/figma/crew-layers/lens-ring.svg'),
    marks: require('@/assets/figma/crew-layers/lens-marks.svg'),
  },
  letter: {
    m: require('@/assets/figma/crew-layers/letter-m.svg'),
    o: require('@/assets/figma/crew-layers/letter-o.svg'),
    v: require('@/assets/figma/crew-layers/letter-v.svg'),
    a: require('@/assets/figma/crew-layers/letter-a.svg'),
  },
  letterSlot: {
    m: require('@/assets/figma/crew-layers/slot-m.svg'),
    o: require('@/assets/figma/crew-layers/slot-o.svg'),
    v: require('@/assets/figma/crew-layers/slot-v.svg'),
    a: require('@/assets/figma/crew-layers/slot-a.svg'),
  },
  motion: {
    brief: require('@/assets/figma/motion/brief.png'),
    revise: require('@/assets/figma/motion/revise.png'),
    hello: require('@/assets/figma/motion/hello.png'),
    critique: require('@/assets/figma/motion/critique.png'),
    compare: require('@/assets/figma/motion/compare.png'),
    tutorials: require('@/assets/figma/motion/tutorials.png'),
    saved: require('@/assets/figma/motion/saved.png'),
    reflect: require('@/assets/figma/motion/reflect.png'),
    guide: require('@/assets/figma/motion/guide.png'),
  },

  cafe1: require('@/assets/figma/cafe-sample-v1.jpg'),
  cafe2: require('@/assets/figma/cafe-sample-v2.jpg'),
  cafe3: require('@/assets/figma/cafe-sample-v3.jpg'),
  templateCafe: require('@/assets/figma/templates/campus-cafe.png'),
  templateTandem: require('@/assets/figma/templates/tandem-icon.png'),
  edgeCritique: require('@/assets/figma/tool-edge-critique.svg'),
  edgeCompare: require('@/assets/figma/tool-edge-compare.svg'),
  edgeTutorials: require('@/assets/figma/tool-edge-tutorials.svg'),
  washCritique: require('@/assets/figma/tool-wash-critique.svg'),
  washCompare: require('@/assets/figma/tool-wash-compare.svg'),
  washTutorials: require('@/assets/figma/tool-wash-tutorials.svg'),
  previewShotCritique: require('@/assets/figma/hover-preview-critique.png'),
  previewShotCompare: require('@/assets/figma/hover-preview-compare.png'),
  previewShotTutorials: require('@/assets/figma/hover-preview-tutorials.png'),
  iconBulb: require('@/assets/figma/icon-bulb.svg'),
  iconBook: require('@/assets/figma/icon-book.svg'),
  planFree: require('@/assets/figma/plan-free.svg'),
  planPass: require('@/assets/figma/plan-pass.svg'),
  planStudio: require('@/assets/figma/plan-studio.svg'),
  chosenMark: require('@/assets/figma/chosen-mark.svg'),
  planNote: require('@/assets/figma/plan-note.svg'),
  checkWhite: require('@/assets/figma/check-white.svg'),
  checkInk: require('@/assets/figma/check-ink.svg'),
  crewMate: require('@/assets/figma/crew-shape-mate.svg'),
  crewVersa: require('@/assets/figma/crew-shape-versa.svg'),
  crewArti: require('@/assets/figma/crew-shape-arti.svg'),
  iconHelp: require('@/assets/figma/icon-help.svg'),
  iconMessage: require('@/assets/figma/icon-message.svg'),
  iconCheck: require('@/assets/figma/icon-check.svg'),
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
  iconUploadWhite: require('@/assets/figma/icon-upload-white.svg'),
  iconX: require('@/assets/figma/icon-x.svg'),
  iconImage: require('@/assets/figma/icon-image.svg'),
} as const;
