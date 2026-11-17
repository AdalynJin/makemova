import { Pressable, Text, View } from 'react-native';

type Props = { label: string; hint?: string; selected: boolean; onPress: () => void };

/** Figma: R4/Choice · radio option (selected = paper fill + 1.5 ink border). */
export function ChoiceOption({ label, hint, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`flex-1 flex-row items-center gap-12 rounded-10 px-16 ${hint ? 'py-12' : 'h-controlLarge'} ${
        selected ? 'border-dash border-ink bg-paper' : 'border border-border bg-white'
      }`}
    >
      <View
        className={`h-radioOuter w-radioOuter items-center justify-center rounded-pill ${
          selected ? 'border-focus border-ink' : 'border border-secondaryText'
        }`}
      >
        {selected && <View className="h-radioInner w-radioInner rounded-pill bg-ink" />}
      </View>
      <View className="flex-1 gap-2">
        <Text className="font-medium text-labelUi text-ink">{label}</Text>
        {hint && <Text className="font-regular text-labelSmall text-secondaryText">{hint}</Text>}
      </View>
    </Pressable>
  );
}
