import { Text, View } from 'react-native';

type Props = { number: string; title: string; body?: string };

/** Figma: R4/Guide step. 24 Ash number, 14 Medium title, optional 13 secondary body. */
export function GuideStep({ number, title, body }: Props) {
  return (
    <View className="flex-row gap-12">
      <View className="h-stepNumber w-stepNumber items-center justify-center rounded-pill bg-border">
        <Text className="font-medium text-labelSmall text-ink">{number}</Text>
      </View>
      <View className="flex-1 gap-2">
        <Text className="font-medium text-labelUi text-ink">{title}</Text>
        {body ? <Text className="font-regular text-bodySmall text-secondaryText">{body}</Text> : null}
      </View>
    </View>
  );
}
