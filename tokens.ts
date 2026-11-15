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
  bold: 'DMSans_700Bold',
} as const;

/** Type scale: size / line height in px. */
export const type = {
  display: { size: 56, lineHeight: 60, weight: 'bold' },
  title: { size: 36, lineHeight: 40, weight: 'bold' },
  panel: { size: 28, lineHeight: 32, weight: 'bold' },
  label: { size: 18, lineHeight: 24, weight: 'bold' },
  action: { size: 15, lineHeight: 20, weight: 'bold' },
  body: { size: 16, lineHeight: 24, weight: 'regular' },
  caption: { size: 13, lineHeight: 18, weight: 'regular' },
  small: { size: 12, lineHeight: 16, weight: 'bold' },
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
} as const;

export const radius = {
  12: 12, // tags, chips
  16: 16, // inputs, cards
  24: 24, // panels, menus
  32: 32, // tools panel
  pill: 100, // all buttons
} as const;

export const border = {
  resting: 1, // empty inputs, unselected choices
  focus: 2, // the field you are typing in
} as const;

export const tokens = { color, role, fontFamily, type, space, radius, border };
export default tokens;
