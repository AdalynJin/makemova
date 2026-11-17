import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { color } from '@/tokens';

type Props = TextInputProps & { label: string; error?: string | null };

/** Figma: R4/Field · Text (label 14 medium, 44 tall input, 12 radius). */
export function AuthField({ label, error, ...input }: Props) {
  const [focus, setFocus] = useState(false);
  return (
    <View className="gap-8">
      <Text className="font-medium text-labelUi text-ink">{label}</Text>
      <TextInput
        {...input}
        onFocus={(e) => {
          setFocus(true);
          input.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          input.onBlur?.(e);
        }}
        placeholderTextColor={color.secondaryText}
        className={`min-h-control rounded-12 bg-white px-14 py-10 font-regular text-bodyUi text-ink ${
          focus ? 'border-focus border-artiBlue' : error ? 'border border-mateOrange' : 'border border-secondaryText'
        }`}
        style={{ outlineStyle: 'none' } as never}
      />
      {error ? <Text className="font-medium text-labelSmall text-ink">{error}</Text> : null}
    </View>
  );
}
