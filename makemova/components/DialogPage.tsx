import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { Motion } from '@/components/Motion';
import { dialogShadow, scrim } from '@/lib/ui';
import { size } from '@/tokens';

export type DialogMotion = 'brief' | 'revise' | 'tutorials' | 'guide';

/** MOVA · Motion · <name> as each dialog page places it on the card's top edge. It plays and loops. */
const motions: Record<DialogMotion, { left: number; width: number; top: number }> = {
  brief: { left: size.motionBriefLeft, width: size.motionDialog, top: size.motionBriefTop },
  revise: { left: size.motionBriefLeft, width: size.motionRevise96, top: size.motionBriefTop },
  guide: { left: size.motionBriefLeft, width: size.motionDialog, top: size.motionBriefTop },
  tutorials: {
    left: size.motionTutorialsDialogLeft,
    width: size.motionTutorialsDialog,
    top: size.motionBriefTop + size.motionBriefHeight - size.motionTutorialsDialogHeight,
  },
};

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Card corner radius class: R4 dialogs use rounded-24, R5 and R6 dialogs rounded-10. */
  radius?: 'rounded-24' | 'rounded-10';
  /** Card width class: 560 (R4, R6), 480 (R5 confirmations) or 240 (R5 · Project actions). */
  width?: 'w-dialog' | 'w-dialogSmall' | 'w-projectActions' | 'w-dialogTutorial' | 'w-dialogRecord' | 'w-dialogSummary';
  /** R5 confirmations and R6 · Brief details have no drop shadow in Figma. */
  shadow?: boolean;
  /** Dialogs without a character on the card edge (Own project · Add a version and its swaps). */
  motion?: DialogMotion | null;
  /** A second character on the card edge (R6 · Quick guide shows Opus · Here’s a guide). */
  extra?: ReactNode;
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
  extra,
  children,
}: Props) {
  const m = motion ? motions[motion] : null;
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
          {m && motion && <Motion name={motion} width={m.width} style={{ position: 'absolute', left: m.left, top: m.top }} />}
          {extra}
        </View>
      </View>
    </Modal>
  );
}
