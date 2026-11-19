/**
 * Makemova design tokens — Week 8 "Makemova / Geometric crew".
 * Source of truth: Figma variable collection "Makemova · Geometric crew"
 * and the "Makemova geometric" text styles.
 * Do not rename tokens. Do not use raw hex values outside this file.
 */

export const color = {
  // Core
  paper: '#F8F7F4', // workspace background
  white: '#FFFFFF', // cards
  ink: '#151718', // text and actions
  inkHover: '#313436', // primary hover
  secondaryText: '#5C5F63', // supporting text
  border: '#E3E1DC', // dividers, resting inputs (Ash)

  // Crew — one job each
  mateOrange: '#FF8A1F', // primary: start and resume, current stage, errors with words
  opusYellow: '#FFE14D', // guidance and tutorials
  versaPink: '#FF9CCB', // critique and focus
  artiBlue: '#2F55FF', // compare and select, focus ring

  // Tool surfaces — soft fills for larger areas
  critique: '#FFE2F0',
  compare: '#E4EAFF',
  guidance: '#FFF2B2',
  selected: '#FFEBD6', // current / selected (Move)

  // Week 8 hi-fi screens (added, not renamed)
  chip: '#F3F2EE', // thumbnails, quiet chips
  sand: '#EFEDE7', // example project section
  canvas: '#F7F7F5', // account and project backgrounds
  stageDone: '#EEEEEE', // finished stage marker
  onDarkMuted: '#C9CBCF', // supporting text on ink
  inkRaised: '#24272A', // card on ink
  inkDivider: '#3A3E42', // divider on ink
  inkSoft: '#3A3B3E', // quote text
  yellowDivider: '#D9BF2E', // divider on Opus yellow
  critiqueIcon: '#FFE0EF',
  compareIcon: '#FFF4B8',
  tutorialIcon: '#FFE3C7',
  shadow: '#121318', // card shadow colour (used at low opacity)
  previewShadow: '#14171A', // Refined homepage workspace preview shadow (used at low opacity)
  dialogShadow: '#000000', // R4 dialog shadow (used at low opacity)
  // R7 · Tools (11125:41996) and MOVA · Hover preview (11125:42023, 42028, 42033)
  toolsShadow: '#141717', // tools panel shadow (used at low opacity)
  hoverShadow: '#171717', // hover preview shadow (used at low opacity)
  previewCritique: '#FFE1EE',
  previewCritiqueBorder: '#FFA0C7',
  previewCompare: '#E4EAFF',
  previewCompareBorder: '#AEBBFF',
  previewTutorials: '#FFF2B4',
  previewTutorialsBorder: '#FFDF49',
} as const;

/** Semantic roles. Use these in components. */
export const role = {
  surfaceCanvas: color.paper,
  surfaceCard: color.white,
  textPrimary: color.ink,
  textSecondary: color.secondaryText,
  textInverse: color.white,
  borderDefault: color.border,
  actionPrimary: color.ink,
  actionPrimaryHover: color.inkHover,
  actionSecondary: color.paper,
  selectedSurface: color.selected,
  focusRing: color.artiBlue,
  critiqueSurface: color.critique,
  compareSurface: color.compare,
  guidanceSurface: color.guidance,
  needsYou: color.mateOrange,
} as const;

export const fontFamily = {
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  bold: 'DMSans_700Bold',
  semibold: 'DMSans_600SemiBold',
} as const;

/** Type scale: size / line height in px. */
export const type = {
  display: { size: 56, lineHeight: 60, weight: 'bold' },
  title: { size: 36, lineHeight: 40, weight: 'bold' },
  panel: { size: 28, lineHeight: 32, weight: 'bold' },
  label: { size: 18, lineHeight: 24, weight: 'bold' },
  action: { size: 15, lineHeight: 20, weight: 'bold' },
  body: { size: 16, lineHeight: 24, weight: 'regular' },
  step: { size: 14, lineHeight: 18, weight: 'medium' }, // learning path stages
  caption: { size: 13, lineHeight: 18, weight: 'regular' },
  small: { size: 12, lineHeight: 16, weight: 'bold' },
} as const;

