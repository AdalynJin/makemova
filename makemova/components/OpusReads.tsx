import { useRef, useState } from 'react';
import { View } from 'react-native';

import { CrewFigure } from '@/components/CrewFigure';
import { useEvery, useInView, useReducedMotion } from '@/lib/motion';
import { crewArt, play, size } from '@/tokens';

const height = (crewArt.opus.box[1] * size.examplePreviewOpus) / crewArt.opus.box[0];

/** Figma: Example project · Opus, reading on the versions card's top edge. Reads on now and then. */
export function OpusReads() {
  const reduced = useReducedMotion();
  const box = useRef<unknown>(null);
  const [turn, setTurn] = useState(0);
  const inView = useInView(box);
  useEvery(play.idleEvery, () => setTurn((n) => n + 1), inView && !reduced, play.firstTurn);
  return (
    <View
      ref={box as never}
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: size.examplePreviewOpusLeft,
        top: size.examplePreviewOpusTop,
        width: size.examplePreviewOpus,
        height,
      }}
    >
      <CrewFigure crew="opus" width={size.examplePreviewOpus} turn={turn} />
    </View>
  );
}
