import { Pressable, Text, View } from 'react-native';

import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

type Props = {
  visible: boolean;
  title: string;
  description: string;
  options: string[];
  onChoose: (text: string) => void;
  onClose: () => void;
};

/**
 * Figma: Own project · Goal fit / Visible evidence / Trade-off (11125:61025, 61040, 61055).
 * One tap fills the field with the starter and closes. The designer can still rewrite it.
 */
export function StarterChoices({ visible, title, description, options, onChoose, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} width="w-dialogSmall" motion={null}>
      <View className="gap-12 p-24">
        <ModalHeader title={title} onClose={onClose} />
        <Text className="pb-4 font-regular text-bodySmall text-secondaryText">{description}</Text>
        {options.map((o) => (
          <Pressable
            key={o}
            accessibilityRole="button"
            onPress={() => onChoose(o)}
            className="rounded-10 border border-border bg-paper px-12 py-10 hover:border-secondaryText"
          >
            <Text className="font-semibold text-labelUi text-ink">{o}</Text>
          </Pressable>
        ))}
      </View>
    </DialogPage>
  );
}
