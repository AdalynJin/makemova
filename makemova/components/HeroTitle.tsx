import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

import { easeOut, useReducedMotion } from '@/lib/motion';
import { play, size, space } from '@/tokens';

const LINES = [['Learn', 'design'], ['by', 'making'], ['decisions']];
const WORDS = LINES.flat();

/**
 * Figma: Homepage v3 hero title. The words rise one by one, then the yellow highlight draws under "decisions"
 * Plays once. Read as one heading. With "reduce motion" on, it is simply there.
 */
export function HeroTitle() {
  const reduced = useReducedMotion();
  const words = useRef(WORDS.map(() => new Animated.Value(reduced ? 1 : 0))).current;
  const mark = useRef(new Animated.Value(reduced ? 1 : 0)).current;

  useEffect(() => {
    if (reduced) {
      words.forEach((w) => w.setValue(1));
      mark.setValue(1);
      return;
    }
    const run = Animated.parallel([
      Animated.stagger(
        play.wordStagger,
        words.map((w) => Animated.timing(w, { toValue: 1, duration: play.words, easing: easeOut, useNativeDriver: false })),
      ),
      Animated.timing(mark, { toValue: 1, duration: play.highlight, delay: play.highlightDelay, easing: easeOut, useNativeDriver: false }),
    ]);
    run.start();
    return () => run.stop();
  }, [reduced, words, mark]);

  const word = (text: string, last: boolean) => {
    const v = words[WORDS.indexOf(text)];
    return (
      <Animated.View
        key={text}
        style={{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [play.wordRise, 0] }) }] }}
      >
        <Text className="font-bold text-hero text-ink">{last ? text : `${text} `}</Text>
      </Animated.View>
    );
  };

  return (
    <View accessible accessibilityRole="header" accessibilityLabel="Learn design by making decisions">
      <View aria-hidden importantForAccessibility="no-hide-descendants">
        {LINES.map((line, l) => (
          <View key={line[0]} className="flex-row self-start">
            {l === LINES.length - 1 && (
              <Animated.View
                style={{
                  position: 'absolute',
                  left: -space[10],
                  right: -space[10],
                  top: space[14],
                  height: size.highlightHeight,
                  transformOrigin: 'left',
                  transform: [{ scaleX: mark }],
                }}
              >
                <View className="flex-1 rounded-18 bg-opusYellow" />
              </Animated.View>
            )}
            {line.map((text, i) => word(text, i === line.length - 1))}
          </View>
        ))}
      </View>
    </View>
  );
}
