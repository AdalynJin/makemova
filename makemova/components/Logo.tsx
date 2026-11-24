import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

import { asset } from '@/lib/ui';
import { size } from '@/tokens';

type Props = {
  /** Larger, on the homepage nav. */
  home?: boolean;
  /** Already on the homepage: go back to its top instead of opening it again. */
  onHome?: () => void;
};

/** Figma: Makemova / App icon / Nav (11675:32760). Always leads to the homepage. */
export function Logo({ home, onHome }: Props) {
  const side = home ? size.logoHome : size.logo;
  return (
    <Link
      href="/"
      asChild
      onPress={(event) => {
        if (!onHome) return;
        event.preventDefault();
        onHome();
      }}
    >
      <Pressable accessibilityRole="link" accessibilityLabel="Makemova home">
        <Image source={asset.logoMark} style={{ width: side, height: side }} contentFit="contain" />
      </Pressable>
    </Link>
  );
}
