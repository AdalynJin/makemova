import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { asset } from '@/lib/ui';
import { size } from '@/tokens';

export type Tool = 'critique' | 'compare' | 'tutorials';

export const toolCopy: Record<Tool, { name: string; intro: string; meta: string; bg: string; edge: number; wash: number }> = {
  critique: { name: 'Critique', intro: 'Find what to improve.', meta: '5 credits / new run', bg: 'bg-critique', edge: asset.edgeCritique, wash: asset.washCritique },
  compare: { name: 'Compare', intro: 'View versions side by side.', meta: 'Manual comparison · Free', bg: 'bg-compare', edge: asset.edgeCompare, wash: asset.washCompare },
  tutorials: { name: 'Tutorials', intro: 'Learn a tool or principle.', meta: 'Short guides · Free', bg: 'bg-tutorials', edge: asset.edgeTutorials, wash: asset.washTutorials },
};

/** Figma: Mouse enter fires after a 0.12 s delay. */
const HOVER_DELAY_MS = 120;

type Props = { tool: Tool; onPress: () => void; onHover: (hovering: boolean) => void };

/**
 * Figma: Makemova geometric / Tool / <name> · 8.2 icon edge (MOVA · Critique card 11125:42016).
 * 319.4 × 104, 22.3 radius, pattern wash from 111, tool copy at 14.9 left, illustrated edge on the right.
 */
export function MovaToolCard({ tool, onPress, onHover }: Props) {
  const t = toolCopy[tool];
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t.name}. ${t.intro} ${t.meta}`}
      onPress={() => {
        if (timer.current) clearTimeout(timer.current);
        onPress();
      }}
      onHoverIn={() => {
        timer.current = setTimeout(() => onHover(true), HOVER_DELAY_MS);
      }}
      onHoverOut={() => {
        if (timer.current) clearTimeout(timer.current);
        onHover(false);
      }}
      className={`h-toolCardHeight w-toolMovaCard flex-row items-center overflow-hidden rounded-toolMova ${t.bg}`}
      style={{ paddingLeft: size.toolCardLeft }}
    >
      <Image
        source={t.wash}
        style={{ position: 'absolute', left: size.toolWashLeft, top: 0, width: size.toolWash, height: size.toolCardHeight }}
        contentFit="fill"
      />
      <View className="w-toolCopy" style={{ gap: size.toolCopyGap }}>
        <Text className="font-bold text-toolName text-ink">{t.name}</Text>
        <Text className="font-regular text-toolIntro text-ink">{t.intro}</Text>
        <Text className="font-bold text-toolMeta text-ink">{t.meta}</Text>
      </View>
      <Image source={t.edge} style={{ width: size.toolEdgeWidth, height: size.toolCardHeight }} contentFit="fill" />
    </Pressable>
  );
}
