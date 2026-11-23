import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';

type Props = {
  fileName: string;
  /** e.g. "PNG · 1.1 MB · one screen" */
  meta: string;
  action?: string;
  onAction?: () => void;
};

/** Figma: R4/File chip (8708:3717). Thumb, file name and meta, trailing text action. */
export function FileChip({ fileName, meta, action = 'Replace', onAction }: Props) {
  return (
    <View className="flex-row items-center gap-12 rounded-10 bg-paper px-12 py-10">
      <View className="h-fileThumb w-fileThumb items-center justify-center rounded-6 bg-border">
        <Icon name="image" />
      </View>
      <View className="flex-1 gap-2">
        <Text numberOfLines={1} className="font-medium text-labelSmall text-ink">
          {fileName}
        </Text>
        <Text className="font-regular text-bodySmall text-secondaryText">{meta}</Text>
      </View>
      {onAction && (
        <Pressable accessibilityRole="button" onPress={onAction}>
          <Text className="font-medium text-labelSmall text-secondaryText">{action}</Text>
        </Pressable>
      )}
    </View>
  );
}
