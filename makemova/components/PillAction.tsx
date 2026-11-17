import { useState } from 'react';
import { Pressable, Text } from 'react-native';

export type PillActionType = 'primary' | 'secondary';
export type PillActionState = 'default' | 'hover' | 'disabled';

type Props = {
  label: string;
  type?: PillActionType;
  /** Force a state (dev screen). Otherwise hover follows the pointer and press. */
  state?: PillActionState;
  disabled?: boolean;
  onPress?: () => void;
};

const surface = {
  primary: { default: 'bg-mateOrange', hover: 'bg-ink', disabled: 'bg-border' },
  secondary: { default: 'bg-paper', hover: 'bg-selected', disabled: 'bg-paper' },
} as const;

const text = {
  primary: { default: 'text-ink', hover: 'text-white', disabled: 'text-secondaryText' },
  secondary: { default: 'text-ink', hover: 'text-ink', disabled: 'text-secondaryText' },
} as const;

/** Figma: Makemova geometric / Pill action */
export function PillAction({ label, type = 'primary', state, disabled, onPress }: Props) {
  const [active, setActive] = useState(false);
  const isDisabled = disabled || state === 'disabled';
  const s: PillActionState = isDisabled ? 'disabled' : (state ?? (active ? 'hover' : 'default'));
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      onHoverIn={() => setActive(true)}
      onHoverOut={() => setActive(false)}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      className={`rounded-pill px-20 py-12 ${surface[type][s]}`}
    >
      <Text className={`text-center font-bold text-action ${text[type][s]}`}>{label}</Text>
    </Pressable>
  );
}
