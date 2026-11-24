import { useState } from 'react';
import { Pressable, Text, View, type DimensionValue } from 'react-native';

import { Sticker } from '@/components/Sticker';
import { hoverShadow } from '@/lib/ui';
import { size } from '@/tokens';

type Props = {
  number: number;
  title: string;
  body: string;
  /** Figma property Side: where the card opens. */
  side?: 'left' | 'right';
  /** Figma property State. Uncontrolled: hover or click opens it. */
  state?: 'closed' | 'open';
  /** Position on the drawn screen: px, or a share of it ("22%") so pins follow any screen size. */
  left: DimensionValue;
  top: DimensionValue;
};

/**
 * Figma: Makemova / Feedback pin / Versa (11125:65033). A numbered pin on the critiqued screen.
 * Prototype: While hovering or On click → State=Open (the "AI feedback · this version" card).
 */
export function FeedbackPin({ number, title, body, side = 'right', state, left, top }: Props) {
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = state ? state === 'open' : hover || pinned;
  return (
    <View style={{ position: 'absolute', left, top, zIndex: open ? 3 : 2 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Feedback ${number}: ${title}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setPinned(!pinned)}
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
        className="h-feedbackPin w-feedbackPin items-center justify-center rounded-pill border-focus border-white bg-versaPink"
        style={hoverShadow}
      >
        <Text className="font-bold text-labelSmall text-ink">{number}</Text>
      </Pressable>
      {open && (
        <View
          className="w-feedbackPinCard gap-6 rounded-16 border-radio border-versaPink bg-white p-16"
          style={[
            { position: 'absolute', top: size.feedbackPin + size.feedbackPin / 4 },
            side === 'right' ? { left: 0 } : { right: 0 },
            hoverShadow,
          ]}
        >
          <Sticker crew="versa" width={size.feedbackPin} style={{ position: 'absolute', right: size.feedbackPin / 2, top: -size.feedbackPin }} />
          <Text className="font-medium text-meta text-secondaryText">AI FEEDBACK · THIS VERSION</Text>
          <Text className="font-medium text-labelUi text-ink">{title}</Text>
          <Text className="font-regular text-bodySmall text-ink">{body}</Text>
        </View>
      )}
    </View>
  );
}
