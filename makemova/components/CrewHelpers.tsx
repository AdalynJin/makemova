import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import { CrewCard, type CrewCardProps } from '@/components/CrewCard';
import { gaze, useEvery, useGlide, useInView, usePointerIn, useReducedMotion } from '@/lib/motion';
import { crewArt, play, size, space } from '@/tokens';

const STEP = size.crewCard + space[24];

/**
 * Figma: The crew (11125:39199 – 39447). The four helpers act one after another, never together, and the others watch
 * whoever is acting. Point at a card and they all look your way while that helper shows its job.
 */
export function CrewHelpers({ crew }: { crew: CrewCardProps[] }) {
  const reduced = useReducedMotion();
  const row = useRef<unknown>(null);
  const looks = useRef(crew.map(() => new Animated.ValueXY())).current;
  const pointing = useRef(false);
  const [acting, setActing] = useState(-1);
  const [cues, setCues] = useState(crew.map(() => 0));
  const [hovered, setHovered] = useState(false);

  const glide = useGlide(
    crew.flatMap(() => [0, 0]),
    (at) => looks.forEach((l, i) => l.setValue({ x: at[i * 2], y: at[i * 2 + 1] })),
  );

  const inView = useInView(row);
  useEvery(
    play.turnEvery,
    () => {
      const next = (acting + 1) % crew.length;
      setActing(next);
      setCues((c) => c.map((n, i) => (i === next ? n + 1 : n)));
    },
    inView && !hovered && !reduced,
    play.firstTurn,
  );

  useEffect(() => {
    if (reduced || pointing.current) return;
    glide.to(crew.flatMap((_, i) => (acting < 0 || hovered ? [0, 0] : gaze(i === acting ? null : { dx: (acting - i) * STEP, dy: 0 }))));
  }, [acting, crew, glide, hovered, reduced]);

  usePointerIn(
    row,
    (x, y) => {
      if (reduced) return;
      pointing.current = true;
      glide.to(
        crew.flatMap(({ crew: name, width, left, top }, i) => {
          const face = top + (crewArt[name].box[1] * width) / crewArt[name].box[0] / 2;
          return gaze({ dx: x - (i * STEP + left + width / 2), dy: y - face });
        }),
      );
    },
    () => {
      pointing.current = false;
      glide.to(crew.flatMap(() => [0, 0]));
    },
  );

  return (
    <View ref={row as never} className="flex-row gap-24">
      {crew.map((c, i) => (
        <CrewCard key={c.name} {...c} look={looks[i]} cue={cues[i]} onHover={setHovered} />
      ))}
    </View>
  );
}
