import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';

import { asset } from '@/lib/ui';
import { motion } from '@/tokens';

export type MotionName = Exclude<keyof typeof motion, 'frame'>;

type Props = {
  /** Figma: MOVA · Motion · <name> */
  name: MotionName;
  /** Instance width in Figma. Height keeps the 156 × 144 frame ratio. */
  width: number;
  style?: object;
};

/**
 * Figma: MOVA · Motion · <name> (Vector motion component sets, Refined 11125:62314).
 * Plays every frame in prototype order and loops, as the After delay → Smart animate chain does.
 * Figma tweens between frames; here each frame holds for its transition time (no tween).
 * With "reduce motion" on, it stays on Frame=01.
 */
export function Motion({ name, width, style }: Props) {
  const timings = motion[name];
  const [frame, setFrame] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((on) => alive && setStill(on))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (still) return;
    const t = setTimeout(() => setFrame((f) => (f + 1) % timings.length), timings[frame]);
    return () => clearTimeout(t);
  }, [frame, still, timings]);

  const height = (width * motion.frame[1]) / motion.frame[0];
  return (
    <View pointerEvents="none" style={[{ width, height, overflow: 'hidden' }, style]}>
      <Image
        source={asset.motion[name]}
        style={{ position: 'absolute', top: 0, left: -(still ? 0 : frame) * width, width: width * timings.length, height }}
        contentFit="fill"
      />
    </View>
  );
}
