import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import { color } from '@/tokens';

export type TextFieldState = 'default' | 'focused' | 'filled' | 'error' | 'disabled' | 'readOnly';

type Props = {
  label: string;
  value?: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  helper?: string;
  /** A validation message also puts the field in its error state unless a state is forced. */
  errorText?: string;
  requirement?: string;
  /** Force a state (dev screen). Otherwise derived from focus and value. */
  state?: TextFieldState;
  multiline?: boolean;
};

const surface: Record<TextFieldState, string> = {
  default: 'border border-borderDefault bg-white',
  focused: 'border-focus border-artiBlue bg-white',
  filled: 'border border-borderDefault bg-white',
  error: 'border-focus border-mateOrange bg-white',
  disabled: 'bg-paper',
  readOnly: 'bg-paper',
};

/** Figma: Text field — label above, help below. */
export function TextField({
  label,
  value = '',
  onChangeText,
  placeholder,
  helper,
  errorText,
  requirement = 'Required',
  state,
  multiline = true,
}: Props) {
  const [focused, setFocused] = useState(false);
  const s: TextFieldState = state ?? (errorText ? 'error' : focused ? 'focused' : value ? 'filled' : 'default');
  const editable = s !== 'disabled' && s !== 'readOnly';

  return (
    <View className="gap-8">
      <View className="flex-row items-center justify-between gap-12">
        <Text className="font-bold text-action text-ink">{label}</Text>
        <Text className={`font-bold text-small ${s === 'focused' ? 'text-artiBlue' : 'text-secondaryText'}`}>
          {s === 'readOnly' ? 'Saved' : requirement}
        </Text>
      </View>
      <TextInput
        accessibilityLabel={label}
        accessibilityState={{ disabled: s === 'disabled' }}
        className={`rounded-12 p-16 font-regular text-body text-ink ${multiline ? 'min-h-fieldMinHeight' : ''} ${surface[s]}`}
        style={{ textAlignVertical: 'top' }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={color.secondaryText}
        editable={editable}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {s === 'error' && errorText ? (
        <Text accessibilityLiveRegion="polite" className="font-regular text-caption text-ink">! {errorText}</Text>
      ) : helper ? (
        <Text className="font-regular text-caption text-secondaryText">{helper}</Text>
      ) : null}
    </View>
  );
}
