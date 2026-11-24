import { Image } from 'expo-image';
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Animated, View } from 'react-native';

import { easeInOut, useGlide, usePointerIn, useReducedMotion } from '@/lib/motion';
import { asset, stickerShadow } from '@/lib/ui';
import { artiGlass, play } from '@/tokens';

type Point = { x: number; y: number };

type Props = {
  /** The element the glass works over. Its box and this component's parent must be the same. */
  over: RefObject<unknown>;
  /** Arti's hand, from glassHome. */
  home: Point & { radius: number };
  radius: number;
  width: number;
  height: number;
  /** Background colour class behind the magnified copy. */
  bg: string;
  /** Holds the glass here when there is no mouse (keyboard or touch). */
  target?: Point | null;
  onMove?: (p: Point) => void;
  onLeave?: () => void;
  /** Grows a little, because it found something. */
  swell?: boolean;
  /** True from the moment the glass leaves Arti's hand until it is back. */
  onOut: (out: boolean) => void;
  /** A copy of what is under the glass. Never read aloud, never pressed. */
  children: ReactNode;
};

/**
 * Arti's magnifier (Sticker v3 · Arti, split into layers). It leaves Arti's hand, follows the mouse and really
 * magnifies what is under it, then flies home. With "reduce motion" on it appears and goes without the flight.
 */
export function Magnifier({ over, home, radius, width, height, bg, target, onMove, onLeave, onOut, swell = false, children }: Props) {
  const reduced = useReducedMotion();
  const at = useRef(new Animated.ValueXY({ x: home.x, y: home.y })).current;
  const t = useRef(new Animated.Value(0)).current;
  const grow = useRef(new Animated.Value(1)).current;
  const follow = useGlide([home.x, home.y], ([x, y]) => at.setValue({ x, y }), play.lensGlide);
  const growth = useGlide([1], ([v]) => grow.setValue(v));
  const going = useRef(false);
  const mouse = useRef(false);
  const [shown, setShown] = useState(false);

  const leaveHand = () => {
    if (going.current) return;
    going.current = true;
    setShown(true);
    onOut(true);
    if (reduced) return t.setValue(1);
    Animated.timing(t, { toValue: 1, duration: play.lensFly, easing: easeInOut, useNativeDriver: false }).start();
  };
  const goHome = () => {
    if (!going.current) return;
    going.current = false;
    const back = () => {
      if (going.current) return;
      setShown(false);
      onOut(false);
    };
    if (reduced) {
      t.setValue(0);
      return back();
    }
    Animated.timing(t, { toValue: 0, duration: play.lensFly, easing: easeInOut, useNativeDriver: false }).start(back);
  };

  usePointerIn(
    over,
    (x, y) => {
      mouse.current = true;
      // Already out: glide after the mouse. Still in the hand: fly straight to it.
      if (going.current && !reduced) follow.to([x, y]);
      else follow.jump([x, y]);
      leaveHand();
      onMove?.({ x, y });
    },
    () => {
      mouse.current = false;
      goHome();
      onLeave?.();
    },
  );

  const tx = target?.x;
  const ty = target?.y;
  useEffect(() => {
    if (mouse.current) return;
    if (tx === undefined || ty === undefined) return goHome();
    follow.jump([tx, ty]);
    leaveHand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx, ty]);

  useEffect(() => {
    if (reduced) growth.jump([swell ? 1 + play.swell : 1]);
    else growth.to([swell ? 1 + play.swell : 1]);
  }, [growth, reduced, swell]);

  if (!shown) return null;
  const k = radius / artiGlass.radius;
  const art = {
    position: 'absolute',
    left: radius - artiGlass.inset * k,
    top: radius - artiGlass.inset * k,
    width: artiGlass.box * k,
    height: artiGlass.box * k,
  } as const;
  const between = (from: number, to: Animated.Value) => Animated.add(Animated.multiply(Animated.subtract(to, from), t), from - radius);
  const under = (v: Animated.Value) => Animated.add(Animated.multiply(v, -play.lensZoom), radius);
  return (
    <Animated.View
      aria-hidden
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 3,
          width: radius * 2,
          height: radius * 2,
          transform: [
            { translateX: between(home.x, at.x) },
            { translateY: between(home.y, at.y) },
            { scale: Animated.multiply(t.interpolate({ inputRange: [0, 1], outputRange: [home.radius / radius, 1] }), grow) },
          ],
        },
        stickerShadow,
      ]}
    >
      <Image source={asset.lens.back} style={art} contentFit="fill" />
      <View className={`overflow-hidden rounded-pill ${bg}`} style={{ width: radius * 2, height: radius * 2 }}>
        <Animated.View
          style={{
            width,
            height,
            transformOrigin: '0% 0%',
            transform: [{ translateX: under(at.x) }, { translateY: under(at.y) }, { scale: play.lensZoom }],
          }}
        >
          {children}
        </Animated.View>
      </View>
      <Image source={asset.lens.ring} style={art} contentFit="fill" />
      <Animated.View style={[art, { opacity: t.interpolate({ inputRange: [0, 1], outputRange: [1, 0], extrapolate: 'clamp' }) }]}>
        <Image source={asset.lens.marks} style={{ width: art.width, height: art.height }} contentFit="fill" />
      </Animated.View>
    </Animated.View>
  );
}
