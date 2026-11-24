import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Sticker } from '@/components/Sticker';
import { hoverShadow } from '@/lib/ui';
import { size } from '@/tokens';

type Props = { onClose: () => void };

/**
 * Figma: Critique saved · Status cue (11125:42048), shown after Confirm critique → Use 5 credits.
 * "Open a feedback pin to review." The pins appear on the critiqued version.
 */
export function CritiqueSaved({ onClose }: Props) {
  return (
    <View
      accessibilityRole="alert"
      className="w-critiqueToast flex-row items-center gap-12 rounded-16 border border-previewCritiqueBorder bg-critique px-16 py-14"
      style={[{ position: 'absolute', right: size.critiqueToastRight, bottom: size.critiqueToastBottom, zIndex: 4 }, hoverShadow]}
    >
      <View className="flex-1 gap-2">
        <Text className="font-semibold text-labelUi text-ink">Critique saved</Text>
        <Text className="font-regular text-bodySmall text-ink">Open a feedback pin to review.</Text>
      </View>
      <Sticker crew="versa" width={size.iconBox} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        onPress={onClose}
        className="h-dialogClose w-dialogClose items-center justify-center rounded-pill"
      >
        <Icon name="x" size={size.iconSmall} />
      </Pressable>
    </View>
  );
}
