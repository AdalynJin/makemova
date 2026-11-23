import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

type Props = { project: string | null; onConfirm: () => void; onClose: () => void };

/**
 * Figma: R5 · Delete project confirmation (11125:60390).
 * Prototype: Delete project hides the card and shows "Project deleted." with Undo; Cancel and close dismiss.
 */
export function DeleteProjectConfirmation({ project, onConfirm, onClose }: Props) {
  return (
    <DialogPage visible={!!project} onClose={onClose} radius="rounded-10" width="w-dialogSmall" shadow={false}>
      <View className="gap-20 p-24">
        <ModalHeader title="Delete this project?" onClose={onClose} />
        <Text numberOfLines={1} className="font-semibold text-cardTitle text-ink">
          {project}
        </Text>
        <Text className="font-regular text-bodySmall text-secondaryText">
          Its saved versions and feedback will be removed from your projects.
        </Text>
        <View className="flex-row gap-12">
          <View className="flex-1">
            <Button label="Cancel" variant="secondary" size="md" full onPress={onClose} />
          </View>
          <View className="flex-1">
            <Button label="Delete project" size="md" full onPress={onConfirm} />
          </View>
        </View>
      </View>
    </DialogPage>
  );
}
