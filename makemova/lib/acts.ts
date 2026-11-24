import type { Animated } from 'react-native';

import { play } from '@/tokens';

type Curve = (t: number) => number;

/** What one character does, as smooth curves over 0–1. */
type Act = { ms: number } & Partial<Record<'arm' | 'lean' | 'eyeX' | 'eyeY' | 'glass' | 'lensGlint' | 'eyeGlint' | 'shape', Curve>>;

const ramp = (t: number, from: number, to: number) => {
  const k = Math.max(0, Math.min(1, (t - from) / (to - from)));
  return k * k * k * (k * (k * 6 - 15) + 10);
};
/** Rises between a and b, holds, and falls between c and d. */
const pulse = (t: number, a: number, b: number, c: number, d: number) => ramp(t, a, b) * (1 - ramp(t, c, d));
const swing = (t: number, times: number) => Math.sin(2 * Math.PI * times * t) * Math.sin(Math.PI * t);

const { mate, versa, opus, arti } = play.act;
const sides = (t: number) => pulse(t, 0.02, 0.18, 0.34, 0.52) - pulse(t, 0.34, 0.52, 0.66, 0.84);
const line = (t: number) => -1 + 2 * ramp(t, 0, 1);

export const acts: Record<keyof typeof play.act, Act> = {
  mate: {
    ms: mate.ms,
    arm: (t) => -mate.arm * swing(t, mate.swings),
    lean: (t) => -mate.lean * pulse(t, 0, 0.25, 0.7, 1),
  },
  versa: {
    ms: versa.ms,
    eyeX: (t) => -versa.eyes * sides(t),
    lean: (t) => -versa.lean * sides(t),
    shape: (t) => -play.seesaw * sides(t),
    arm: (t) => versa.arm * sides(t) * 0.5 - versa.arm * pulse(t, 0.7, 0.82, 0.88, 1),
  },
  opus: {
    ms: opus.ms,
    eyeX: (t) =>
      opus.eyesX *
      (line((t - 0.1) / 0.22) * pulse(t, 0, 0.1, 0.3, 0.4) + line((t - 0.4) / 0.22) * pulse(t, 0.32, 0.42, 0.6, 0.7)),
    eyeY: (t) => opus.eyesDown * pulse(t, 0, 0.1, 0.6, 0.72) - opus.eyesUp * pulse(t, 0.66, 0.78, 0.88, 1),
    lean: (t) => opus.lean * pulse(t, 0.64, 0.78, 0.86, 1),
  },
  arti: {
    ms: arti.ms,
    arm: (t) => -arti.arm * pulse(t, 0, 0.3, 0.7, 1),
    lean: (t) => -arti.lean * pulse(t, 0, 0.3, 0.7, 1),
    glass: (t) => 1 + arti.swell * pulse(t, 0.05, 0.32, 0.66, 0.96),
    lensGlint: (t) => ramp(t, 0.2, 0.72),
    eyeGlint: (t) => ramp(t, 0.34, 0.86),
  },
};

const STEPS = 40;
const inputRange = Array.from({ length: STEPS + 1 }, (_, i) => i / STEPS);

/** A curve sampled finely enough to look continuous. */
export const follow = (progress: Animated.Value, curve: Curve) => progress.interpolate({ inputRange, outputRange: inputRange.map(curve) });
