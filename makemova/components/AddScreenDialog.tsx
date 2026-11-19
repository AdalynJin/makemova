import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/DialogFooter';
import { DialogPage } from '@/components/DialogPage';
import { Dropzone } from '@/components/Dropzone';
import { GuideStep } from '@/components/GuideStep';
import { ModalHeader } from '@/components/ModalHeader';

type Props = {
  visible: boolean;
  error?: string | null;
  onClose: () => void;
  onChoose: () => void;
  onDropFile: (file: File) => void;
};

/**
 * Figma: R4 · Dialog · Add a screen (11125:59967), from Edit → Add screenshot.
 * Prototype: the dropzone swaps to R4 · Dialog · Review screen; Cancel closes.
 */
export function AddScreenDialog({ visible, error, onClose, onChoose, onDropFile }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose}>
      <View className="px-24 pb-16 pt-24">
        <ModalHeader
          title="Add your current screen"
          description="The guide uses this screenshot and the goal already in your project."
          onClose={onClose}
        />
      </View>
      <View className="gap-16 px-24 pb-24 pt-8">
        <Dropzone
          title="Drop one screen here"
          hint="PNG or JPG · one screen per image · up to 10 MB"
          onChoose={onChoose}
          onDropFile={onDropFile}
        />
        {error && (
          <View className="rounded-12 bg-selected px-14 py-10">
            <Text className="font-medium text-labelUi text-ink">{error}</Text>
          </View>
        )}
        <GuideStep number="1" title="Export one frame" body="Show the part of the design you want to discuss." />
        <GuideStep number="2" title="Keep it readable" body="Include the main action and the context around it." />
      </View>
      <DialogFooter>
        <Button label="Cancel" variant="quiet" size="md" onPress={onClose} />
      </DialogFooter>
    </DialogPage>
  );
}
