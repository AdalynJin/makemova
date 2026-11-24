import { Image, type ImageSource } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { Icon } from '@/components/Icon';
import { ModalHeader } from '@/components/ModalHeader';
import { size } from '@/tokens';

export type SavedVersion = { number: number; name: string; file: string; source: ImageSource | number | null };

type Props = {
  visible: boolean;
  options: SavedVersion[];
  onChoose: (number: number) => void;
  onAddScreenshot: () => void;
  onClose: () => void;
};

/**
 * Figma: Own project · Saved versions (11125:60964). Every saved version with its thumbnail.
 * Prototype: a version → fills the comparison slot and closes; Add a new screenshot → swap to Add screenshot.
 * Empty: "No other saved versions yet."
 */
export function SavedVersionsDialog({ visible, options, onChoose, onAddScreenshot, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} width="w-dialogSmall" motion={null}>
      <View className="gap-16 p-24">
        <ModalHeader title="Choose a saved version" onClose={onClose} />
        <Text className="font-regular text-bodySmall text-secondaryText">Choose a different version of this project.</Text>
        {options.length === 0 ? (
          <Text className="font-regular text-bodySmall text-ink">No other saved versions yet.</Text>
        ) : (
          options.map((o) => (
            <Pressable
              key={o.number}
              accessibilityRole="button"
              accessibilityLabel={`Use ${o.name}`}
              onPress={() => onChoose(o.number)}
              className="flex-row items-center gap-12 rounded-10 border border-border bg-paper p-8 hover:border-secondaryText"
            >
              <View className="h-versionThumbHeight w-versionThumb items-center justify-center overflow-hidden rounded-6 bg-white">
                {o.source ? (
                  <Image source={o.source} style={{ width: size.versionThumb, height: size.versionThumbHeight }} contentFit="contain" />
                ) : (
                  <Icon name="image" />
                )}
              </View>
              <View className="flex-1 gap-2">
                <Text className="font-semibold text-labelUi text-ink">{o.name}</Text>
                <Text numberOfLines={1} className="font-regular text-bodySmall text-secondaryText">
                  {o.file}
                </Text>
              </View>
            </Pressable>
          ))
        )}
        <Button label="Add a new screenshot" variant="ash" size="sm" full onPress={onAddScreenshot} />
      </View>
    </DialogPage>
  );
}
