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
  tutorials: '#FFF6CC', // Tutorials tool card (11159:21034)
  softBlue: '#E4EAFF', // current version, Explore templates choice, account notice, homepage step 2 (Arti)
  softPink: '#FFE2F0', // homepage step 3 (Versa)

  // Week 8 hi-fi screens (added, not renamed)
  chip: '#F3F2EE', // thumbnails, quiet chips
  sand: '#EFEDE7', // example project section
  canvas: '#F7F7F5', // account and project backgrounds
  stageDone: '#E3E1DC', // finished stage marker (Ash)
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
  previewCompareBorder: '#E4EAFF', // no stroke in Figma
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
  extrabold: 'DMSans_800ExtraBold', // Account · Credits & usage / Plans titles and stat numbers
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
  askTitle: { size: 16, lineHeight: 21, letterSpacing: 0 }, // Visual · Ask about one decision, note title
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
  // Shared · Explore practice templates (11125:41603)
  templateTitle: { size: 48, lineHeight: 51.84, letterSpacing: -1.152 },
  templateName: { size: 28, lineHeight: 39.2, letterSpacing: 0 },
  templateLead: { size: 18, lineHeight: 25.2, letterSpacing: 0 },
  templateBody: { size: 16, lineHeight: 22.4, letterSpacing: 0 },
  templateNote: { size: 15, lineHeight: 21, letterSpacing: 0 },
  templateMeta: { size: 13, lineHeight: 18.2, letterSpacing: 0 },
  templateEyebrow: { size: 12, lineHeight: 16.8, letterSpacing: 0 },
  // Account · Credits & usage (11125:52489) and Account · Plans (11125:52604)
  accountTitle: { size: 44, lineHeight: 48, letterSpacing: -0.88 },
  planPrice: { size: 30, lineHeight: 36, letterSpacing: -0.3 },
  tableHead: { size: 13, lineHeight: 18, letterSpacing: 0.52 },
  compareLabel: { size: 12.174, lineHeight: 17.391, letterSpacing: 0 }, // Compare versions · A / B labels and actions
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
  26: 26, // homepage example bullets, FAQ rows
  30: 30, // homepage tool rows
  44: 44, // homepage line-up gap
  60: 60, // homepage CTA top
  100: 100, // homepage section top
  110: 110, // homepage example section
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
  compareFrame: 8.696, // Compare versions · design frame
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
  planCard: 416,
  planButton: 54,
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
  versionTop: 306, // one version; each further one lifts the list by half a row
  versionRow: 44,
  versionLabel: 100,
  versionLabelHeight: 34,
  versionDot: 6,
  versionDotCurrent: 8,
  stageMarker: 20,
  toolCard: 320,
  toolEdge: 121,
  compareCard: 548,
  compareCardHeight: 346,
  compareCanvas: 514,
  compareCanvasHeight: 280,
  compareImage: 401.6,
  compareImageHeight: 256,
  reflectChangedText: 524,
  reflectPanel: 548, // What I learned, under After
  reflectPanelLeft: 572, // from the artwork's left edge
  reflectPanelTop: 436,
  reflectSurfaceTop: 44,
  reflectMotionLeft: 398.6, // inside the panel's 1 border
  reflectMotionTop: -42.3,
  reflectHeight: 771,
  motionRevise: 66,
  motionReviseHeight: 61,
  motionReflect: 100,
  motionReflectHeight: 92,
  peekGoalLeft: 317,
  collapse: 36,
  segment: 4,
  fileIcon: 36,
  connector16: 16,
  peekMateMoveLeft: 555,
  radioOuter: 16,
  radioInner: 8,
  radioChosen: 18, // Explain answers
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
  wordmarkHome: 211.2, // Homepage v3 nav (11337:33920)
  wordmarkHomeHeight: 31.9,
  navButton: 50, // Homepage v3 · Create account
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
  // Homepage v3 (Refined 11125:38701). Hero values are in the hero section (Figma y minus the 81 nav).
  heroPreviewArt: 692, // Workspace preview 11125:38771 exported with its shadow (render −48, −24)
  heroPreviewArtHeight: 442,
  heroPreviewArtLeft: -8, // inside the Mate arch
  heroPreviewArtTop: 306,
  heroMateArt: 303.5, // Hero · Mate looks 11523:36009 · Mate, exported without pupils
  heroMateArtHeight: 319.5,
  heroMateArtLeft: 719, // 750 − 31
  heroMateArtTop: 72, // 188 − 81 − 35
  valueStripHeight: 420,
  valueColumn: 416,
  stepBadge: 56,
  stepText: 480,
  stepBody: 440,
  visualWidth: 760, // how-it-works visual frames
  visualBringHeight: 431,
  visualAskHeight: 462,
  visualCompareHeight: 659,
  visualBringArtTop: -120.7, // characters rise above the visual frame
  // Visual · Ask about one decision (11125:38958)
  askCard: 448,
  askCardHeight: 295.8,
  askCardLeft: 40,
  askCardTop: 72,
  askShot: 420,
  askShotHeight: 267.8,
  askPin: 30,
  askPinTarget: 44,
  askPinLeft: 43, // 50 − 7: the 44 target sits around the 30 pin
  askPinTop: 209,
  askNote: 224,
  askNoteHeight: 232,
  askNoteLeft: 500,
  askNoteTop: 96,
  askNoteText: 188,
  askNoteMark: 22,
  askCaptionTop: 404,
  askArti: 112,
  askArtiLeft: 613.6,
  askArtiTop: 2,
  askRingLeft: 13.9, // around "Order pickup" inside the 420 shot
  askRingTop: 134.5,
  askRing: 83.1,
  askRingHeight: 19.2,
  askShotLeft: 55, // the 420 shot inside the visual
  askShotTop: 87,
  askLens: 58, // lens radius
  // Visual · Compare, revise, reflect (11125:39038). One draggable frame replaces the two side-by-side ones.
  compareCardWidth: 544,
  compareCardTop: 40,
  compareSlide: 520,
  compareSlideHeight: 331.5,
  compareHandle: 40,
  compareLine: 3,
  compareChipsTop: 411.5,
  compareChip: 34,
  compareLessonTop: 469,
  compareLesson: 680,
  compareLessonHeight: 150,
  compareLessonText: 600,
  compareVersa: 111.2,
  compareVersaLeft: 640,
  compareVersaTop: 392,
  compareMarkWidth: 14,
  compareMarkHeight: 12,
  // The crew · mova puzzle. Letter boxes come from the wordmark at 5 ×.
  puzzle: 1312,
  puzzleHeight: 240,
  puzzleTop: 63.7,
  puzzleLetterHeight: 112.55,
  puzzleSnap: 70,
  versionsPreview: 676,
  versionsPreviewHeight: 500,
  examplePreviewOpus: 84.3, // Example project · Opus
  examplePreviewOpusLeft: 558, // from the versions card's left edge
  examplePreviewOpusTop: -94,
  crewCardLens: 46, // Arti's lens radius inside the card
  crewCardMate: 157.2, // crew card characters (left, top inside the 310 × 460 card)
  crewCardMateLeft: 59,
  crewCardMateTop: 218.9,
  crewCardVersa: 144.5,
  crewCardVersaLeft: 98.5,
  crewCardVersaTop: 218.3,
  crewCardOpus: 92.7,
  crewCardOpusLeft: 108.6,
  crewCardOpusTop: 238,
  crewCardArti: 134.4,
  crewCardArtiLeft: 68.5,
  crewCardArtiTop: 242.5,
  lineUpHeight: 170, // Crew line-up 11125:39552
  lineUpMate: 127,
  lineUpMateLeft: 150,
  lineUpMateTop: 65,
  lineUpOpus: 73.7,
  lineUpOpusLeft: 470,
  lineUpOpusTop: 82.5,
  lineUpVersa: 116.7,
  lineUpVersaLeft: 900,
  lineUpVersaTop: 65,
  lineUpArti: 106.4,
  lineUpArtiLeft: 1210,
  lineUpArtiTop: 75,
  toolIcon72: 72,
  planDot: 20,
  // CH00 account screens (Refined): characters stand on the 480 auth card. Left is from the card's left edge.
  peekShowTheWay: 124, // Character peek · Mate · Show the way (sign in, create account)
  peekShowTheWayLeft: 316,
  peekSetTheGoal: 99, // Character peek · Mate · Set the goal (email sent)
  peekSetTheGoalLeft: 341,
  peekReflectDone: 99.2, // Character peek · Mate · Reflect · done (password saved)
  peekReflectDoneLeft: 341,
  resetMotion: 113.4, // MOVA · Motion · brief on Reset password
  resetMotionLeft: 312,
  resetMotionTop: -59,
  newPasswordMotion: 157.7, // MOVA · Motion · revise on Set new password
  newPasswordMotionLeft: 295,
  newPasswordMotionTop: -92,
  setupMateMoveIt: 145, // Flow A · CH02: Character peek · Mate · Move it, from the 864 set-up card's left edge
  setupMateMoveItLeft: 535,
  setupMateMake: 136, // Flow B · CH01: Character peek · Mate · Make
  setupMateMakeLeft: 544,
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
  motionDialog: 96.4, // MOVA · Motion · brief / guide instance on dialog pages
  quickGuideOpus: 97, // R6 · Quick guide: Character peek · Opus · Here’s a guide
  quickGuideOpusLeft: 423, // from the dialog's left edge
  // Shared · Explore practice templates (11125:41603)
  pageContent: 1312, // 1440 frame minus the 64 sides
  templateArt: 260,
  templateCafe: 358, // Your design · v2, 358 × 228
  templateCafeHeight: 228,
  templateTandem: 228, // Artifact / Tandem app icon / Version=2
  templateBringOwn: 280,
  templateHello: 120, // MOVA · Motion · hello beside the title's second line
  templateHelloGap: 24, // from the end of "yours."
  templateHelloTop: -51.84, // Figma y 173, one title line above line two
  // Account · Credits & usage (11125:52489) and Plans (11125:52604)
  creditsGuide: 110, // MOVA · Motion · guide, 1121,104
  creditsGuideLeft: 1057,
  creditsGuideTop: -8,
  creditsColumn: 421, // stat cards and Always free
  usageBar: 8,
  creditCost: 28,
  creditPlanColumn: 220, // Available on column
  creditTopicColumn: 440,
  plansBrief: 96, // MOVA · Motion · brief, 647,125
  plansBriefGap: 25, // from the end of the title
  plansBriefTop: -45,
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
  toolWash: 208, // Pattern wash, behind the copy and the edge
  toolWashLeft: 111.429,
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
  // Compare versions · Selection only (11125:41951): A and B columns drawn at 560 / 644 scale
  compareMode: 1144,
  compareModeLeft: 124, // centred in the 1392 work area
  compareColumn: 560,
  compareFrameHeight: 367,
  compareShot: 532,
  compareShotHeight: 339,
  compareControl: 31.304,
  compareChange: 136,
  compareExit: 172, // Action · Exit comparison
  compareGap: 10.435,
  comparePad: 13.913,
  compareStroke: 0.87,
  // R5 · Choose left / right version (11125:60079, 60104)
  versionIcon: 24,
  versionView: 144,
} as const;

