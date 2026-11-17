/** Tailwind theme is generated from tokens.ts. Never add raw values here. */
const { color, role, space, radius, type, fontFamily, border, size } = require('./tokens.ts');

const px = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, `${v}px`]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  // v1 is light only. 'class' stops NativeWind following the system dark mode.
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      ...color,
      ...Object.fromEntries(Object.entries(role).map(([k, v]) => [k, v])),
    },
    spacing: { 0: '0px', ...px(space) },
    extend: {
      width: px(size),
      height: px(size),
      minHeight: px(size),
    },
    borderRadius: { none: '0px', ...px(radius) },
    borderWidth: { 0: '0px', DEFAULT: `${border.resting}px`, ...px(border) },
    fontFamily: { regular: [fontFamily.regular], medium: [fontFamily.medium], bold: [fontFamily.bold] },
    fontSize: Object.fromEntries(
      Object.entries(type).map(([k, v]) => [k, [`${v.size}px`, { lineHeight: `${v.lineHeight}px` }]]),
    ),
  },
  plugins: [],
};
