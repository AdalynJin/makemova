import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, Text, View, type LayoutChangeEvent } from 'react-native';

import { Button } from '@/components/Button';
import { easeOut, overshoot, useReducedMotion } from '@/lib/motion';
import { asset } from '@/lib/ui';
import { play, puzzleLetters, size } from '@/tokens';

type Name = keyof typeof puzzleLetters;
const NAMES = ['m', 'o', 'v', 'a'] as const;
const H = size.puzzleLetterHeight;

/** Small game under the crew: put m, o, v and a back in order. Drag, tap, or press Enter on a letter. */
export function MovaPuzzle() {
  const reduced = useReducedMotion();
  const [placed, setPlaced] = useState<Record<Name, boolean>>({ m: false, o: false, v: false, a: false });
  const [width, setWidth] = useState<number>(size.puzzle);
  const [hop, setHop] = useState(0);
  const done = reduced || NAMES.every((n) => placed[n]);

  useEffect(() => {
    if (!done || reduced) return;
    const t = setTimeout(() => setHop((h) => h + 1), play.snap);
    return () => clearTimeout(t);
  }, [done, reduced]);

  const k = Math.min(1, width / size.puzzle);
  return (
    <View className="gap-20">
      <View
        onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
        className="self-stretch overflow-hidden rounded-32 bg-white"
        style={{ height: size.puzzleHeight }}
      >
        {NAMES.map((n) => {
          const l = puzzleLetters[n];
          return (
            <Image
              key={n}
              source={asset.letterSlot[n]}
              style={{ position: 'absolute', left: l.left * k, top: size.puzzleTop, width: l.width * k, height: H * k }}
              contentFit="fill"
            />
          );
        })}
        {NAMES.map((n, i) => (
          <Letter
            key={n}
            name={n}
            index={i}
            k={k}
            placed={reduced || placed[n]}
            hop={hop}
            reduced={reduced}
            onPlace={() => setPlaced((p) => ({ ...p, [n]: true }))}
          />
        ))}
      </View>
      <View className="h-controlHeader flex-row items-center gap-20">
        <Text accessibilityLiveRegion="polite" className="font-bold text-h4 text-ink">
          m + o + v + a = mova. You bring the make.
        </Text>
        {!reduced && done && (
          <Button
            label="Mix them up"
            variant="outline"
            size="header"
            onPress={() => setPlaced({ m: false, o: false, v: false, a: false })}
          />
        )}
      </View>
    </View>
  );
}

type LetterProps = {
  name: Name;
  index: number;
  k: number;
  placed: boolean;
  hop: number;
  reduced: boolean;
  onPlace: () => void;
};

function Letter({ name, index, k, placed, hop, reduced, onPlace }: LetterProps) {
  const l = puzzleLetters[name];
  const home = { x: l.left * k, y: size.puzzleTop };
  const loose = { x: l.loose[0] * k, y: l.loose[1] };
  const rest = placed ? home : loose;
  const pos = useRef(new Animated.ValueXY(rest)).current;
  const tilt = useRef(new Animated.Value(placed ? 0 : 1)).current;
  const jump = useRef(new Animated.Value(0)).current;
  const [drag, setDrag] = useState(false);

  const settle = (to: { x: number; y: number }, straight: boolean) => {
    if (reduced) {
      pos.setValue(to);
      tilt.setValue(straight ? 0 : 1);
      return;
    }
    const opts = { duration: play.snap, easing: overshoot, useNativeDriver: false };
    Animated.parallel([
      Animated.timing(pos, { toValue: to, ...opts }),
      Animated.timing(tilt, { toValue: straight ? 0 : 1, ...opts }),
    ]).start();
  };

  useEffect(() => {
    settle(placed ? home : loose, placed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed, k, reduced]);

  useEffect(() => {
    if (!hop || reduced) return;
    const half = play.hop / 2;
    Animated.sequence([
      Animated.delay(index * play.hopStagger),
      Animated.timing(jump, { toValue: -play.hopHeight, duration: half, easing: easeOut, useNativeDriver: false }),
      Animated.timing(jump, { toValue: 0, duration: half, easing: Easing.in(Easing.quad), useNativeDriver: false }),
    ]).start();
  }, [hop, index, jump, reduced]);

  // The responder is made once; it reads the latest values from here.
  const now = useRef({ home, loose, placed, settle, onPlace });
  now.current = { home, loose, placed, settle, onPlace };

  const pan = useMemo(
    () =>
      PanResponder.create({
        // Takes the pointer before the Pressable does, so a drag never counts as a press. Enter still reaches the Pressable.
        onStartShouldSetPanResponderCapture: () => !now.current.placed,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          setDrag(true);
          pos.stopAnimation();
        },
        onPanResponderMove: (_, g) => pos.setValue({ x: now.current.loose.x + g.dx, y: now.current.loose.y + g.dy }),
        onPanResponderRelease: (_, g) => {
          setDrag(false);
          const { home: h, loose: o } = now.current;
          const tapped = Math.hypot(g.dx, g.dy) < play.tapSlop;
          const near = Math.hypot(o.x + g.dx - h.x, o.y + g.dy - h.y) < size.puzzleSnap;
          if (tapped || near) now.current.onPlace();
          else now.current.settle(o, false);
        },
        onPanResponderTerminate: () => {
          setDrag(false);
          now.current.settle(now.current.loose, false);
        },
      }),
    [pos],
  );

  return (
    <Animated.View
      {...pan.panHandlers}
      style={[
        {
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: drag ? 2 : 1,
          transform: [
            { translateX: pos.x },
            { translateY: Animated.add(pos.y, jump) },
            { rotate: tilt.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${l.loose[2]}deg`] }) },
          ],
        },
        { touchAction: placed ? 'auto' : 'none', userSelect: 'none' } as object,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={placed ? `Letter ${name}, in place` : `Letter ${name}. Press Enter to put it in place`}
        accessibilityState={{ disabled: placed }}
        disabled={placed}
        onPress={onPlace}
        style={{ cursor: placed ? 'auto' : drag ? 'grabbing' : 'grab' } as never}
      >
        {/* pointerEvents none: the browser must not start its own image drag. */}
        <View pointerEvents="none">
          <Image source={asset.letter[name]} style={{ width: l.width * k, height: H * k }} contentFit="fill" />
        </View>
      </Pressable>
    </Animated.View>
  );
}
