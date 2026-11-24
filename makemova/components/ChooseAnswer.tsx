import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/DialogFooter';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

export type Answer = { title: string; body: string };

type Props = {
  visible: boolean;
  title: string;
  description: string;
  options: Answer[];
  /** Index already chosen, if any. */
  value?: number | null;
  onUse: (index: number) => void;
  onClose: () => void;
};

/**
 * Figma: R4 · Dialog · Choose · Goal reason / Visible evidence / Trade-off / Takeaway (11125:60207, 60217, 60227, 60298).
 * Radio answers; Back closes, Use this answer saves the draft and closes.
 */
export function ChooseAnswer({ visible, title, description, options, value, onUse, onClose }: Props) {
  const [picked, setPicked] = useState(value ?? 0);
  useEffect(() => {
    if (visible) setPicked(value ?? 0);
  }, [visible, value]);
  return (
    <DialogPage visible={visible} onClose={onClose} motion={null}>
      <View className="gap-16 p-24">
        <ModalHeader title={title} description={description} onClose={onClose} />
        {options.map((o, i) => {
          const on = i === picked;
          return (
            <Pressable
              key={o.title}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              onPress={() => setPicked(i)}
              className={`flex-row gap-12 rounded-10 px-16 py-12 ${on ? 'border border-ink bg-paper' : 'border border-border bg-white'}`}
            >
              <View
                className={`mt-2 h-radioOuter w-radioOuter rounded-pill bg-white ${on ? 'border-radio border-ink' : 'border border-secondaryText'}`}
              />
              <View className="flex-1 gap-2">
                <Text className="font-medium text-labelUi text-ink">{o.title}</Text>
                <Text className="font-regular text-bodySmall text-secondaryText">{o.body}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <DialogFooter>
        <Button label="Back" variant="quiet" size="md" onPress={onClose} />
        <Button label="Use this answer" size="md" onPress={() => onUse(picked)} />
      </DialogFooter>
    </DialogPage>
  );
}
