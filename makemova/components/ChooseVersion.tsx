import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { Icon } from '@/components/Icon';
import { ModalHeader } from '@/components/ModalHeader';
import { size } from '@/tokens';

export type VersionOption = { number: number; name: string; file: string };

type Props = {
  side: 'A' | 'B' | null;
  options: VersionOption[];
  onChoose: (number: number) => void;
  onClose: () => void;
};

/** Figma: R5 · Choose left version (11125:60079) and R5 · Choose right version (11125:60104). */
export function ChooseVersion({ side, options, onChoose, onClose }: Props) {
  return (
    <DialogPage visible={!!side} onClose={onClose} radius="rounded-10" shadow={false}>
      <View className="gap-20 p-24">
        <ModalHeader title={`Choose ${side ?? ''}`} onClose={onClose} />
        <Text className="font-regular text-bodySmall text-secondaryText">
          Switching versions keeps your work and feedback.
        </Text>
        {options.map((o) => (
          <View key={o.number} className="flex-row items-center gap-12">
            <Icon name="image" size={size.versionIcon} />
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
