import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { size } from '@/tokens';

type Props = { message?: string; onUndo?: () => void };

/** Figma: Deleted project · Undo (R5 · My projects content). Paper, 10 radius, 16 padding. */
export function DeletedProjectToast({ message = 'Project deleted.', onUndo }: Props) {
  return (
    <View accessibilityRole="alert" className="flex-row items-center gap-16 rounded-10 bg-paper p-16">
      <Text className="flex-1 font-medium text-labelUi text-ink">{message}</Text>
      {onUndo && <Button label="Undo" variant="secondary" size="sm" width={size.toastUndo} onPress={onUndo} />}
    </View>
  );
}
