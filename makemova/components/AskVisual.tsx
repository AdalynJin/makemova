import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { CrewFigure, glassHome } from '@/components/CrewFigure';
import { Magnifier } from '@/components/Magnifier';
import { easeOut, useEvery, useGlide, useInView, useReducedMotion } from '@/lib/motion';
import { asset } from '@/lib/ui';
import { play, radius, size, space } from '@/tokens';

const byKeyboard = (e: unknown) => {
  const el = (e as { target?: { matches?: (s: string) => boolean } }).target;
  return el?.matches ? el.matches(':focus-visible') : true;
};

const HOME = glassHome(size.askArti, size.askArtiLeft, size.askArtiTop);
const ORDER = {
  x: size.askShotLeft + size.askRingLeft + size.askRing / 2,
  y: size.askShotTop + size.askRingTop + size.askRingHeight / 2,
};
const shot = { width: size.askShot, height: size.askShotHeight };

/** The same scene under the glass, without the parts that respond. */
function Under({ found }: { found: boolean }) {
  return (
    <View className="bg-softBlue" style={{ width: size.visualWidth, height: size.visualAskHeight }}>
      <View
        className="rounded-20 border border-border bg-white p-14"
        style={{ position: 'absolute', left: size.askCardLeft, top: size.askCardTop, width: size.askCard, height: size.askCardHeight }}
      >
        <View style={shot}>
          <Image source={asset.cafe2} style={shot} contentFit="cover" />
          {found && (
            <View style={{ position: 'absolute', left: size.askRingLeft - space[4], top: size.askRingTop - space[4] }}>
              <Ring />
            </View>
          )}
        </View>
      </View>
      <View
        className="rounded-20 bg-white p-18"
        style={{ position: 'absolute', left: size.askNoteLeft, top: size.askNoteTop, width: size.askNote, height: size.askNoteHeight }}
      >
        <NoteText />
      </View>
      <Caption />
      <CrewFigure crew="arti" width={size.askArti} glassOut style={{ position: 'absolute', left: size.askArtiLeft, top: size.askArtiTop }} />
    </View>
  );
}

function Ring() {
  return (
    <View
      className="rounded-pill border-focus border-artiBlue"
      style={{ width: size.askRing + space[8], height: size.askRingHeight + space[8] }}
    />
  );
}

function Caption() {
  return (
    <Text className="font-bold text-step text-ink" style={{ position: 'absolute', left: size.askCardLeft, top: size.askCaptionTop }}>
      Feedback is pinned to what is visible
    </Text>
  );
}

function NoteText() {
  return (
    <>
      <Text className="font-bold text-askTitle text-ink">Does pickup stand out?</Text>
      <View className="flex-row items-center gap-8 pt-14">
        <View className="items-center justify-center rounded-pill bg-ink" style={{ width: size.askNoteMark, height: size.askNoteMark }}>
          <Text className="font-bold text-category text-white">1</Text>
        </View>
        <Text className="font-bold text-step text-ink">Pickup reads first.</Text>
      </View>
      <Text className="pt-16 font-regular text-labelUi text-secondaryText">
        “Order pickup” is the only filled button, so it reads first. Is “View menu” still easy to find?
      </Text>
      <View className="mt-14 h-30 self-start justify-center rounded-pill bg-opusYellow px-12">
        <Text className="font-bold text-category text-ink">You decide what to change</Text>
      </View>
    </>
  );
}

/**
 * Figma: Visual · Ask about one decision (11125:38958).
 * Arti's magnifier leaves the hand, follows the mouse and magnifies the screen. Over "Order pickup" it finds
 * something: the rest dims, a blue ring draws round the button and Arti hops. The pin and the note do the same
 * on hover, focus or tap, with the glass held over the button.
 */
