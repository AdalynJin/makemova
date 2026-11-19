import { View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

export const CRITIQUE_FOCUSES = ['Main action', 'Visual hierarchy', 'Readability'] as const;
export type CritiqueFocus = (typeof CRITIQUE_FOCUSES)[number];

type Props = { visible: boolean; onChoose: (focus: CritiqueFocus) => void; onClose: () => void };

/** Figma: R5 · Choose critique focus (11125:60151), from Critique · One focus only → Change. */
export function ChooseCritiqueFocus({ visible, onChoose, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} radius="rounded-10" width="w-dialogSmall" shadow={false}>
      <View className="gap-20 p-24">
        <ModalHeader title="Choose a focus" onClose={onClose} />
        {CRITIQUE_FOCUSES.map((focus) => (
          <Button key={focus} label={focus} variant="secondary" size="md" full onPress={() => onChoose(focus)} />
        ))}
      </View>
    </DialogPage>
  );
}
