import { View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/DialogFooter';
import { DialogPage } from '@/components/DialogPage';
import { GuideStep } from '@/components/GuideStep';
import { ModalHeader } from '@/components/ModalHeader';

type Props = { visible: boolean; goal: string; onClose: () => void; onAddScreenshot: () => void };

/**
 * Figma: R4 · Dialog · Edit source (11125:59955), from Edit → Edit source.
 * Prototype: Back to workspace closes; Add revised screenshot swaps to R4 · Dialog · Add a screen.
 */
export function EditSourceDialog({ visible, goal, onClose, onAddScreenshot }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} motion="revise">
      <View className="px-24 pb-16 pt-24">
        <ModalHeader
          title="Edit your source file"
          description="Make the change where you designed it. This workspace keeps the learning, feedback and versions together."
          onClose={onClose}
        />
      </View>
      <View className="gap-16 px-24 pb-24 pt-8">
        <GuideStep number="1" title="Open your original design" body="Your Figma file or the tool you used." />
        <GuideStep number="2" title="Change one thing" body={`Keep the same goal: ${goal}`} />
        <GuideStep number="3" title="Export a new screenshot" body="PNG or JPG · one screen · readable text." />
      </View>
      <DialogFooter>
        <Button label="Back to workspace" variant="quiet" size="md" onPress={onClose} />
        <Button label="Add revised screenshot" size="md" leading="uploadWhite" onPress={onAddScreenshot} />
      </DialogFooter>
    </DialogPage>
  );
}