/** Week 8 hi-fi text styles: size / line height / letter spacing in px. */
export const textStyle = {
  hero: { size: 96, lineHeight: 96, letterSpacing: -3.84 },
  cta: { size: 80, lineHeight: 80, letterSpacing: -3.2 },
  section: { size: 64, lineHeight: 64, letterSpacing: -2.56 },
  headline: { size: 56, lineHeight: 58, letterSpacing: -2.24 },
  stepTitle: { size: 44, lineHeight: 48, letterSpacing: -1.76 },
  price: { size: 44, lineHeight: 48, letterSpacing: -1.32 },
  footerBrand: { size: 40, lineHeight: 44, letterSpacing: -1.2 },
  crewName: { size: 36, lineHeight: 40, letterSpacing: -1.08 },
  pageTitle: { size: 32, lineHeight: 40, letterSpacing: -0.64 },
  choiceTitle: { size: 28, lineHeight: 34, letterSpacing: -0.56 },
  briefTitle: { size: 25, lineHeight: 30, letterSpacing: -0.5 },
  heading: { size: 24, lineHeight: 32, letterSpacing: -0.4 },
  lesson: { size: 22, lineHeight: 30, letterSpacing: -0.22 },
  sectionUi: { size: 22, lineHeight: 28, letterSpacing: -0.22 },
  lead: { size: 20, lineHeight: 30, letterSpacing: 0 },
  h4: { size: 20, lineHeight: 26, letterSpacing: -0.2 },
  howBody: { size: 19, lineHeight: 28, letterSpacing: 0 },
  leadSmall: { size: 18, lineHeight: 27, letterSpacing: 0 },
  cardTitle: { size: 18, lineHeight: 24, letterSpacing: 0 },
  bodyLarge: { size: 17, lineHeight: 25, letterSpacing: 0 },
  toolTitle: { size: 17, lineHeight: 22, letterSpacing: -0.17 },
  nav: { size: 16, lineHeight: 24, letterSpacing: 0 },
  bodyUi: { size: 15, lineHeight: 22, letterSpacing: 0 },
  labelUi: { size: 14, lineHeight: 20, letterSpacing: 0 },
  bodySmall: { size: 13, lineHeight: 20, letterSpacing: 0 },
  eyebrow: { size: 13, lineHeight: 16, letterSpacing: 1.3 },
  labelSmall: { size: 12, lineHeight: 16, letterSpacing: 0 },
  meta: { size: 11, lineHeight: 14, letterSpacing: 0.22 },
  // MOVA tool card · 8.2 icon edge (11159:20888): the card is drawn at 104 / 140 scale
  toolName: { size: 16.714, lineHeight: 22.286, letterSpacing: 0 },
  toolIntro: { size: 12.071, lineHeight: 16.714, letterSpacing: 0 },
  toolMeta: { size: 11.143, lineHeight: 14.857, letterSpacing: 0 },
  // MOVA · Hover preview (11125:42023)
  previewName: { size: 22, lineHeight: 29, letterSpacing: 0 },
  previewIntro: { size: 14, lineHeight: 18, letterSpacing: 0 },
  // R5 · Tutorials category (11125:60129)
  category: { size: 11, lineHeight: 16, letterSpacing: 0 },
  panelTitle: { size: 18, lineHeight: 26, letterSpacing: -0.2 }, // R7 · Tools title
} as const;

/** Spacing scale in px. */
export const space = {
  4: 4, // icon to label
  8: 8, // button group
  12: 12, // control row
  16: 16, // panel gap
  20: 20, // button side
  24: 24, // panel edge
  32: 32, // section gap
  40: 40,
  48: 48,
  64: 64, // page side
  2: 2,
  6: 6,
  10: 10,
  14: 14,
  18: 18,
  28: 28,
  36: 36,
  56: 56,
  72: 72,
  80: 80,
  96: 96,
  120: 120,
  9: 9, // MOVA · Hover preview gap
  15: 15, // MOVA · Hover preview side padding inside its 1 stroke
} as const;

