import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import { acts, follow } from '@/lib/acts';
import { easeInOut, useReducedMotion } from '@/lib/motion';
import { asset, stickerShadow } from '@/lib/ui';
import { artiGlass, artiShine, crewArt, crewLayers, play } from '@/tokens';

export type FigureName = keyof typeof crewLayers;

type LayersProps = {
  crew: FigureName;
  /** Drawn size of the whole layered art. */
  width: number;
  height: number;
  /** Where the eyes look, in SVG units. */
  look?: Animated.ValueXY;
  /** Degrees the working arm is turned by the visitor, on top of its own action. */
  aim?: Animated.Value;
  /** Degrees the whole character leans, turning on its feet. */
  lean?: Animated.Value;
  /** Raise by one to play the character's own action once. Raised while playing, it is ignored. */
  turn?: number;
  /** Raise by one for a hop. */
  hop?: number;
  /** Arti only: the magnifier has left the hand (Magnifier draws it). */
  glassOut?: boolean;
  /** 0–1 through the current act, for something else that moves with it. */
  progress?: Animated.Value;
  onDone?: () => void;
  style?: object;
};

const ARM = new Set(['arm', 'hand', 'glass', 'glassBack']);
const GLASS = new Set(['glass', 'glassBack']);
const FULL = 360;

type Moving = Animated.Value | ReturnType<typeof Animated.add>;
const degrees = (v: Moving) =>
  (v as Animated.Value).interpolate({ inputRange: [-FULL, FULL], outputRange: [`-${FULL}deg`, `${FULL}deg`] });
const FLAT = () => 0;
const ONE = () => 1;

/** A streak of light crossing a round glass, given as centre and radius in px. */
function Glint({ x, y, r, at }: { x: number; y: number; r: number; at: ReturnType<typeof follow> }) {
  return (
    <View
      style={{ position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r, overflow: 'hidden' }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          left: r / 2,
          top: -r / 2,
          width: r / 2,
          height: r * 3,
          opacity: play.glintOpacity,
          transform: [
            { translateX: at.interpolate({ inputRange: [0, 1], outputRange: [-r * 2.4, r * 2.8] }) },
            { rotate: `${play.glintAngle}deg` },
          ],
        }}
      >
        <View className="flex-1 bg-white" />
      </Animated.View>
    </View>
  );
}

/**
 * Crew v3 in layers, back to front: die-cut edge, arm, body, hand, eyes.
 * Mate waves, Versa weighs two sides, Opus reads, Arti's magnifier grows and catches the light (lib/acts).
 * With "reduce motion" on, the character stays still.
 */
export function CrewLayers({ crew, width, height, look, aim, lean, turn = 0, hop = 0, glassOut, progress, onDone, style }: LayersProps) {
  const reduced = useReducedMotion();
  const own = useRef(new Animated.Value(0)).current;
  const p = progress ?? own;
  const jump = useRef(new Animated.Value(0)).current;
  const still = useRef(new Animated.ValueXY()).current;
  const level = useRef(new Animated.Value(0)).current;
  const playing = useRef(false);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  });

  const act = acts[crew];
  useEffect(() => {
    if (!turn || reduced || playing.current) return;
    playing.current = true;
    p.setValue(0);
    Animated.timing(p, { toValue: 1, duration: act.ms, easing: Easing.linear, useNativeDriver: false }).start(() => {
      playing.current = false;
      p.setValue(0);
      done.current?.();
    });
  }, [turn, reduced, act.ms, p]);

  useEffect(() => {
    if (!hop || reduced) return;
    jump.setValue(0);
    Animated.timing(jump, { toValue: 1, duration: play.crewHop.ms, easing: Easing.linear, useNativeDriver: false }).start(() =>
      jump.setValue(0),
    );
  }, [hop, reduced, jump]);

  const { view, pivot } = crewLayers[crew];
  const scale = width / view[0];
  const rotate = act.arm ? degrees(Animated.add(aim ?? level, follow(p, act.arm))) : null;
  const eyes = look ?? still;
  const eyeX = Animated.add(eyes.x, follow(p, act.eyeX ?? FLAT));
  const eyeY = Animated.add(eyes.y, follow(p, act.eyeY ?? FLAT));
  const { at, y, squash } = play.crewHop;
  const body = {
    transformOrigin: '50% 100%',
    transform: [
      { translateY: jump.interpolate({ inputRange: [...at], outputRange: y.map((v) => v * height), easing: easeInOut }) },
      { rotate: degrees(Animated.add(lean ?? level, follow(p, act.lean ?? FLAT))) },
      { scaleY: jump.interpolate({ inputRange: [...at], outputRange: [...squash], easing: easeInOut }) },
    ],
  };
  const { lens, eye, grip } = artiShine;
  const px = (v: number) => v * scale;

  return (
    <Animated.View pointerEvents="none" style={[{ width, height }, stickerShadow, style, body]}>
      {Object.entries(asset.crewLayers[crew]).map(([name, source]) => {
        const art = <Image source={source as number} style={{ width, height }} contentFit="fill" />;
        const move =
          ARM.has(name) && rotate
            ? {
                transformOrigin: `${(pivot[0] / view[0]) * 100}% ${(pivot[1] / view[1]) * 100}%`,
                transform: [{ rotate }],
              }
            : name === 'eyes'
              ? { transform: [{ translateX: Animated.multiply(eyeX, scale) }, { translateY: Animated.multiply(eyeY, scale) }] }
              : null;
        const glass = GLASS.has(name);
        return (
          <Animated.View key={name} style={[{ position: 'absolute', left: 0, top: 0, width, height, opacity: glassOut && glass ? 0 : 1 }, move]}>
            {glass ? (
              <Animated.View
                style={{
                  width,
                  height,
                  transformOrigin: `${(grip[0] / view[0]) * 100}% ${(grip[1] / view[1]) * 100}%`,
                  transform: [{ scale: follow(p, act.glass ?? ONE) }],
                }}
              >
                {art}
                {name === 'glass' && act.lensGlint && <Glint x={px(lens[0])} y={px(lens[1])} r={px(lens[2])} at={follow(p, act.lensGlint)} />}
              </Animated.View>
            ) : (
              art
            )}
            {name === 'body' && act.eyeGlint && <Glint x={px(eye[0])} y={px(eye[1])} r={px(eye[2])} at={follow(p, act.eyeGlint)} />}
          </Animated.View>
        );
      })}
    </Animated.View>
  );
}

type Props = Omit<LayersProps, 'width' | 'height'> & {
  /** Figma placement frame width, as on Sticker. */
  width: number;
};

/** A sticker that can act. Placed exactly like Sticker: same frame, same overflow. */
export function CrewFigure({ crew, width, style, ...rest }: Props) {
  const { box } = crewArt[crew];
  const { render } = crewLayers[crew];
  const s = width / box[0];
  return (
    <View pointerEvents="none" style={[{ width, height: box[1] * s }, style]}>
      <CrewLayers
        crew={crew}
        width={render[2] * s}
        height={render[3] * s}
        style={{ position: 'absolute', left: render[0] * s, top: render[1] * s }}
        {...rest}
      />
    </View>
  );
}

/** Where Arti holds the magnifier when the figure is placed at (left, top): ring centre and radius, in px. */
export function glassHome(width: number, left: number, top: number) {
  const s = width / crewArt.arti.box[0];
  const { view, render } = crewLayers.arti;
  const k = (render[2] * s) / view[0];
  return {
    x: left + render[0] * s + artiGlass.centre[0] * k,
    y: top + render[1] * s + artiGlass.centre[1] * k,
    radius: artiGlass.radius * k,
  };
}
