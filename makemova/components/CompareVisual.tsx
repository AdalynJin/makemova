import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, Text, View } from 'react-native';

import { CrewFigure } from '@/components/CrewFigure';
import { Icon } from '@/components/Icon';
import { easeOut, useEvery, useGlide, useInView, useReducedMotion } from '@/lib/motion';
import { asset } from '@/lib/ui';
import { color, play, size, space } from '@/tokens';

const WIDTH = size.compareSlide;
const clamp = (x: number) => Math.max(0, Math.min(WIDTH, x));

/**
 * Figma: Visual · Compare, revise, reflect (11125:39038). The two frames become one that you drag between
 * v2 and v3; the chips slide to one version, and Versa's eyes follow the line. Arrow keys work too.
 */
export function CompareVisual() {
  const reduced = useReducedMotion();
  const x = useRef(new Animated.Value(WIDTH / 2)).current;
  const at = useRef(WIDTH / 2);
  const [percent, setPercent] = useState(50);
  // The focus ring shows for keys, not while dragging.
  const [ring, setRing] = useState(true);
  const box = useRef<{ measureInWindow: (cb: (x: number) => void) => void } | null>(null);
  const left = useRef(0);

  const look = useRef(new Animated.ValueXY()).current;
  // Versa pulls the line: arm and body follow it, and Versa waves once v3 is chosen.
  const aim = useRef(new Animated.Value(0)).current;
  const lean = useRef(new Animated.Value(0)).current;
  const step = useRef(new Animated.Value(0)).current;
  const last = useRef({ at: WIDTH / 2, time: 0 });
  const chosen = useRef(false);
  const [cheer, setCheer] = useState(0);
  const [idle, setIdle] = useState(0);
  const glide = useGlide([0, 0, 0, 0, 0], ([lookX, lookY, arm, body, side]) => {
    look.setValue({ x: lookX, y: lookY });
    aim.setValue(arm);
    lean.setValue(body);
    step.setValue(side);
  });
  const settle = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(settle.current), []);
  const frame = useRef<unknown>(null);
  const inView = useInView(frame);
  useEvery(play.actEvery, () => setIdle((n) => n + 1), inView && !reduced, play.firstTurn);
  const place = (next: number, slow = false) => {
    const to = clamp(next);
    at.current = to;
    setPercent(Math.round((to / WIDTH) * 100));
    const part = to / WIDTH;
    const gaze = { x: part * 2 * play.eyeReach - play.eyeReach, y: -1 };
    const between = ([a, b]: readonly number[]) => a + (b - a) * part;
    const picked = part * 100 <= play.pickedAt;
    if (picked && !chosen.current) setCheer((n) => n + 1);
    chosen.current = picked;
    if (!reduced) {
      // A quick drag tugs Versa along; the lean settles once the line stops.
      const time = performance.now();
      const speed = ((to - last.current.at) / Math.max(1, time - last.current.time)) * 1000;
      last.current = { at: to, time };
      const tug = slow ? 0 : Math.max(-play.tugMost, Math.min(play.tugMost, speed * play.tug));
      const pose = [gaze.x, gaze.y, between(play.pull), between(play.lean), between(play.step)];
      glide.to(pose.map((v, i) => (i === 3 ? v + tug : v)));
      clearTimeout(settle.current);
      settle.current = setTimeout(() => glide.to(pose), play.look);
    }
    if (slow && !reduced) Animated.timing(x, { toValue: to, duration: play.slide, easing: easeOut, useNativeDriver: false }).start();
    else x.setValue(to);
  };
  const placeRef = useRef(place);
  placeRef.current = place;

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy),
        onPanResponderGrant: (e) => {
          setRing(false);
          const pageX = e.nativeEvent.pageX;
          box.current?.measureInWindow((bx) => {
            left.current = bx;
            placeRef.current(pageX - bx);
          });
        },
        onPanResponderMove: (_, g) => placeRef.current(g.moveX - left.current),
      }),
    [],
  );

  const onKeyDown = (e: { key: string; preventDefault: () => void }) => {
    const step = (WIDTH * play.compareKeyStep) / 100;
    const to =
      e.key === 'ArrowLeft' || e.key === 'ArrowDown'
        ? at.current - step
        : e.key === 'ArrowRight' || e.key === 'ArrowUp'
          ? at.current + step
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? WIDTH
              : null;
    if (to === null) return;
    e.preventDefault();
    setRing(true);
    place(to);
  };

  const shot = { width: WIDTH, height: size.compareSlideHeight };
  const web = { tabIndex: 0, onKeyDown, onBlur: () => setRing(true) } as object;

  return (
    <View ref={frame as never} className="w-visualWidth rounded-32 bg-softPink" style={{ height: size.visualCompareHeight }}>
      <View
        className="rounded-18 border border-border bg-white"
        style={{ position: 'absolute', left: space[40], top: size.compareCardTop, width: size.compareCardWidth, padding: space[12] - 1 }}
      >
        <View
          ref={box as never}
          {...pan.panHandlers}
          {...web}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="Compare v2 and v3"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={`${percent}% v2, ${100 - percent}% v3`}
          className="overflow-hidden"
          style={[shot, { cursor: 'ew-resize', touchAction: 'pan-y', userSelect: 'none', outlineColor: color.ink, ...(ring ? {} : { outlineStyle: 'none' }) } as object]}
        >
          <View pointerEvents="none" style={shot}>
            <Image source={asset.cafe3} style={shot} contentFit="cover" />
            <Animated.View style={{ position: 'absolute', left: 0, top: 0, height: shot.height, width: x, overflow: 'hidden' }}>
              <Image source={asset.cafe2} style={shot} contentFit="cover" />
            </Animated.View>
            <Animated.View
              style={{
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                top: 0,
                left: -size.compareHandle / 2,
                width: size.compareHandle,
                height: shot.height,
                transform: [{ translateX: x }],
              }}
            >
              <View className="bg-ink" style={{ position: 'absolute', top: 0, bottom: 0, width: size.compareLine }} />
              <View
                className="flex-row items-center justify-center rounded-pill bg-ink"
                style={{ width: size.compareHandle, height: size.compareHandle }}
              >
                <View style={{ transform: [{ scaleX: -1 }] }}>
                  <Icon name="arrowRightWhite" size={size.iconXs} />
                </View>
                <Icon name="arrowRightWhite" size={size.iconXs} />
              </View>
            </Animated.View>
          </View>
        </View>
      </View>

      <View
        className="flex-row justify-between"
        style={{ position: 'absolute', left: space[40], top: size.compareChipsTop, width: size.compareCardWidth }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show v2, the alternative"
          accessibilityState={{ selected: percent > 50 }}
          onPress={() => place(WIDTH, true)}
          className="justify-center rounded-pill border-dash border-ink bg-white px-16"
          style={{ height: size.compareChip }}
        >
          <Text className="font-bold text-bodySmall text-ink">v2 · Alternative</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show v3, the chosen version"
          accessibilityState={{ selected: percent < 50 }}
          onPress={() => place(0, true)}
          className="flex-row items-center gap-6 rounded-pill bg-ink px-12"
          style={{ height: size.compareChip }}
        >
          <Image source={asset.chosenMark} style={{ width: size.compareMarkWidth, height: size.compareMarkHeight }} contentFit="contain" />
          <Text className="font-bold text-bodySmall text-white">✓ v3 · chosen</Text>
        </Pressable>
      </View>

      <View
        className="gap-16 rounded-22 bg-white p-24"
        style={{
          position: 'absolute',
          left: space[40],
          top: size.compareLessonTop,
          width: size.compareLesson,
          height: size.compareLessonHeight,
        }}
      >
        <View className="flex-row items-center gap-8">
          <View className="h-16 w-16 rounded-pill bg-opusYellow" />
          <Text className="font-bold text-action text-ink">What I learned</Text>
        </View>
        <Text className="font-medium text-lesson text-ink" style={{ width: size.compareLessonText }}>
          Make the main button stand out and keep the second one quieter.
        </Text>
      </View>
      <Animated.View
        pointerEvents="none"
        style={{ position: 'absolute', left: size.compareVersaLeft, top: size.compareVersaTop, transform: [{ translateX: step }] }}
      >
        <CrewFigure
          crew="versa"
          width={size.compareVersa}
          look={look}
          aim={aim}
          lean={lean}
          turn={cheer + idle}
          hop={cheer}
          gain={play.versaGain}
        />
      </Animated.View>
    </View>
  );
}
