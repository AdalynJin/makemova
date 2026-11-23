import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/DialogFooter';
import { DialogPage } from '@/components/DialogPage';
import { Icon } from '@/components/Icon';
import { ModalHeader } from '@/components/ModalHeader';
import { size } from '@/tokens';

type Props = { visible: boolean; cost: number; balance: number; onConfirm: () => void; onClose: () => void };

/** Figma: R4 · Dialog · Confirm critique (11125:60160), from Get feedback · 5 credits. */
export function ConfirmCritique({ visible, cost, balance, onConfirm, onClose }: Props) {
  const rows: [string, string, boolean][] = [
    ['This request', `${cost} credits`, true],
    ['Your balance', String(balance), false],
    ['After this request', String(balance - cost), false],
  ];
  return (
    <DialogPage visible={visible} onClose={onClose} width="w-dialogSmall">
      <View className="px-24 pb-16 pt-24">
        <ModalHeader
          title="Run this critique?"
          description="Uses your selected screen, the goal and this stage."
          onClose={onClose}
        />
      </View>
      <View className="gap-16 px-24 pb-24 pt-8">
        <View className="overflow-hidden rounded-16 border border-border bg-critique">
          {rows.map(([label, value, strong], i) => (
            <View
              key={label}
              className={`flex-row items-center justify-between px-16 py-12 ${i < rows.length - 1 ? 'border-b border-border' : ''}`}
            >
              <Text className="font-regular text-bodySmall text-secondaryText">{label}</Text>
              <Text className={strong ? 'font-medium text-labelUi text-ink' : 'font-regular text-bodySmall text-ink'}>
                {value}
              </Text>
            </View>
          ))}
        </View>
        <Text className="font-regular text-bodySmall text-secondaryText">
          Includes the critique, its explanation and one next step. Reopening the result is free.
        </Text>
      </View>
      <DialogFooter>
        <View className="flex-1 flex-row items-center gap-6">
          <Icon name="zap" size={size.iconXs} />
          <Text className="font-regular text-bodySmall text-secondaryText">Cancel or fail: 0 credits</Text>
        </View>
        <Button label="Cancel" variant="quiet" size="md" onPress={onClose} />
        <Button label={`Use ${cost} credits`} size="md" onPress={onConfirm} />
      </DialogFooter>
    </DialogPage>
  );
}