/**
 * Crew v3 character geometry, from the Refined prototype placements (11085:17520).
 * box = the placement frame in Figma (the size you pass as width scales it);
 * render = where the exported art (die-cut edge and shadow included) sits against that frame: [x, y, w, h].
 * Peeks overflow their frame upward so the character stands on the card edge.
 */
export const crewArt = {
  mate: { box: [145.1, 120], render: [-28, -78.7, 214.2, 225.4] }, // Homepage · Visual · Bring your work · Mate 11125:38886
  arti: { box: [112, 100], render: [-30.8, -80.8, 194.2, 204.3] }, // Visual · Ask about one decision · Arti 11125:38972
  versa: { box: [111.2, 100], render: [-35, -32.2, 150.9, 151.8] }, // Visual · Compare, revise, reflect · Versa 11125:39052
  opus: { box: [84.3, 100], render: [-56.2, -85, 198.2, 208.6] }, // Example project · Opus 11125:39145
  mateShowTheWay: { box: [124, 61], render: [0, -22.9, 124, 86.2] }, // Character peek · Mate · Show the way 11125:39953
  mateSetTheGoal: { box: [99, 62], render: [0, -23.3, 99, 87.6] }, // Character peek · Mate · Set the goal 11125:40412
  mateReflectDone: { box: [99.2, 82], render: [0, -2.4, 99.2, 86.7] }, // Character peek · Mate · Reflect · done 11125:40811
  mateMake: { box: [125, 58], render: [0, -25.7, 125, 85.9] }, // Character peek · Mate · Make 11125:41190
  artiInspect: { box: [119, 63], render: [0, -29.3, 119, 95.1] }, // Character peek · Arti · Inspect 11125:41216
  mateMoveIt: { box: [145, 69], render: [0, -30.5, 145, 102.2] }, // Character peek · Mate · Move it 11125:41444
  opusGuide: { box: [97, 56], render: [0, -28.1, 97, 86.7] }, // Character peek · Opus · Here’s a guide 11125:59904
} as const;

