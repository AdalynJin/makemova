import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { asset, dialogShadow, scrim } from '@/lib/ui';
import { size } from '@/tokens';

export type DialogMotion = 'brief' | 'revise' | 'tutorials';

/** MOVA · Motion · <name>, Frame=01, as each dialog page places it on the card's top edge. */
const motions: Record<DialogMotion, { source: number; left: number; width: number; height: number }> = {
  brief: { source: asset.motionBrief, left: size.motionBriefLeft, width: size.motionBrief, height: size.motionBriefHeight },
  revise: { source: asset.motionDialogRevise, left: size.motionBriefLeft, width: size.motionRevise96, height: size.motionBriefHeight },
  tutorials: {
    source: asset.motionTutorials,
    left: size.motionTutorialsDialogLeft,
    width: size.motionTutorialsDialog,
    height: size.motionTutorialsDialogHeight,
  },
};

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Card corner radius class: R4 dialogs use rounded-24, R5 and R6 dialogs rounded-10. */
  radius?: 'rounded-24' | 'rounded-10';
  /** Card width class: 560 (R4, R6), 480 (R5 confirmations) or 240 (R5 · Project actions). */
  width?: 'w-dialog' | 'w-dialogSmall' | 'w-projectActions';
  /** R5 confirmations and R6 · Brief details have no drop shadow in Figma. */
  shadow?: boolean;
  motion?: DialogMotion;
  children: ReactNode;
};

/**
 * Figma: Dialog page · R4 / R5 / R6 — ink scrim at 32% with a 6 background blur,
 * the card centred, and a MOVA motion standing on the card's top edge.
 */
export function DialogPage({
  visible,
  onClose,
  radius = 'rounded-24',
  width = 'w-dialog',
  shadow = true,
  motion = 'brief',
  children,
}: Props) {
  const m = motions[motion];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center" style={scrim}>
        <Pressable accessibilityLabel="Close" onPress={onClose} className="absolute bottom-0 left-0 right-0 top-0" />
        <View className={width}>
          <View
            className={`overflow-hidden border border-border bg-white ${radius}`}
            style={shadow ? dialogShadow : undefined}
          >
            {children}
          </View>
          <Image
            source={m.source}
            style={{ position: 'absolute', left: m.left, top: size.motionBriefTop, width: m.width, height: m.height }}
            contentFit="contain"
          />
        </View>
      </View>
    </Modal>
  );
}
