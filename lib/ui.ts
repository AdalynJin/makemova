import { color, shadow } from '@/tokens';

/** Hex + alpha → rgba(), so shadows stay built from tokens. */
export function alpha(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

/** Card shadow from the Week 8 hi-fi. */
export const cardShadow = {
  boxShadow: `0px ${shadow.card.offsetY}px ${shadow.card.blur}px ${alpha(color.shadow, shadow.card.opacity)}`,
};
export const softShadow = {
  boxShadow: `0px ${shadow.soft.offsetY}px ${shadow.soft.blur}px ${alpha(color.shadow, shadow.soft.opacity)}`,
};

/** Every static Figma export the screens use. */
export const asset = {
  wordmark: require('@/assets/figma/wordmark.svg'),
  bgAccount: require('@/assets/figma/bg-account.svg'),
  bgProjects: require('@/assets/figma/bg-projects.svg'),
  bgFirstVisit: require('@/assets/figma/bg-first-visit.svg'),
  bgSetup: require('@/assets/figma/bg-setup.svg'),
  heroArch: require('@/assets/figma/home-hero-arch.png'),
  cafe1: require('@/assets/figma/cafe-sample-v1.jpg'),
  cafe2: require('@/assets/figma/cafe-sample-v2.jpg'),
  cafe3: require('@/assets/figma/cafe-sample-v3.jpg'),
  mateShowTheWay: require('@/assets/figma/mate-show-the-way.svg'),
  peekMateGoal: require('@/assets/figma/peek-mate-goal.png'),
  peekMateMake: require('@/assets/figma/peek-mate-make.png'),
  peekArtiInspect: require('@/assets/figma/peek-arti-inspect.png'),
  peekMateMove: require('@/assets/figma/peek-mate-move.png'),
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
  stMate: [require('@/assets/figma/st-mate-1.svg'), require('@/assets/figma/st-mate-2.svg')],
  stVersa: [require('@/assets/figma/st-versa-1.svg'), require('@/assets/figma/st-versa-2.svg')],
  stOpus: [require('@/assets/figma/st-opus-1.svg'), require('@/assets/figma/st-opus-2.svg')],
  stArti: [require('@/assets/figma/st-arti-1.svg'), require('@/assets/figma/st-arti-2.svg')],
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
} as const;