/**
 * Figma: Vector motion component sets (Refined, 11125:62314). Each set plays Frame=01 → last and loops
 * (After delay 20 ms, Smart animate). Values are the per-frame transition times in ms, in play order.
 * Sprite strips in assets/figma/motion are 156×144 frames exported at 2x.
 */
export const motion = {
  frame: [156, 144],
  brief: [320, 380, 140, 360, 300, 300, 360, 380], // 11125:62758
  revise: [180, 180, 180, 180, 140, 360, 500, 340, 200], // 11125:62984
  hello: [320, 380, 140, 360, 300, 300, 360, 380], // 11125:62315
  critique: [320, 380, 140, 360, 300, 300, 360, 380], // 11125:64276
  compare: [320, 380, 140, 360, 300, 300, 360, 380], // 11125:63779
  tutorials: [320, 380, 140, 360, 300, 300, 360, 380], // 11125:64050
  saved: [320, 380, 140, 360, 300, 300, 360, 380], // 11125:63508
  reflect: [300, 300, 160, 360, 360, 300], // 11125:63255
  guide: [320, 380, 140, 360, 300, 300, 360, 380], // 11125:62550
} as const;

/**
 * Crew v3 split into layers (assets/figma/crew-layers) so one part can move. Coordinates are SVG units of `view`.
 * render = where the art sits against the sticker frame; pivot = shoulder or elbow the moving arm turns around.
 */
