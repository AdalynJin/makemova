import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { CrewFigure, glassHome, type FigureName } from '@/components/CrewFigure';
import { Magnifier } from '@/components/Magnifier';
import { acts, follow } from '@/lib/acts';
import { easeInOut, useReducedMotion } from '@/lib/motion';
import { play, size } from '@/tokens';

export type CrewCardProps = {
  name: string;
  tag: string;
  body: string;
  bg: string;
  light?: boolean;
  shape: number;
  crew: FigureName;
  width: number;
  left: number;
  top: number;
};

type Cue = {
  /** Where the eyes look. */
  look: Animated.ValueXY;
  /** Raise by one to play the character's act. */
  cue: number;
  onHover: (on: boolean) => void;
};

type SceneProps = CrewCardProps & {
  look?: Animated.ValueXY;
  turn?: number;
  hop?: number;
  glassOut?: boolean;
  progress?: Animated.Value;
  onDone?: () => void;
};

const LEVEL = new Animated.Value(0);
const upright = () => 0;

function Scene({ name, tag, body, light, shape, crew, width, left, top, progress = LEVEL, ...figure }: SceneProps) {
  const ink = light ? 'text-white' : 'text-ink';
  // The ink shape tips on its lower point with the character on it.
  const tip = follow(progress, acts[crew].shape ?? upright).interpolate({ inputRange: [-90, 90], outputRange: ['-90deg', '90deg'] });
  return (
    <View className="flex-1 gap-8 p-28">
      <Text className={`font-bold text-crewName ${ink}`}>{name}</Text>
      <Text className={`font-bold text-labelUi ${ink}`}>{tag}</Text>
      <Text className={`pt-8 font-medium text-nav ${ink}`}>{body}</Text>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: size.crewCard,
          height: size.crewCardHeight,
          transformOrigin: '50% 100%',
          transform: [{ rotate: tip }],
        }}
      >
        <Image
          source={shape}
          style={{ position: 'absolute', left: size.crewShapeLeft, top: size.crewShapeTop, width: size.crewShape, height: size.crewShape }}
          contentFit="contain"
          contentPosition="top"
        />
        <CrewFigure crew={crew} width={width} progress={progress} {...figure} style={{ position: 'absolute', left, top }} />
      </Animated.View>
    </View>
  );
}

/**
 * Figma: Crew · <name>. The character does its own job when its turn comes and keeps doing it while you point at the
 * card: Mate waves, Versa weighs two sides, Opus reads. Arti's magnifier comes out and works on the card.
 */
export function CrewCard({ look, cue, onHover, ...card }: CrewCardProps & Cue) {
  const { name, tag, body, bg, crew, width, left, top } = card;
  const reduced = useReducedMotion();
  const box = useRef<unknown>(null);
  const lift = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const over = useRef(false);
  const [own, setOwn] = useState(0);
  const [hop, setHop] = useState(0);
  const [glassOut, setGlassOut] = useState(false);
  const arti = crew === 'arti';
  const act = () => setOwn((n) => n + 1);

  const raise = (up: boolean) => {
    over.current = up;
    onHover(up);
    if (up && !arti) act();
    if (reduced) return;
    Animated.timing(lift, { toValue: up ? -play.lift : 0, duration: play.settle, easing: easeInOut, useNativeDriver: false }).start();
  };

  return (
    <Animated.View style={{ transform: [{ translateY: lift }] }}>
      <Pressable
        ref={box as never}
        accessibilityRole="button"
        accessibilityLabel={`${name}. ${tag.replace(/\s*·\s*/, ', ')}. ${body}`}
        onHoverIn={() => raise(true)}
        onHoverOut={() => raise(false)}
        onFocus={() => raise(true)}
        onBlur={() => raise(false)}
        onPress={() => {
          act();
          setHop((h) => h + 1);
        }}
        className={`w-crewCard h-crewCardHeight overflow-hidden rounded-32 ${bg}`}
        style={{ cursor: glassOut ? 'none' : 'pointer' } as never}
      >
        <Scene
          {...card}
          look={look}
          turn={own + cue}
          hop={hop}
          glassOut={glassOut}
          progress={progress}
          onDone={() => over.current && !arti && act()}
        />
        {arti && (
          <Magnifier
            over={box}
            home={glassHome(width, left, top)}
            radius={size.crewCardLens}
            width={size.crewCard}
            height={size.crewCardHeight}
            bg={bg}
            onOut={setGlassOut}
          >
            <Scene {...card} glassOut />
          </Magnifier>
        )}
      </Pressable>
    </Animated.View>
  );
}
