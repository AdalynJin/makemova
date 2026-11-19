import { View } from 'react-native';

import { Button } from '@/components/Button';

export type EditItem = { label: string; onPress: () => void };

/**
 * Figma: R9 · Edit dropdown (11125:41814). 240 wide, 12 padding, 8 gap, Secondary buttons.
 * "Edit source" and "Add screenshot" on every stage; Brief adds "Brief details".
 */
export function EditDropdown({ items }: { items: EditItem[] }) {
  return (
    <View
      accessibilityRole="menu"
      className="w-editDropdown gap-8 rounded-10 border border-border bg-white p-12"
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      {items.map((item) => (
        <Button key={item.label} label={item.label} variant="secondary" size="menu" full onPress={item.onPress} />
      ))}
    </View>
  );
}