export const crewLayers = {
  mate: { view: [233, 245], pivot: [173, 112], render: [-28, -78.7, 214.2, 225.4] },
  versa: { view: [184, 197], pivot: [129.5, 62], render: [-35, -31.4, 140.9, 150.9] },
  opus: { view: [219, 230], pivot: [0, 0], render: [-56.2, -85, 198.2, 208.6] },
  arti: { view: [234, 246], pivot: [166, 143], render: [-30.8, -80.8, 194.2, 204.3] },
} as const;

/** Arti's magnifier, in Arti's SVG units: ring centre and radius, and the square the lens layers are cut from. */
export const artiGlass = { centre: [159.49, 111.24], radius: 17.48, box: 82, inset: 30 } as const;
/** Where light can catch: the inside of the magnifier and of the monocle, and the hand the magnifier grows from. */
export const artiShine = { lens: [159.49, 111.24, 15.5], eye: [97.47, 119.94, 11.1], grip: [198.34, 150.09] } as const;

/** The four wordmark letters in the mova puzzle: width and scattered position (left, top, degrees) at 1312 wide. */
export const puzzleLetters = {
  m: { width: 174.45, left: 405.5, loose: [60, 40, -12] },
  o: { width: 112.6, left: 586.7, loose: [262, 112, 9] },
  v: { width: 112.55, left: 690.3, loose: [940, 106, -7] },
  a: { width: 112.55, left: 793.85, loose: [1124, 36, 14] },
} as const;

