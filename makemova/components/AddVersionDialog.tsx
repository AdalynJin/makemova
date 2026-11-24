import { Pressable, Text, View } from 'react-native';

import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

type Props = {
  visible: boolean;
  onClose: () => void;
  onChooseSaved: () => void;
  onAddScreenshot: () => void;
};

function Choice({ title, body, onPress }: { title: string; body: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="gap-2 rounded-10 border border-border bg-paper px-12 py-12 hover:border-secondaryText"
    >
      <Text className="font-semibold text-labelUi text-ink">{title}</Text>
      <Text className="font-regular text-bodySmall text-secondaryText">{body}</Text>
    </Pressable>
  );
}

/**
 * Figma: Own project · Add a version (11125:60949). Opened by the empty B slot, "Add a version" and every "Change".
 * Prototype: Choose a saved version → swap to Own project · Saved versions;
 * Add a new screenshot → swap to Own project · Add screenshot.
 */
export function AddVersionDialog({ visible, onClose, onChooseSaved, onAddScreenshot }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} width="w-dialogSmall" motion={null}>
      <View className="gap-16 p-24">
        <ModalHeader title="Add a version" onClose={onClose} />
        <Text className="font-regular text-bodySmall text-secondaryText">Choose what to compare with your current version.</Text>
        <Choice title="Choose a saved version" body="Pick a version from this project." onPress={onChooseSaved} />
        <Choice title="Add a new screenshot" body="Use a PNG or JPG from your device." onPress={onAddScreenshot} />
      </View>
    </DialogPage>
  );
}
