import type { ReactNode } from 'react';
import { View } from 'react-native';

/** Figma: R4 dialog footer. Paper, top divider, 16 / 24 padding, actions to the right. */
export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <View className="flex-row items-center justify-end gap-12 border-t border-border bg-paper px-24 py-16">{children}</View>
  );
}
