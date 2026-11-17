import { Pressable, Text, View } from 'react-native';

export type FocusChoiceState = 'default' | 'selected';

type Props = { label: string; state?: FocusChoiceState; onPress?: () => void };

/** Figma: Makemova geometric / Focus choice */
export function FocusChoice({ label, state = 'default', onPress }: Props) {
  const selected = state === 'selected';
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`flex-row items-center gap-12 rounded-16 px-16 py-16 ${
        selected ? 'bg-critique' : 'border border-borderDefault bg-white'
      }`}
    >
      {selected ? (
        <Text className="w-20 text-center font-bold text-action text-ink">✓</Text>
      ) : (
        <View className="h-20 w-20 rounded-pill border-focus border-ink" />
      )}
      <Text className="font-bold text-action text-ink">{label}</Text>
    </Pressable>
  );
}