export function AskVisual() {
  const reduced = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [found, setFound] = useState(false);
  const [mouse, setMouse] = useState(false);
  const [glassOut, setGlassOut] = useState(false);
  const [hop, setHop] = useState(0);
  const on = pinned || found;
  const box = useRef<unknown>(null);
  const aim = useRef(new Animated.Value(0)).current;
  const glide = useGlide([0], ([deg]) => aim.setValue(deg));
  const [turn, setTurn] = useState(0);
  const inView = useInView(box);
  useEvery(play.idleEvery, () => setTurn((n) => n + 1), inView && !glassOut && !reduced, play.firstTurn);
  const hovered = useRef(false);
  const t = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  const hover = (next: boolean) => {
    hovered.current = next;
    setPinned(next);
  };

  useEffect(() => {
    const go = (v: Animated.Value, duration: number) =>
      Animated.timing(v, { toValue: on ? 1 : 0, duration: reduced ? 0 : duration, easing: easeOut, useNativeDriver: false });
    const run = Animated.parallel([go(t, play.settle), go(ring, on ? play.ring : play.hover)]);
    run.start();
    return () => run.stop();
  }, [on, reduced, ring, t]);

  useEffect(() => {
    if (on) setHop((n) => n + 1);
  }, [on]);

  const look = ({ x, y }: { x: number; y: number }) => {
    setMouse(true);
    const dx = Math.max(0, Math.abs(x - ORDER.x) - size.askRing / 2);
    const dy = Math.max(0, Math.abs(y - ORDER.y) - size.askRingHeight / 2);
    setFound(Math.hypot(dx, dy) < play.findSlop);
    // The empty hand points after the glass.
    if (!reduced) glide.to([Math.max(-1, Math.min(1, (y - HOME.y) / size.visualAskHeight)) * play.aimArti]);
  };
  const leave = () => {
    setMouse(false);
    setFound(false);
    glide.to([0]);
  };

  return (
    <View
      ref={box as never}
      className="w-visualWidth rounded-32 bg-softBlue"
      style={{ height: size.visualAskHeight, cursor: mouse ? 'none' : 'auto' } as never}
    >
      <View
        className="overflow-hidden rounded-20 border border-border bg-white p-14"
        style={{ position: 'absolute', left: size.askCardLeft, top: size.askCardTop, width: size.askCard, height: size.askCardHeight }}
      >
        <View style={shot}>
          <Animated.View style={{ opacity: t.interpolate({ inputRange: [0, 1], outputRange: [1, play.dim] }) }}>
            <Image
              source={asset.cafe2}
              accessibilityLabel="The café screen, v2, with an Order pickup button"
              style={shot}
              contentFit="cover"
            />
          </Animated.View>
          {/* "Order pickup" keeps its full strength while the rest dims. */}
          <View
            style={{
              position: 'absolute',
              left: size.askRingLeft,
              top: size.askRingTop,
              width: size.askRing,
              height: size.askRingHeight,
              borderRadius: radius.pill,
              overflow: 'hidden',
            }}
          >
            <Image source={asset.cafe2} style={{ ...shot, position: 'absolute', left: -size.askRingLeft, top: -size.askRingTop }} contentFit="cover" />
          </View>
          <Animated.View
            style={{
              position: 'absolute',
              left: size.askRingLeft - space[4],
              top: size.askRingTop - space[4],
              width: ring.interpolate({ inputRange: [0, 1], outputRange: [0, size.askRing + space[8]] }),
              height: size.askRingHeight + space[8],
              overflow: 'hidden',
            }}
          >
            <Ring />
          </Animated.View>
        </View>
      </View>

      <Pressable
        tabIndex={-1}
        accessible={false}
        onHoverIn={() => hover(true)}
        onHoverOut={() => hover(false)}
        className="rounded-20 bg-white p-18"
        style={{ position: 'absolute', left: size.askNoteLeft, top: size.askNoteTop, width: size.askNote, height: size.askNoteHeight, cursor: mouse ? 'none' : 'auto' } as never}
      >
        <NoteText />
      </Pressable>
      <Caption />
      <CrewFigure
        crew="arti"
        width={size.askArti}
        glassOut={glassOut}
        aim={aim}
        turn={turn}
        hop={hop}
        style={{ position: 'absolute', left: size.askArtiLeft, top: size.askArtiTop }}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show what this feedback refers to"
        accessibilityState={{ expanded: on }}
        onHoverIn={() => hover(true)}
        onHoverOut={() => hover(false)}
        onFocus={(e) => byKeyboard(e) && setPinned(true)}
        onBlur={() => !hovered.current && setPinned(false)}
        onPress={() => !hovered.current && setPinned(!on)}
        className="items-center justify-center rounded-pill"
        style={{ position: 'absolute', left: size.askPinLeft, top: size.askPinTop, width: size.askPinTarget, height: size.askPinTarget, cursor: mouse ? 'none' : 'pointer' } as never}
      >
        <Animated.View style={{ transform: [{ scale: t.interpolate({ inputRange: [0, 1], outputRange: [1, play.pinScale] }) }] }}>
          <View className="items-center justify-center rounded-pill bg-ink" style={{ width: size.askPin, height: size.askPin }}>
            <Text className="font-bold text-caption text-white">1</Text>
          </View>
        </Animated.View>
      </Pressable>
      <Magnifier
        over={box}
        home={HOME}
        radius={size.askLens}
        width={size.visualWidth}
        height={size.visualAskHeight}
        bg="bg-softBlue"
        target={pinned && !mouse ? ORDER : null}
        onMove={look}
        onLeave={leave}
        onOut={setGlassOut}
        swell={on}
      >
        <Under found={on} />
      </Magnifier>
    </View>
  );
}
