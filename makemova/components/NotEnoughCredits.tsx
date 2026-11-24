import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/DialogFooter';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

type Props = { visible: boolean; cost: number; balance: number; onPlans: () => void; onClose: () => void };

/**
 * Figma: R4 · Dialog · Not enough credits (11125:60006). Get feedback when the balance is under the cost.
 * Prototype: Keep working · free closes; View plans → Account · Plans.
 */
export function NotEnoughCredits({ visible, cost, balance, onPlans, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} width="w-dialogSmall">
      <View className="gap-16 p-24">
        <ModalHeader title={`This critique needs ${cost} credits.`} onClose={onClose} />
        <View className="rounded-16 bg-critique px-16 py-12">
          <Text className="font-medium text-labelUi text-ink">Available now: {balance}</Text>
        </View>
        <Text className="font-regular text-bodySmall text-secondaryText">
          Check plans and your monthly allowance, or keep working manually at no cost.
        </Text>
      </View>
      <DialogFooter>
        <Button label="Keep working · free" variant="quiet" size="md" onPress={onClose} />
        <Button label="View plans" size="md" onPress={onPlans} />
      </DialogFooter>
    </DialogPage>
  );
}
