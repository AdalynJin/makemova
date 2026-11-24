import { useEffect, useRef, useState, type RefObject } from 'react';
import { AccessibilityInfo, Easing, Platform } from 'react-native';

import { play } from '@/tokens';

const [ox1, oy1, ox2, oy2] = play.easeOut;
const [sx1, sy1, sx2, sy2] = play.overshoot;
export const easeOut = Easing.bezier(ox1, oy1, ox2, oy2);
export const easeInOut = Easing.inOut(Easing.sin);
export const overshoot = Easing.bezier(sx1, sy1, sx2, sy2);

/** Follows the system "reduce motion" setting. Read at once on web, so nothing animates before it is known. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((on) => alive && setReduced(on))
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      alive = false;
      sub?.remove();
    };
  }, []);
  return reduced;
}

type Pointed = (x: number, y: number, width: number, height: number) => void;

/** Follows a mouse or pen inside one element (web). Touch is left alone, so the page still scrolls. */
export function usePointerIn(ref: RefObject<unknown>, onMove: Pointed, onLeave: () => void) {
  const now = useRef({ onMove, onLeave });
  useEffect(() => {
    now.current = { onMove, onLeave };
  });
  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (Platform.OS !== 'web' || !el?.addEventListener) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      now.current.onMove(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
    };
    const leave = () => now.current.onLeave();
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [ref]);
}

/** Eye offset, in SVG units, for a pointer at (dx, dy) from the face. Null looks ahead. */
export function gaze(d: { dx: number; dy: number } | null): [number, number] {
  if (!d) return [0, 0];
  const far = Math.hypot(d.dx, d.dy) || 1;
  const k = (Math.min(1, far / play.lookDistance) * play.eyeReach) / far;
  return [d.dx * k, d.dy * k];
}

const LONGEST_FRAME = 0.032;
const STILL = 0.01;

/**
 * Eases numbers toward a target on a critically damped spring, frame by frame: soft to start, soft to stop, and it can
 * be redirected at any moment without a jump. `apply` gets the positions and the speeds.
 */
export function useGlide(start: readonly number[], apply: (at: number[], speed: number[]) => void, pace: number = play.glide) {
  const now = useRef(apply);
  useEffect(() => {
    now.current = apply;
  });
  const [glide] = useState(() => {
    const at = [...start];
    const speed = start.map(() => 0);
    let to = [...start];
    let frame = 0;
    let last = 0;
    const tick = (time: number) => {
      const dt = Math.min(LONGEST_FRAME, (time - last) / 1000);
      last = time;
      const fade = Math.exp(-pace * dt);
      let moving = false;
      at.forEach((x, i) => {
        const off = x - to[i];
        const pull = speed[i] + pace * off;
        at[i] = to[i] + (off + pull * dt) * fade;
        speed[i] = (speed[i] - pace * pull * dt) * fade;
        if (Math.abs(at[i] - to[i]) > STILL || Math.abs(speed[i]) > STILL) moving = true;
        else {
          at[i] = to[i];
          speed[i] = 0;
        }
      });
      frame = moving ? requestAnimationFrame(tick) : 0;
      now.current(at, speed);
    };
    return {
      at,
      to: (next: readonly number[]) => {
        to = [...next];
        if (frame) return;
        last = performance.now();
        frame = requestAnimationFrame(tick);
      },
      jump: (next: readonly number[]) => {
        to = [...next];
        next.forEach((v, i) => {
          at[i] = v;
          speed[i] = 0;
        });
        now.current(at, speed);
      },
      stop: () => {
        cancelAnimationFrame(frame);
        frame = 0;
      },
    };
  });
  useEffect(() => glide.stop, [glide]);
  return glide;
}

/** True while the element is on screen (web). */
export function useInView(ref: RefObject<unknown>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current as Element | null;
    if (Platform.OS !== 'web' || !el || typeof IntersectionObserver === 'undefined') return;
    const seen = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    seen.observe(el);
    return () => seen.disconnect();
  }, [ref]);
  return inView;
}

/** Runs now and then while `on`, and never in a hidden tab. */
export function useEvery(ms: number, run: () => void, on: boolean, first: number = ms) {
  const now = useRef(run);
  useEffect(() => {
    now.current = run;
  });
  useEffect(() => {
    if (!on) return;
    let timer: ReturnType<typeof setTimeout>;
    const next = (wait: number) => {
      timer = setTimeout(() => {
        if (typeof document === 'undefined' || !document.hidden) now.current();
        next(ms);
      }, wait);
    };
    next(first);
    return () => clearTimeout(timer);
  }, [ms, on, first]);
}
