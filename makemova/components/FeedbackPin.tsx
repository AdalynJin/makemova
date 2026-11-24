import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View, type DimensionValue } from 'react-native';

import { asset } from '@/lib/ui';
import { easeInOut, easeOut, useReducedMotion } from '@/lib/motion';
import { color, feedbackPinArt as art, play } from '@/tokens';

type Props = {
  number: number;
  title: string;
  body: string;
  /** Figma property Side: where the card opens. */
  side?: 'left' | 'right';
  /** Figma property State. Uncontrolled: hover or click opens it. */
  state?: 'closed' | 'open';
  /** Position of the 32 × 32 pin frame on the drawn screen: px, or a share of it ("22%"). */
  left: DimensionValue;
  top: DimensionValue;
};

const box = (r: readonly number[]) => ({ position: 'absolute' as const, left: r[0], top: r[1], width: r[2], height: r[3] });

/**
 * Figma: Makemova / Feedback pin / Versa (11125:65033). Versa stands on the critiqued screen holding the
 * feedback number. Prototype: While hovering or On click → State=Open, Smart animate 420 ms: a pink shell
 * grows out from behind Versa's head into the "AI feedback · this version" card. Mouse leave (after 120 ms)
 * or click → State=Closed, 280 ms. While closed, Versa bobs and tips, each pin a beat after the last.
 */
export function FeedbackPin({ number, title, body, side = 'right', state, left, top }: Props) {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = state ? state === 'open' : hover || pinned;

  const grow = useRef(new Animated.Value(open ? 1 : 0)).current;
  const idle = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;
  const leave = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) {
      grow.setValue(open ? 1 : 0);
      return;
    }
    const run = Animated.timing(grow, {
      toValue: open ? 1 : 0,
      duration: open ? play.pinOpen : play.pinClose,
      easing: easeOut,
      useNativeDriver: false,
    });
    run.start();
    Animated.sequence([
      Animated.timing(hop, { toValue: open ? 1 : 0, duration: play.hover, easing: easeOut, useNativeDriver: false }),
    ]).start();
    return () => run.stop();
  }, [open, reduced, grow, hop]);

  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(((number - 1) * play.pinIdleStagger) % play.pinIdle),
        Animated.timing(idle, { toValue: 1, duration: play.pinIdle / 2, easing: easeInOut, useNativeDriver: false }),
        Animated.timing(idle, { toValue: 0, duration: play.pinIdle / 2, easing: easeInOut, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, number, idle]);

  useEffect(() => () => {
    if (leave.current) clearTimeout(leave.current);
  }, []);

  const shellOpen = side === 'right' ? art.shellRight : art.shellLeft;
  const belly = side === 'right' ? art.bellyRight : art.bellyLeft;
  const lerp = (i: number) => grow.interpolate({ inputRange: [0, 1], outputRange: [art.shellClosed[i], shellOpen[i]] });
  const fade = grow.interpolate({ inputRange: [0, 0.35, 1], outputRange: [0, 1, 1] });
  const words = grow.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] });
  const rise = Animated.add(
    idle.interpolate({ inputRange: [0, 1], outputRange: [0, -play.pinIdleRise] }),
    hop.interpolate({ inputRange: [0, 1], outputRange: [0, -play.pinHop] }),
  );
  const tip = idle.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${play.pinIdleTip}deg`] });

  return (
    <View
      style={{ position: 'absolute', left, top, width: art.badge[0] * 4, height: art.badge[0] * 4, zIndex: open ? 3 : 2 }}
      pointerEvents="box-none"
    >
      {/* Critique / Character shell: grows from behind Versa's head into the card. */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: lerp(0),
          top: lerp(1),
          width: lerp(2),
          height: lerp(3),
          opacity: fade,
          borderRadius: art.shellRadius,
          backgroundColor: color.versaPink,
        }}
      />
      {/* Character / Neck */}
      <Animated.View
        pointerEvents="none"
        style={[box(art.neck), { opacity: fade, borderRadius: art.neckRadius, backgroundColor: color.versaPink }]}
      />
      {/* Feedback / Belly */}
      <Animated.View
        pointerEvents={open ? 'auto' : 'none'}
        accessibilityElementsHidden={!open}
        importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
        style={[
          box(belly),
          { opacity: words, borderRadius: art.bellyRadius, padding: art.bellyPadding, gap: art.bellyGap, backgroundColor: color.white },
        ]}
      >
        <Text className="font-semibold text-pinSource text-secondaryText">AI FEEDBACK · THIS VERSION</Text>
        <Text className="font-medium text-labelUi text-ink">{title}</Text>
        <Text className="font-regular text-bodySmall text-ink">{body}</Text>
      </Animated.View>

      {/* Character / Versa sticker with Feedback / Number badge on its body. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Feedback ${number}: ${title}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setPinned(!pinned)}
        onHoverIn={() => {
          if (leave.current) clearTimeout(leave.current);
          setHover(true);
        }}
        onHoverOut={() => {
          leave.current = setTimeout(() => setHover(false), play.pinLeaveDelay);
        }}
        style={box(art.sticker)}
      >
        <Animated.View style={{ flex: 1, transform: [{ translateY: rise }, { rotate: tip }] }}>
          <Image source={asset.crewV3.versa} style={box(art.art)} contentFit="fill" />
          <View
            style={[box(art.badge), { borderRadius: art.badgeRadius }]}
            className="items-center justify-center border border-versaPink bg-white"
          >
            <Text className="font-medium text-pinNumber text-ink">{number}</Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}
