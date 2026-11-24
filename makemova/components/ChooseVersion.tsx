import { Image, type ImageSource } from 'expo-image';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { Icon } from '@/components/Icon';
import { ModalHeader } from '@/components/ModalHeader';
import { size } from '@/tokens';

export type VersionOption = { number: number; name: string; file: string; source?: ImageSource | number | null };

type Props = {
  /** Dialog title, or null when closed. */
  title: string | null;
  options: VersionOption[];
  onChoose: (number: number) => void;
  onClose: () => void;
};

/**
 * Figma: R5 · Choose current version (11125:60054), from ⋯ beside the versions,
 * and R7 · View saved version from Revise (11125:60248). View switches to that version.
 */
export function ChooseVersion({ title, options, onChoose, onClose }: Props) {
  return (
    <DialogPage visible={!!title} onClose={onClose} radius="rounded-10" shadow={false}>
      <View className="gap-20 p-24">
        <ModalHeader title={title ?? ''} onClose={onClose} />
        <Text className="font-regular text-bodySmall text-secondaryText">Switching versions keeps your work and feedback.</Text>
        {options.map((o) => (
          <View key={o.number} className="flex-row items-center gap-12">
            <View className="h-versionThumbHeight w-versionThumb items-center justify-center overflow-hidden rounded-6 bg-paper">
              {o.source ? (
                <Image source={o.source} style={{ width: size.versionThumb, height: size.versionThumbHeight }} contentFit="contain" />
              ) : (
                <Icon name="image" size={size.versionIcon} />
              )}
            </View>
            <View className="flex-1 gap-4">
              <Text className="font-medium text-labelUi text-ink">{o.name}</Text>
              <Text numberOfLines={1} className="font-regular text-bodySmall text-secondaryText">
                {o.file}
              </Text>
            </View>
            <Button label="View" variant="secondary" size="sm" width={size.versionView} onPress={() => onChoose(o.number)} />
          </View>
        ))}
      </View>
    </DialogPage>
  );
}