export const radius = {
  12: 12, // tags, chips
  16: 16, // inputs, cards
  24: 24, // panels, menus
  32: 32, // tools panel
  pill: 100, // all buttons
  6: 6,
  10: 10, // app cards, icon boxes, stage pills
  14: 14, // thumbnails, set-up form
  18: 18, // hero highlight
  20: 20,
  22: 22, // tool cards
  28: 28, // hero buttons, preview card
  arch: 338, // Refined homepage Mate arch top corners
  toolMova: 22.286, // MOVA tool card
} as const;

/** Fixed component sizes in px, from the Week 8 components. */
export const size = {
  fieldMinHeight: 120, // text field surface
  statusMark: 32, // status notice mark
  noteMark: 40, // feedback note mark
  stepNumber: 24, // learning path number
  dot: 12, // mark inner dot
  progress: 4, // upload progress track
  connector: 16, // learning path connector length
  connectorThickness: 2,
  sticker: 56, // crew sticker in upload (width)
  stickerHeight: 46,

  // Week 8 hi-fi layout (added)
  page: 1440, // desktop frame
  navHeight: 64,
  homeNavHeight: 81,
  authCard: 480,
  control: 44, // inputs and auth buttons
  controlSmall: 36,
  controlHeader: 40, // R8 · Compact workspace header buttons, R9 · Edit dropdown items
  controlLarge: 48,
  heroButton: 56,
  iconBox: 44,
  avatar: 32,
  column: 416, // homepage columns, project cards, search
  heroText: 620,
  visual: 760, // how-it-works visuals
  preview: 676,
  crewCard: 310,
  crewCardHeight: 460,
  setupContent: 864,
  choiceCard: 644,
  choiceCardHeight: 238,
  thumbHeight: 148,
  panel: 448, // workspace side panel
  toolCardHeight: 104,
  nextButton: 228,
  startButton: 240,
  stageButton: 32,
  icon: 20,
  iconSmall: 16,
  iconTiny: 12,
  iconXs: 14,
  iconMd: 18,
  iconLg: 22,
  wordmark: 140,
  peekClip: 124,
  // Homepage (10551:4788)
  halfCircleHeight: 12, // half-circle shape (24 × 12)
  triangleHeight: 17.2, // 20-wide triangle
  triangleLargeHeight: 20.64, // 24-wide triangle
  check: 16,
  checkHeight: 12.5,
  askImage: 360,
  askImageHeight: 230,
  pinLeft: 60,
  pinTop: 140,
  compareThumb: 300,
  compareThumbHeight: 191,
  crewShapeLeft: 35,
  crewShapeTop: 340,
  crewStickerTop: 170,
  lineUpA: 100,
  lineUpC: 180,
  lineUpD: 178,
  heroHeight: 820,
  heroArt: 692,
  heroArtHeight: 780,
  heroArtLeft: 700,
  heroArtTop: 39,
  heroDot: 24,
  highlight: 421,
  highlightHeight: 84,
  valueHeight: 420,
  visualHeight: 560,
  previewHeight: 500,
  previewThumb: 180,
  previewThumbHeight: 112,
  previewMain: 612,
  previewMainHeight: 300,
  crewSticker: 140,
  crewStickerSmall: 120,
  shape: 24,
  crewShape: 240,
  lineUp: 200,
  footerHeight: 170,
  planCard: 421,
  pinDot: 32,
  visualImage: 520,
  visualImageHeight: 332,
  // Workspace (Flow A · CH02–CH05)
  artwork: 1120,
  artworkHeight: 736,
  artworkImage: 1088,
  artworkImageHeight: 694,
  artworkLeft: 136,
  panelTop: 48,
  panelMake: 368,
  panelMakeLeft: 80,
  versionTop: 308,
  versionRow: 44,
  versionLabel: 100,
  versionLabelHeight: 34,
  versionDot: 6,
  versionDotCurrent: 8,
  stageMarker: 18,
  toolCard: 320,
  toolEdge: 121,
  compareCard: 548,
  compareCardHeight: 402,
  compareImage: 491,
  compareImageHeight: 313,
  motionRevise: 66,
  motionReviseHeight: 61,
  motionReflect: 100,
  motionReflectHeight: 92,
  peekGoalLeft: 317,
  collapse: 36,
  segment: 4,
  fileIcon: 28,
  connector16: 16,
  peekMateMoveLeft: 555,
  radioOuter: 16,
  radioInner: 8,
  peekMateMake: 125,
  peekMateMakeHeight: 58,
  peekMateMakeLeft: 479,
  peekArti: 119,
  peekArtiHeight: 63,
  peekArtiLeft: 485,
  peekMateMove: 145,
  peekMateMoveHeight: 69,
  peekMateGoal: 81,
  peekMateGoalHeight: 48,
  projectsBg: 947,
  firstVisitBg: 900,
  setupBg: 896,
  peekInsetX: 35,
  peekInsetY: 47,
  peekClipHeight: 61,
  peekOffset: 316, // sign-in Mate peek from the card's left edge
  mateShowTheWay: 155.755,
  mateShowTheWayHeight: 150,
  accountBg: 836,
  wordmarkHeight: 19.89,
  badge: 56,
  toolIcon: 72,

  // Week 8 Refined (11085:17520) — brand pattern and crew v2 placements
  crewMosaicTile: 288, // Brand pattern · 05 · Crew mosaic, 72 × 72 cells
  heroArch: 676, // Mate arch (11125:38770)
  heroArchHeight: 780,
  heroArchLeft: 700,
  heroArchTop: 39, // 120 in the frame, minus the 81 nav
  heroPreview: 596, // Workspace preview (11125:38771)
  heroPreviewHeight: 440,
  heroPreviewLeft: 40,
  heroPreviewTop: 260,
  heroMate: 256.679, // Refined crew · visual (11214:30742), Mate · Orient
  heroMateLeft: 226.296,
  heroMateTop: 21.813,
  signInMate: 69.299, // Refined crew · visual (11214:31403), Mate · Orient
  signInMateLeft: 343.35, // from the auth card's left edge
  signInMateTop: -74.42, // feet rest on the auth card
  setupMate: 95.92, // Refined crew · visual (11214:31805), Mate · Encourage
  setupMateLeft: 559.54, // from the set-up card's left edge
  setupMateTop: -84.18, // feet rest on the set-up card
  // Homepage v3 hero copy column, Figma y minus the 81 nav (11125:38739–38769)
  heroEyebrowTop: 95,
  heroTitleTop: 129,
  heroLead: 520,
  heroLeadTop: 445,
  heroButtonsTop: 571,
  heroNoteTop: 652,
  heroDivider: 560,
  heroDividerTop: 711,
  heroPathLabelTop: 732,
  heroPathTop: 765,
  pathHalfDisc: 8, // Brief half disc, 16 × 8
  pathTriangle: 13.76, // Make / Revise triangles, 16 wide
  pathArrow: 15.6,
  pathArrowHeight: 12.8,
  // Flow B · CH01 · Bring existing work (11125:41492) and its dialogs
  dialog: 560, // R4 · Dialog · Review screen (11125:60453), R6 · Upload tips (11125:60036)
  dialogClose: 32,
  reviewPreviewHeight: 350, // Review screen · Preview (11125:60456)
  fileThumb: 36, // R4/File chip · Thumb
  motionBrief: 99, // MOVA · Motion · brief, Frame=01 (11125:62759), exported with its flag
  motionBriefHeight: 89,
  motionBriefLeft: 25.79, // from the dialog's left edge
  motionBriefTop: -67, // feet rest on the dialog
  // Week 8 Refined · Edit menu, project actions, tools (Task: Edit / ⋯ / Tools)
  editDropdown: 240, // R9 · Edit dropdown (11125:41814)
  editDropdownTop: 48, // below the 40 Edit button, 4 above the header edge
  dialogSmall: 480, // R5 · Delete project confirmation, Confirm critique, Choose a focus
  projectActions: 240, // R5 · Project actions (11125:60029)
  motionRevise96: 96.417, // MOVA · Motion · revise in R4 · Dialog · Edit source
  motionTutorialsDialog: 94, // MOVA · Motion · tutorials in R5 · Tutorials
  motionTutorialsDialogHeight: 87,
  motionTutorialsDialogLeft: 442,
  toastUndo: 112,
  tutorialThumb: 64,
  tutorialIcon: 28,
  toolMovaCard: 319.429, // MOVA tool card (11125:42016)
  toolCopy: 183.9,
  toolCopyGap: 3.714,
  toolCardLeft: 14.857,
  toolEdgeWidth: 120.714,
  toolPreview: 344, // MOVA · Hover preview
  toolPreviewHeight: 246,
  toolPreviewLeft: -440, // from the tools panel's left edge (anchor x −360, panel x 80)
  toolPreviewTopCritique: 7, // from the tools panel's top (anchor y 55, panel y 48)
  toolPreviewTopCompare: 115,
  toolPreviewTopTutorials: 223,
  toolPreviewIntro: 224,
  toolPreviewShot: 312,
  toolPreviewShotHeight: 132,
  toolPreviewMotion: 101,
  toolPreviewMotionHeight: 93.2,
  toolPreviewMotionLeft: 235,
  toolPreviewMotionTop: -23.6,
  critiqueFocusValue: 176,
} as const;

