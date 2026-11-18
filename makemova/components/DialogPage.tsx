import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { asset, dialogShadow, scrim } from '@/lib/ui';
import { size } from '@/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Card corner radius class: R4 dialogs use rounded-24, R6 dialogs rounded-10. */
  radius?: 'rounded-24' | 'rounded-10';
  children: ReactNode;
};

/**
 * Figma: Dialog page · R4 / R6 — ink scrim at 32%, a 560 card centred,
 * and MOVA · Motion · brief (Frame=01) standing on the card's top edge.
 */
export function DialogPage({ visible, onClose, radius = 'rounded-24', children }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center" style={scrim}>
        <Pressable accessibilityLabel="Close" onPress={onClose} className="absolute bottom-0 left-0 right-0 top-0" />
        <View className="w-dialog">
          <View className={`overflow-hidden border border-border bg-white ${radius}`} style={dialogShadow}>
            {children}
          </View>
          <Image
            source={asset.motionBrief}
            style={{
              position: 'absolute',
              left: size.motionBriefLeft,
              top: size.motionBriefTop,
              width: size.motionBrief,
              height: size.motionBriefHeight,
            }}
            contentFit="contain"
          />
        </View>
      </View>
    </Modal>
  );
}
