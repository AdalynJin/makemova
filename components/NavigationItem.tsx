import { useState } from 'react';
import { Pressable, Text } from 'react-native';

export type NavigationItemState = 'default' | 'hover' | 'selected';

type Props = { label: string; state?: NavigationItemState; onPress?: () => void };

const surface: Record<NavigationItemState, string> = { default: '', hover: 'bg-border', selected: 'bg-selected' };

/** Figma: Navigation item */
export function NavigationItem({ label, state, onPress }: Props) {
  const [hovered, setHovered] = useState(false);
  const s: NavigationItemState = state ?? (hovered ? 'hover' : 'default');
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ selected: s === 'selected' }}
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      className={`rounded-12 p-16 ${surface[s]}`}
    >
      <Text className="font-bold text-action text-ink">{label}</Text>
    </Pressable>
  );
}
