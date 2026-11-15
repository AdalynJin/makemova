import { Text, View } from 'react-native';

import { PillAction } from './PillAction';
import { TextField } from './TextField';

export type DecisionPanelState = 'empty' | 'reasonReady';

type Props = {
  goal: string;
  reason: string;
  onChangeReason?: (v: string) => void;
  onSave?: () => void;
  onStartingPoint?: () => void;
  onAddEvidence?: () => void;
  onAddTradeoff?: () => void;
  /** Force a state (dev screen). Otherwise derived from the reason text. */
  state?: DecisionPanelState;
};

/** Figma: Makemova geometric / Decision panel — explain your choice. */
export function DecisionPanel({ goal, reason, onChangeReason, onSave, onStartingPoint, onAddEvidence, onAddTradeoff, state }: Props) {
  const s: DecisionPanelState = state ?? (reason.trim() ? 'reasonReady' : 'empty');
  return (
    <View className="gap-16 rounded-16 bg-white p-24">
      <Text className="font-bold text-panel text-ink">Explain your choice</Text>
      <View className="gap-4 rounded-12 bg-selected p-16">
        <Text className="font-bold text-small uppercase text-ink">Your goal</Text>
        <Text className="font-regular text-body text-ink">{goal}</Text>
      </View>
      <TextField
        label="Your reason"
        value={reason}
        onChangeText={onChangeReason}
        placeholder="Why does this direction fit the goal?"
        helper="Your own words. Evidence and trade-offs are optional."
        state={state ? (s === 'reasonReady' ? 'filled' : 'default') : undefined}
      />
      <View className="flex-row">
        <PillAction label="Need a starting point?" type="secondary" onPress={onStartingPoint} />
      </View>
      <View className="flex-row gap-16">
        <View className="flex-1">
          <PillAction label="+ Evidence" type="secondary" onPress={onAddEvidence} />
        </View>
        <View className="flex-1">
          <PillAction label="+ Trade-off" type="secondary" onPress={onAddTradeoff} />
        </View>
      </View>
      <Text className="font-regular text-caption text-secondaryText">
        Optional. Add an observation or a possible downside when it helps explain the choice.
      </Text>
      <View className="flex-row">
        <PillAction label="Save decision" state={s === 'empty' ? 'disabled' : 'hover'} onPress={onSave} />
      </View>
      <Text className="font-regular text-caption text-secondaryText">Saving is free. You can edit your reason later.</Text>
    </View>
  );
}