/**
 * Crew v2 sticker geometry from "Refined sticker masters" (11203:19606).
 * art = exported SVG canvas; box = component frame; offset = frame origin inside the SVG
 * (die-cut and shadow reach past the frame, exactly as Figma exports them).
 */
export const crewArt = {
  mate: { art: [240, 253], box: [203, 218], offset: [24.455, 27.762] }, // Mate · Orient 11203:19607
  opus: { art: [240, 253], box: [160, 199], offset: [38, 46] }, // Opus · Read 11203:19707
  versa: { art: [240, 258], box: [205, 249], offset: [27.533, 1.25] }, // Versa · Compare 11203:19807
  arti: { art: [240, 253], box: [191, 204], offset: [31.957, 41.045] }, // Arti · Focus 11203:19897
  mateEncourage: { art: [245, 253], box: [237, 208], offset: [4.252, 37.893] }, // Mate · Encourage 11203:19656
} as const;

/** Brand pattern layer opacity per surface (Refined pattern repair). */
export const opacity = {
  patternWelcome: 0.05,
  patternAccount: 0.125,
  patternProjects: 0.062,
  scrim: 0.32, // dialog page backdrop, ink at 32%
} as const;

/** Background blur in px. */
export const blur = {
  scrim: 6, // dialog page backdrop
} as const;

export const border = {
  resting: 1, // empty inputs, unselected choices
  focus: 2, // the field you are typing in
  dash: 1.5, // drop zones, drafts, locked steps (dashed)
  chosen: 3, // chosen version
} as const;

/** Card shadow from the Week 8 hi-fi (0 8 24, 14%). */
export const shadow = {
  card: { offsetY: 8, blur: 24, opacity: 0.14 },
  preview: { offsetY: 24, blur: 48, opacity: 0.14 }, // Refined homepage workspace preview
  soft: { offsetY: 4, blur: 12, opacity: 0.08 },
  // R4 dialogs: 0 16 48 −8 at 12% and 0 2 6 at 6%, black
  dialog: { offsetY: 16, blur: 48, spread: -8, opacity: 0.12, nearOffsetY: 2, nearBlur: 6, nearOpacity: 0.06 },
  tools: { offsetY: 10, blur: 28, opacity: 0.14 }, // R7 · Tools panel
  hover: { offsetY: 8, blur: 24, opacity: 0.16 }, // MOVA · Hover preview
} as const;

export const tokens = { color, role, fontFamily, type, textStyle, space, radius, size, border, shadow, crewArt, opacity, blur };
export default tokens;
