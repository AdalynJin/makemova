import { Image } from 'expo-image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Text, View } from 'react-native';

import { CrewFigure } from '@/components/CrewFigure';
import { gaze, useEvery, useGlide, useInView, usePointerIn, useReducedMotion } from '@/lib/motion';
import { asset } from '@/lib/ui';
import { crewArt, play, size, space } from '@/tokens';

const FACE = size.bringMateLeft + size.bringMate / 2;
const HEIGHT = (crewArt.mate.box[1] * size.bringMate) / crewArt.mate.box[0];
const { start, pace, most, near, rest, point, lean, tilt } = play.bring;
/** Along the card, lean, arm, eyes left to right, eyes up and down. */
const HOME = [0, 0, 0, 0, 0];
const SCREEN = [most, lean, point, play.eyeReach, play.eyeReach / 2];
const READ = [0, -tilt, 0, -play.eyeReach, play.eyeReach];

/**
 * Figma: Visual · Bring your work (11125:38872). Mate brings the work in: walks along the top of the brief, reads it,
 * goes back and points at the screen. Point at the brief and Mate walks over to you; point at the screen and Mate
 * shows it. Steps follow the distance covered.
 */
export function BringVisual() {
  const reduced = useReducedMotion();
  const box = useRef<unknown>(null);
  const arrived = useRef(false);
  const beat = useRef(0);
  const look = useRef(new Animated.ValueXY()).current;
  const body = useRef(new Animated.Value(0)).current;
  const arm = useRef(new Animated.Value(0)).current;
  const down = useRef(new Animated.Value(0)).current;
  const aim = useRef(Animated.add(arm, down)).current;
  const x = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const [turn, setTurn] = useState(0);
  const [pointing, setPointing] = useState(false);

  const walk = useGlide(
    [0],
    ([at], [speed]) => {
      const effort = Math.min(1, Math.abs(speed) / play.strollSpeed);
      const step = Math.sin((at / play.stride) * Math.PI) * effort;
      x.setValue(at);
      // Away from the Figma spot the raised hand stays down, clear of the heading above.
      down.setValue(Math.max(0, Math.min(1, -at / near)) * rest);
      y.setValue(-Math.abs(step) * play.stepLift);
      sway.setValue(step * play.stepTilt);
    },
    play.bring.glide,
  );
  const pose = useGlide(HOME.slice(1), ([to, raise, eyeX, eyeY]) => {
    body.setValue(to);
    arm.setValue(raise);
    look.setValue({ x: eyeX, y: eyeY });
  });
  const go = ([to, leaning, raise, eyeX, eyeY]: number[]) => {
    walk.to([to]);
    pose.to([leaning, raise, eyeX, eyeY]);
  };

  const inView = useInView(box);
  useEffect(() => {
    if (reduced || arrived.current) return;
    walk.jump([start]);
    pose.jump([0, 0, play.eyeReach, 0]);
  }, [reduced, walk, pose]);
  useEffect(() => {
    if (reduced) {
      walk.jump([0]);
      return pose.jump(HOME.slice(1));
    }
    if (!inView || arrived.current) return;
    arrived.current = true;
    walk.to([0]);
    pose.to(HOME.slice(1));
  }, [inView, reduced, walk, pose]);

  useEvery(
    play.actEvery,
    () => {
      beat.current += 1;
      const now = beat.current % 3;
      if (now === 1) return setTurn((n) => n + 1);
      go(now === 2 ? [pace, ...READ.slice(1)] : HOME);
    },
    inView && !pointing && !reduced,
  );

  usePointerIn(
    box,
    (px, py) => {
      if (reduced) return;
      setPointing(true);
      if (px > size.bringShotLeft - space[16]) return go(SCREEN);
      const to = Math.max(start, Math.min(most, px - FACE));
      const [eyeX, eyeY] = gaze({ dx: px - FACE - walk.at[0], dy: py - size.bringMateTop - HEIGHT / 2 });
      go([to, Math.max(-lean, Math.min(lean, (px - FACE - walk.at[0]) * play.bring.follow)), 0, eyeX, eyeY]);
    },
    () => {
      setPointing(false);
      go(HOME);
    },
  );

  return (
    <View ref={box as never} className="w-visualWidth rounded-32 bg-selected" style={{ height: size.visualBringHeight }}>
      <View
        className="rounded-24 bg-white p-24"
        style={{ position: 'absolute', left: space[40], top: space[72], width: size.bringCard, height: size.bringCardHeight }}
      >
        <Text className="font-bold text-bringLabel text-secondaryText">THE BRIEF</Text>
        <Text className="pt-10 font-bold text-bringTitle text-ink" style={{ width: size.bringTitle }}>
          Make pickup the first thing students see.
        </Text>
        <Text className="pt-10 font-regular text-bodyUi text-secondaryText" style={{ width: size.bringBody }}>
          Students order between classes. Pickup has to be obvious, and the menu still easy to find.
        </Text>
        <View className="flex-row gap-8 pt-18">
          <Tag label="Students" width={size.bringTagStudents}>
            <Image source={asset.tagArch} style={{ width: space[14], height: size.bringArch }} contentFit="fill" />
          </Tag>
          <Tag label="Pickup first" width={size.bringTagPickup}>
            <View className="h-14 w-14 rounded-pill bg-opusYellow" />
          </Tag>
          <Tag label="8am rush" width={size.bringTagRush}>
            <Image source={asset.tagTriangle} style={{ width: space[14], height: size.bringTriangle }} contentFit="fill" />
          </Tag>
        </View>
      </View>

      <View
        className="overflow-hidden rounded-12 border border-border bg-white"
        style={{ position: 'absolute', left: size.bringShotLeft, top: space[72], width: size.bringShot, height: size.bringShotHeight }}
      >
        <Image source={asset.cafe1} accessibilityLabel="The café screen, v1" style={{ flex: 1 }} contentFit="cover" />
      </View>
      <View
        className="justify-center rounded-pill border-dash border-ink bg-white px-14"
        style={{ position: 'absolute', left: size.bringShotLeft, top: size.bringFileTop, width: size.bringFile, height: size.compareChip }}
      >
        <Text className="font-bold text-bodySmall text-ink">{'↑  cafe-home-v1.png'}</Text>
      </View>
      <View
        className="flex-row items-center gap-6 rounded-pill bg-ink px-12"
        style={{ position: 'absolute', left: size.bringShotLeft, top: size.bringGoalTop, width: size.bringGoal, height: size.compareChip }}
      >
        <Image source={asset.tagArch} style={{ width: space[14], height: size.bringArch }} contentFit="fill" />
        <Text className="font-bold text-bodySmall text-white">Goal · pickup easy to find</Text>
      </View>
      <Text className="font-bold text-step text-ink" style={{ position: 'absolute', left: space[40], top: size.bringCaptionTop }}>
        Your screen and goal stay side by side
      </Text>

      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: size.bringMateLeft,
          top: size.bringMateTop,
          width: size.bringMate,
          height: HEIGHT,
          transformOrigin: '50% 100%',
          transform: [
            { translateX: x },
            { translateY: y },
            { rotate: sway.interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] }) },
          ],
        }}
      >
        <CrewFigure crew="mate" act="brief" width={size.bringMate} look={look} aim={aim} lean={body} turn={turn} />
      </Animated.View>
    </View>
  );
}

function Tag({ label, width, children }: { label: string; width: number; children: ReactNode }) {
  return (
    <View className="h-30 flex-row items-center gap-6 rounded-pill bg-paper px-12" style={{ width }}>
      {children}
      <Text className="font-medium text-bodySmall text-ink">{label}</Text>
    </View>
  );
}
