import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { color, size as s } from '@/tokens';

export type ButtonVariant = 'primary' | 'outline' | 'white' | 'quiet' | 'outlineOnDark' | 'yellowInk';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'hero';

type Props = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Trailing arrow, as on the Week 8 hi-fi. */
  arrow?: boolean;
  leading?: IconName;
  disabled?: boolean;
  busy?: boolean;
  full?: boolean;
  width?: number;
  onPress?: () => void;
};

const height = { sm: 'h-controlSmall', md: 'h-control', lg: 'h-controlLarge', hero: 'h-heroButton' } as const;
const pad = { sm: 'px-16', md: 'px-20', lg: 'px-24', hero: 'px-28' } as const;
const textSize = { sm: 'text-labelUi', md: 'text-labelUi', lg: 'text-bodyUi', hero: 'text-nav' } as const;

const surface: Record<ButtonVariant, { idle: string; hover: string; text: string }> = {
  primary: { idle: 'bg-ink', hover: 'bg-inkHover', text: 'text-white' },
  outline: { idle: 'bg-white border-dash border-ink', hover: 'bg-paper border-dash border-ink', text: 'text-ink' },
  white: { idle: 'bg-white border border-ink', hover: 'bg-paper border border-ink', text: 'text-ink' },
  quiet: { idle: 'bg-transparent', hover: 'bg-paper', text: 'text-ink' },
  outlineOnDark: { idle: 'border-dash border-white', hover: 'bg-inkRaised border-dash border-white', text: 'text-white' },
  yellowInk: { idle: 'bg-ink', hover: 'bg-inkHover', text: 'text-opusYellow' },
};

/** Week 8 hi-fi pill button (R4 Button). Ink primary, outline secondary. */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  arrow,
  leading,
  disabled,
  busy,
  full,
  width,
  onPress,
}: Props) {
  const [hover, setHover] = useState(false);
  const v = surface[variant];
  const onInk = variant === 'primary' || variant === 'outlineOnDark' || variant === 'yellowInk';
  const isDisabled = disabled || busy;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={width ? { width } : undefined}
      className={`flex-row items-center justify-center gap-8 rounded-pill ${height[size]} ${pad[size]} ${
        hover && !isDisabled ? v.hover : v.idle
      } ${full ? 'self-stretch' : ''} ${disabled ? 'opacity-40' : ''}`}
    >
      {busy ? (
        <ActivityIndicator color={onInk ? color.white : color.ink} />
      ) : (
        <View className="flex-row items-center gap-8">
          {leading && <Icon name={leading} />}
          <Text className={`font-semibold ${textSize[size]} ${v.text} ${size === 'hero' ? 'font-bold' : ''}`}>
            {label}
          </Text>
          {arrow && <Icon name={onInk ? 'arrowRightWhite' : 'arrowRight'} size={size === 'hero' ? s.icon : s.iconSmall} />}
        </View>
      )}
    </Pressable>
  );
}
