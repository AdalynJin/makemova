import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import { CrewFigure } from '@/components/CrewFigure';
import { gaze, useEvery, useGlide, useInView, usePointerIn, useReducedMotion } from '@/lib/motion';
import { asset } from '@/lib/ui';
import { crewArt, play, radius, size } from '@/tokens';

const height = (crewArt.opus.box[1] * size.examplePreviewOpus) / crewArt.opus.box[0];
const face = { x: size.examplePreviewOpusLeft + size.examplePreviewOpus / 2, y: size.examplePreviewOpusTop + height / 2 };

/**
 * Figma: Versions preview (11125:39124), Opus reading on its top edge. Opus sways along the lines, turns a page and has
 * an "aha" now and then, and looks up from the book at whatever you point at.
 */
export function VersionsCard() {
  const reduced = useReducedMotion();
  const box = useRef<unknown>(null);
  const look = useRef(new Animated.ValueXY()).current;
  const lean = useRef(new Animated.Value(0)).current;
  const pointing = useRef(false);
  const [turn, setTurn] = useState(0);
  const inView = useInView(box);
  useEvery(play.actEvery, () => setTurn((n) => n + 1), inView && !reduced, play.firstTurn);

  const glide = useGlide([0, 0, 0], ([eyeX, eyeY, to]) => {
    look.setValue({ x: eyeX, y: eyeY });
    lean.setValue(to);
  });
  usePointerIn(
    box,
    (x, y) => {
      if (reduced) return;
      if (!pointing.current) setTurn((n) => n + 1);
      pointing.current = true;
      const d = { dx: x - face.x, dy: y - face.y };
      glide.to([...gaze(d), Math.max(-1, Math.min(1, d.dx / size.versionsPreview)) * play.opusLean]);
    },
    () => {
      pointing.current = false;
      glide.to([0, 0, 0]);
    },
  );

  return (
    <View ref={box as never} className="w-versionsPreview h-versionsPreviewHeight overflow-visible rounded-28 bg-white">
      <Image
        source={asset.versionsPreview}
        accessibilityLabel="Versions v1, v2 and v3, with v3 saved revision open"
        style={{ width: size.versionsPreview, height: size.versionsPreviewHeight, borderRadius: radius[28] }}
        contentFit="fill"
      />
      <CrewFigure
        crew="opus"
        width={size.examplePreviewOpus}
        look={look}
        lean={lean}
        turn={turn}
        gain={play.opusGain}
        style={{ position: 'absolute', left: size.examplePreviewOpusLeft, top: size.examplePreviewOpusTop }}
      />
    </View>
  );
}
