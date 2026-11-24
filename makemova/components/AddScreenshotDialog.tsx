import { Platform, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { Dropzone } from '@/components/Dropzone';
import { ModalHeader } from '@/components/ModalHeader';

type Props = {
  visible: boolean;
  error?: string | null;
  onChoose: () => void;
  onDropFile: (file: File) => void;
  onClose: () => void;
};

/**
 * Figma: Own project · Add screenshot (11125:60994).
 * Prototype: Choose file → swap to Own project · Screenshot ready.
 */
export function AddScreenshotDialog({ visible, error, onChoose, onDropFile, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} width="w-dialogSmall" motion={null}>
      <View className="gap-16 p-24">
        <ModalHeader title="Add a screenshot" onClose={onClose} />
        <Text className="font-regular text-bodySmall text-secondaryText">Upload one screen as a PNG or JPG.</Text>
        <Dropzone title="Drop a screenshot here" hint="PNG or JPG · one screen" onChoose={onChoose} onDropFile={onDropFile} />
        {error && (
          <View className="rounded-12 bg-selected px-14 py-10">
            <Text className="font-medium text-labelUi text-ink">{error}</Text>
          </View>
        )}
        {Platform.OS === 'web' && <Button label="Choose file" size="md" full onPress={onChoose} />}
      </View>
    </DialogPage>
  );
}
