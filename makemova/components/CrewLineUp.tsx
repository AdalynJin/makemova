import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import { CrewFigure, type FigureName } from '@/components/CrewFigure';
import { gaze, useEvery, useGlide, useInView, usePointerIn, useReducedMotion } from '@/lib/motion';
import { crewArt, play, size, space } from '@/tokens';

const ROW: { crew: FigureName; width: number; left: number; top: number }[] = [
  { crew: 'mate', width: size.lineUpMate, left: size.lineUpMateLeft, top: size.lineUpMateTop },
  { crew: 'opus', width: size.lineUpOpus, left: size.lineUpOpusLeft, top: size.lineUpOpusTop },
  { crew: 'versa', width: size.lineUpVersa, left: size.lineUpVersaLeft, top: size.lineUpVersaTop },
  { crew: 'arti', width: size.lineUpArti, left: size.lineUpArtiLeft, top: size.lineUpArtiTop },
];
const N = ROW.length;
const FROM = ROW.map((_, i) => (i < N / 2 ? -play.strollIn : play.strollIn));
const HOME = ROW.map(() => 0);
const centre = (i: number) => ROW[i].left + ROW[i].width / 2;
const clamp = (v: number, most: number) => Math.max(-most, Math.min(most, v));

/**
 * Figma: Crew line-up (11125:39552), the four v3 characters standing on the footer. They stroll in to their Figma spots,
 * take a few steps now and then, and come a little closer when you point at them. Steps follow the distance covered,
 * so nobody slides.
 */
export function CrewLineUp() {
  const reduced = useReducedMotion();
  const box = useRef<unknown>(null);
  const near = useRef(-1);
  const arrived = useRef(false);
  const turnOf = useRef(0);
  const looks = useRef(ROW.map(() => new Animated.ValueXY())).current;
  const moves = useRef(ROW.map(() => ({ x: new Animated.Value(0), y: new Animated.Value(0), tilt: new Animated.Value(0) }))).current;
  const [turns, setTurns] = useState(ROW.map(() => 0));
  const [pointing, setPointing] = useState(false);

  const eyes = useGlide(
    ROW.flatMap(() => [0, 0]),
    (at) => looks.forEach((l, i) => l.setValue({ x: at[i * 2], y: at[i * 2 + 1] })),
  );
  const walk = useGlide(
    HOME,
    (at, speed) =>
      moves.forEach((m, i) => {
        const effort = Math.min(1, Math.abs(speed[i]) / play.strollSpeed);
        const step = Math.sin((at[i] / play.stride) * Math.PI) * effort;
        m.x.setValue(at[i]);
        m.y.setValue(-Math.abs(step) * play.stepLift);
        m.tilt.setValue(step * play.stepTilt);
      }),
    play.strollGlide,
  );

  const inView = useInView(box);
  useEffect(() => {
    if (!reduced && !arrived.current) walk.jump(FROM);
  }, [reduced, walk]);
  useEffect(() => {
    if (reduced) return walk.jump(HOME);
    if (!inView || arrived.current) return;
    arrived.current = true;
    walk.to(HOME);
  }, [inView, reduced, walk]);

  useEvery(
    play.strollEvery,
    () => {
      const i = turnOf.current % N;
      const back = walk.at.some((v) => Math.abs(v) > 1);
      if (back) return walk.to(HOME);
      turnOf.current += 1;
      walk.to(HOME.map((v, j) => (j === i ? (i < N / 2 ? play.strollIdle : -play.strollIdle) : v)));
      eyes.to(ROW.flatMap((_, j) => gaze(j === i ? { dx: i < N / 2 ? 1 : -1, dy: 0 } : { dx: centre(i) - centre(j), dy: 0 })));
    },
    inView && !pointing && !reduced,
  );

  usePointerIn(
    box,
    (x, y) => {
      if (reduced) return;
      setPointing(true);
      const hit = ROW.findIndex((r, i) => Math.abs(x - centre(i)) < r.width / 2 + space[16]);
      if (hit !== near.current) {
        near.current = hit;
        if (hit >= 0) setTurns((t) => t.map((n, i) => (i === hit ? n + 1 : n)));
      }
      walk.to(ROW.map((_, i) => clamp((x - centre(i)) * play.strollPull, play.strollReach)));
      eyes.to(
        ROW.flatMap((r, i) => {
          const half = (crewArt[r.crew].box[1] * r.width) / crewArt[r.crew].box[0] / 2;
          return gaze({ dx: x - centre(i) - walk.at[i], dy: y - (r.top + half) });
        }),
      );
    },
    () => {
      near.current = -1;
      setPointing(false);
      walk.to(HOME);
      eyes.to(ROW.flatMap(() => [0, 0]));
    },
  );

  return (
    <View ref={box as never} className="mt-44 h-lineUpHeight self-stretch" style={{ marginHorizontal: -space[64] }}>
      {ROW.map((r, i) => (
        <Animated.View
          key={r.crew}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: r.left,
            top: r.top,
            width: r.width,
            height: (crewArt[r.crew].box[1] * r.width) / crewArt[r.crew].box[0],
            transformOrigin: '50% 100%',
            transform: [
              { translateX: moves[i].x },
              { translateY: moves[i].y },
              { rotate: moves[i].tilt.interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] }) },
            ],
          }}
        >
          <CrewFigure crew={r.crew} width={r.width} look={looks[i]} turn={turns[i]} />
        </Animated.View>
      ))}
    </View>
  );
}
