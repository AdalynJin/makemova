import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

type Props = { visible: boolean; title: string; audience: string; goal: string; onClose: () => void };

/** Figma: R6 · Brief details (11125:60185), from Edit → Brief details on the Brief stage. */
export function BriefDetails({ visible, title, audience, goal, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} radius="rounded-10" shadow={false}>
      <View className="gap-20 p-24">
        <ModalHeader title={title} onClose={onClose} />
        <Text className="font-regular text-bodyUi text-secondaryText">Audience · {audience}</Text>
        <Text className="font-regular text-bodyUi text-secondaryText">Success · {goal}</Text>
        <Text className="font-regular text-bodyUi text-secondaryText">
          Save · A version, a decision note, a revision and one lesson.
        </Text>
        <Button label="Done" variant="secondary" size="sm" full onPress={onClose} />
      </View>
    </DialogPage>
  );
}
