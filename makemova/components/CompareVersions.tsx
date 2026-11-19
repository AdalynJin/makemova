import { Image, type ImageSource } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { ChooseVersion, type VersionOption } from '@/components/ChooseVersion';
import { size } from '@/tokens';

export type CompareVersion = VersionOption & { source: ImageSource | number | null };

type Props = {
  versions: CompareVersion[];
  initialA: number;
  initialB: number;
  onUse: (number: number) => void;
  onExit: () => void;
};

/** Secondary S drawn at the comparison's 560 / 644 scale ("Action · Change", "Action · Use v1"). */
function CompareAction({ label, full, onPress }: { label: string; full?: boolean; onPress: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      className={`items-center justify-center rounded-pill border-secondaryText ${hover ? 'bg-paper' : 'bg-white'} ${
        full ? 'self-stretch' : 'w-compareChange'
      }`}
      style={{ height: size.compareControl, borderWidth: size.compareStroke, paddingHorizontal: size.comparePad }}
    >
      <Text className="font-semibold text-compareLabel text-ink">{label}</Text>
    </Pressable>
  );
}

/**
 * Figma: Compare versions · Selection only (11125:41951), shown when Compare is pressed in Tools.
 * Prototype: Change → R5 · Choose A / B; Use vN → Explain your choice; Exit comparison → back to Make with tools open.
 */
export function CompareVersions({ versions, initialA, initialB, onUse, onExit }: Props) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [choosing, setChoosing] = useState<'A' | 'B' | null>(null);

  const column = (side: 'A' | 'B', n: number) => {
    const v = versions.find((x) => x.number === n);
    return (
      <View className="w-compareColumn" style={{ gap: size.compareGap }}>
        <View className="flex-row items-center" style={{ gap: size.compareGap }}>
          <Text className="flex-1 font-medium text-compareLabel text-ink">
            {side} · v{n}
          </Text>
          <CompareAction label="Change" onPress={() => setChoosing(side)} />
        </View>
        <View
          className="h-compareFrameHeight rounded-compareFrame bg-paper"
          style={{ padding: size.comparePad }}
        >
          {v?.source ? (
            <Image source={v.source} style={{ width: size.compareShot, height: size.compareShotHeight }} contentFit="cover" />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="font-regular text-bodySmall text-secondaryText">Add another screenshot to compare.</Text>
            </View>
          )}
        </View>
        {v && <CompareAction label={`Use v${n}`} full onPress={() => onUse(n)} />}
      </View>
    );
  };

  return (
    <View className="w-compareMode gap-16">
      <View className="flex-row items-center gap-12">
        <Text className="flex-1 font-semibold text-cardTitle text-ink">Compare versions.</Text>
        <Button label="Exit comparison" variant="secondary" size="sm" width={size.compareExit} onPress={onExit} />
      </View>
      <View className="flex-row gap-24">
        {column('A', a)}
        {column('B', b)}
      </View>
      <Text className="font-regular text-bodySmall text-secondaryText">Pick a version to revise.</Text>

      <ChooseVersion
        side={choosing}
        options={versions}
        onChoose={(n) => {
          if (choosing === 'A') setA(n);
          else setB(n);
          setChoosing(null);
        }}
        onClose={() => setChoosing(null)}
      />
    </View>
  );
}
