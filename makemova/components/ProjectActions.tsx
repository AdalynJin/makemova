import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';

type Props = { visible: boolean; onDelete: () => void; onClose: () => void };

/**
 * Figma: R5 · Project actions (11125:60029), opened from a project card's ⋯.
 * Prototype: Delete project swaps to R5 · Delete project confirmation; Cancel closes.
 */
export function ProjectActions({ visible, onDelete, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} radius="rounded-10" width="w-projectActions">
      <View className="gap-20 p-24">
        <Text className="font-medium text-labelUi text-ink">Project actions</Text>
        <Button label="Delete project" variant="secondary" size="sm" full onPress={onDelete} />
        <Button label="Cancel" variant="quiet" size="sm" full onPress={onClose} />
      </View>
    </DialogPage>
  );
}
