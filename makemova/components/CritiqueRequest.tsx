import { Text, View } from 'react-native';

import { Button } from '@/components/Button';

type Props = { version: string; focus: string; cost: number; onChange: () => void; onGetFeedback: () => void };

/** Figma: Critique · One focus only (11125:42009). Opens under the tool cards when Critique is pressed. */
export function CritiqueRequest({ version, focus, cost, onChange, onGetFeedback }: Props) {
  return (
    <View className="gap-12 rounded-10 bg-paper p-16">
      <Text className="font-medium text-labelUi text-ink">{version}</Text>
      <View className="flex-row items-center gap-8">
        <Text className="w-critiqueFocusValue font-regular text-bodySmall text-ink">{focus}</Text>
        <View className="flex-1">
          <Button label="Change" variant="quiet" size="sm" full onPress={onChange} />
        </View>
      </View>
      <Button label={`Get feedback · ${cost} credits`} size="md" full onPress={onGetFeedback} />
    </View>
  );
}
