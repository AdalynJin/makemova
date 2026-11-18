import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

type Props = { visible: boolean; onClose: () => void };

/** Figma: R6 · Upload tips (11125:60036), opened from "Upload tips" on Flow B · CH01. */
export function UploadTips({ visible, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} radius="rounded-10">
      <View className="gap-20 p-24">
        <ModalHeader title="Bring one screen" onClose={onClose} />
        <Text className="font-regular text-bodyUi text-secondaryText">PNG or JPG · Up to 10 MB.</Text>
        <Text className="font-regular text-bodyUi text-secondaryText">
          Export one frame with readable text and the action you want feedback on.
        </Text>
        <Button label="Done" variant="white" size="sm" full onPress={onClose} />
      </View>
    </DialogPage>
  );
}