/** Homepage motion: durations in ms, distances in px or SVG units, curves as cubic-bezier. */
export const play = {
  easeOut: [0.16, 1, 0.3, 1],
  overshoot: [0.34, 1.56, 0.64, 1], // characters and letters only
  hover: 180,
  settle: 260,
  look: 220,
  slide: 600,
  ring: 600,
  snap: 550,
  hop: 600,
  hopStagger: 90,
  hopHeight: 22,
  words: 800,
  wordStagger: 80,
  wordRise: 40,
  highlight: 600,
  highlightDelay: 700,
  lift: 4,
  tapSlop: 5, // px a press may wander and still count as a tap
  pinScale: 1.15,
  dim: 0.38,
  eyeReach: 4, // SVG units
  lookDistance: 120, // px from Mate's face at which the eyes reach their full offset
  lookBase: [-3.16, 1.9], // Hero · Mate looks: centre of the eight looks
  lookReach: [8, 7],
  compareKeyStep: 5, // percent
  lensFly: 420,
  lensZoom: 1.8,
  findSlop: 28, // px around "Order pickup" that counts as found
  helloDelay: 1500, // after the title has settled
  aimHero: 9, // degrees Mate's raised arm leans toward the pointer
  aimReach: 520, // px from Mate at which the arm is at its furthest
  aimArti: 12,
  pull: [-24, 8], // Versa's raised arm, degrees, with the handle at v3 and at v2
  lean: [-5, 5], // Versa's body, same ends
  pickedAt: 3, // percent: dragged this close to v3 counts as choosing it
  crewHop: { ms: 620, at: [0, 0.14, 0.45, 0.76, 0.88, 1], y: [0, 0, -0.09, 0, 0, 0], squash: [1, 0.95, 1.03, 0.95, 1.01, 1] }, // y as a share of the height
  // Keyframes: position 0–1, then the value
  // Characters: every move eases in and out. Spring speeds are per second; a higher number follows more closely.
  glide: 7, // eyes, arms, bodies
  lensGlide: 16, // the magnifier behind the mouse
  strollGlide: 4, // footer crew
  act: {
    mate: { ms: 2200, arm: 15, swings: 3, lean: 1.5 }, // waves hi
    versa: { ms: 3400, arm: 12, lean: 5, eyes: 4 }, // weighs one side, then the other, then picks
    opus: { ms: 3600, lean: 4, eyesX: 4, eyesDown: 3, eyesUp: 3 }, // reads two lines, then "aha"
    arti: { ms: 3000, arm: 7, lean: 2, swell: 0.32 }, // the magnifier grows, then the glass catches the light
  },
  seesaw: 3.5, // degrees Versa's ink shape tips while comparing
  swell: 0.16, // how much the loose magnifier grows when it finds something
  glintAngle: 24,
  glintOpacity: 0.85,
  hiEvery: 4600, // hero Mate says hi again
  idleEvery: 6500, // one quiet act when the section is on screen
  turnEvery: 4200, // the four helpers act one after another
  firstTurn: 900,
  strollEvery: 5200,
  strollIn: 150, // px the footer crew walks in from
  strollSpeed: 120, // px per second
  strollReach: 56, // px they come toward the pointer
  strollPull: 0.14,
  strollIdle: 34,
  stride: 26, // px per step
  stepTilt: 3.2, // degrees
  stepLift: 4, // px
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
  radio: 5, // chosen answer
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
  sticker: { offsetY: 2, blur: 3, opacity: 0.14 }, // crew sticker
} as const;

export const tokens = { color, role, fontFamily, type, textStyle, space, radius, size, border, shadow, crewArt, opacity, blur, motion, crewLayers, artiGlass, artiShine, puzzleLetters, play };
export default tokens;
