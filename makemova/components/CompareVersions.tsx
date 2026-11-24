import type { ImageSource } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { VersionPreview } from '@/components/VersionPreview';
import { size } from '@/tokens';

export type CompareVersion = { number: number; name: string; file: string; source: ImageSource | number | null };

type Props = {
  versions: CompareVersion[];
  /** Left: the current version. */
  a: number;
  /** Right: the version it is compared with, or null for the empty "Add a version" slot. */
  b: number | null;
  /** Change on either side, or the empty slot: opens Own project · Add a version. */
  onChange: (side: 'A' | 'B') => void;
  onUse: (number: number) => void;
  onExit: () => void;
};

/**
 * Figma: R11 · Compare and explain (11125:44606) and Compare versions · Selection only (11125:41951).
 * Left is the current version; right starts as a dashed "Add a version" slot.
 * Prototype: the slot, "Add a version" and Change → Own project · Add a version (saved version or new screenshot);
 * once both sides hold a version (Pair ready), Use vN → Explain your choice; Exit comparison → Make with tools open.
 * Each screen is drawn whole at its own proportions, so a tall phone UI is never cropped.
 */
export function CompareVersions({ versions, a, b, onChange, onUse, onExit }: Props) {
  const ready = b !== null;

  const column = (side: 'A' | 'B', n: number | null) => {
    const v = n === null ? null : versions.find((x) => x.number === n);
    if (!v) {
      return (
        <View className="w-compareColumn gap-12">
          <View className="h-control flex-row items-center">
            <Text className="flex-1 font-medium text-labelUi text-ink">{side} · Add a version</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add a version. Choose a saved version or add a screenshot."
            onPress={() => onChange(side)}
            className="flex-1 items-center justify-center gap-8 rounded-14 border-dash border-dashed border-secondaryText bg-white hover:bg-paper"
            style={{ minHeight: size.compareSlotHeight }}
          >
            <View className="h-addVersionMark w-addVersionMark items-center justify-center rounded-pill bg-paper">
              <Text className="font-regular text-sectionUi text-ink">+</Text>
            </View>
            <Text className="font-semibold text-labelUi text-ink">Add a version</Text>
            <Text className="font-regular text-bodySmall text-secondaryText">Choose a saved version or add a screenshot.</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View className="w-compareColumn gap-12">
        <View className="h-control flex-row items-center gap-12">
          <Text numberOfLines={1} className="flex-1 font-medium text-labelUi text-ink">
            {side} · {v.name}
          </Text>
          <Button label="Change" variant="secondary" size="sm" onPress={() => onChange(side)} />
        </View>
        <View
          className="flex-1 items-center justify-center rounded-14 bg-white p-14"
          style={{ minHeight: size.compareSlotHeight }}
        >
          {v.source ? (
            <VersionPreview
              source={v.source}
              label={v.name}
              maxWidth={size.compareShot}
              maxHeight={size.portraitMaxHeight}
            />
          ) : (
            <View className="items-center gap-8">
              <Icon name="image" size={size.icon} />
              <Text className="font-regular text-bodySmall text-secondaryText">This screen could not load.</Text>
            </View>
          )}
        </View>
        {ready && <Button label={`Use v${v.number}`} variant="secondary" size="sm" full onPress={() => onUse(v.number)} />}
      </View>
    );
  };

  return (
    <View className="w-compareMode gap-16">
      <View className="flex-row items-center gap-12">
        <Text className="flex-1 font-semibold text-sectionUi text-ink">Compare versions.</Text>
        <Button label="Exit comparison" variant="secondary" size="header" width={size.compareExit} onPress={onExit} />
      </View>
      <View className="flex-row items-stretch gap-24">
        {column('A', a)}
        {column('B', b)}
      </View>
      <Text className="font-regular text-bodySmall text-secondaryText">
        {ready ? 'Pick a version to revise.' : 'Add another version to compare.'}
      </Text>
    </View>
  );
}
