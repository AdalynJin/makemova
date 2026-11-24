import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable } from 'react-native';

import { CrewLayers } from '@/components/CrewFigure';
import { useEvery, useGlide, useInView, useReducedMotion } from '@/lib/motion';
import { crewLayers, play, size } from '@/tokens';

/** Between Mate's lenses, as a share of the art. */
const FACE = [0.502, 0.393];

/**
 * Figma: Hero · Mate looks (interactive) (11523:36622, set 11523:36009).
 * The prototype swaps nine Look variants from hover zones. Here the eyes follow the pointer between those same
 * extremes and the raised arm leans after it. Mate says hi once the title is in and again every few seconds, waves
 * back when the pointer comes close, and hops when pressed.
 */
export function HeroMate() {
  const reduced = useReducedMotion();
  const box = useRef<unknown>(null);
  const look = useRef(new Animated.ValueXY()).current;
  const aim = useRef(new Animated.Value(0)).current;
  const [turn, setTurn] = useState(0);
  const [hop, setHop] = useState(0);
  const wave = () => setTurn((t) => t + 1);

  const glide = useGlide([0, 0, 0], ([x, y, arm]) => {
    look.setValue({ x, y });
    aim.setValue(arm);
  });
  const inView = useInView(box);
  useEvery(play.hiEvery, wave, inView && !reduced, play.helloDelay);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || reduced) return;
    const scale = size.heroMateArt / crewLayers.mate.view[0];
    let frame = 0;
    let inside = false;
    const to = (x: number, y: number, arm = 0) => glide.to([x / scale, y / scale, arm]);
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = box.current as HTMLElement | null;
        const hero = el?.parentElement;
        if (!el || !hero) return;
        const h = hero.getBoundingClientRect();
        if (e.clientX < h.left || e.clientX > h.right || e.clientY < h.top || e.clientY > h.bottom) {
          if (inside) to(0, 0);
          inside = false;
          return;
        }
        inside = true;
        const m = el.getBoundingClientRect();
        const dx = e.clientX - (m.left + m.width * FACE[0]);
        const dy = e.clientY - (m.top + m.height * FACE[1]);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / play.lookDistance);
        const arm = Math.max(-1, Math.min(1, dx / play.aimReach)) * play.aimHero;
        to((play.lookBase[0] + (dx / d) * play.lookReach[0]) * k, (play.lookBase[1] + (dy / d) * play.lookReach[1]) * k, arm);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      inside = false;
      to(0, 0);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [glide, reduced]);

  return (
    <Pressable
      ref={box as never}
      accessibilityRole="button"
      accessibilityLabel="Say hi to Mate"
      onHoverIn={wave}
      onPress={() => {
        wave();
        setHop((h) => h + 1);
      }}
      style={{
        position: 'absolute',
        left: size.heroMateArtLeft,
        top: size.heroMateArtTop,
        width: size.heroMateArt,
        height: size.heroMateArtHeight,
      }}
    >
      <CrewLayers crew="mate" width={size.heroMateArt} height={size.heroMateArtHeight} look={look} aim={aim} turn={turn} hop={hop} />
    </Pressable>
  );
}
