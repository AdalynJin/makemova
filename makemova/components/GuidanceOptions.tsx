import { View } from 'react-native';

import { Button } from '@/components/Button';
import { ChoiceOption } from '@/components/ChoiceOption';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

export const guidanceLevels = [
  { label: 'More guidance', hint: 'One principle, one example, one clear task.' },
  { label: 'Direction support', hint: 'Criteria and trade-offs between options.' },
  { label: 'Targeted skill', hint: 'One focused tip for one skill or tool.' },
] as const;
export type GuidanceLevel = (typeof guidanceLevels)[number]['label'];

type Props = {
  visible: boolean;
  value: GuidanceLevel;
  onChange: (level: GuidanceLevel) => void;
  onClose: () => void;
};

/** Figma: Dialog page · R6 · Guidance options (11125:59978). From Quick guide and set-up "Help choosing". */
export function GuidanceOptions({ visible, value, onChange, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} radius="rounded-10" motion="guide">
      <View className="gap-20 p-24">
        <ModalHeader title="Choose how much help you need" onClose={onClose} />
        <View className="gap-10">
          {guidanceLevels.map((g) => (
            <View key={g.label} className="flex-row">
              <ChoiceOption label={g.label} hint={g.hint} selected={value === g.label} onPress={() => onChange(g.label)} />
            </View>
          ))}
        </View>
        <Button label="Done" variant="secondary" size="header" full onPress={onClose} />
      </View>
    </DialogPage>
  );
}

