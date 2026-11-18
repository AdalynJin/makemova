import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { size } from '@/tokens';

type Props = { title: string; description?: string; onClose: () => void };

/** Figma: R4/Modal header (8708:3679). Title, optional description, round close. */
export function ModalHeader({ title, description, onClose }: Props) {
  return (
    <View className="flex-row items-start gap-12">
      <View className="flex-1 gap-6">
        <Text className="font-semibold text-cardTitle text-ink">{title}</Text>
        {description ? <Text className="font-regular text-bodySmall text-secondaryText">{description}</Text> : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        className="h-dialogClose w-dialogClose items-center justify-center rounded-pill"
      >
        <Icon name="x" size={description ? size.iconMd : size.icon} />
      </Pressable>
    </View>
  );
}
