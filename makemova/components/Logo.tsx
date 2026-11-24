import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

import { asset } from '@/lib/ui';
import { size } from '@/tokens';

/** Figma: Makemova / App icon / Nav (11675:32760). `home`: larger, on the homepage nav. */
export function Logo({ href = '/', home }: { href?: '/' | '/projects'; home?: boolean }) {
  const side = home ? size.logoHome : size.logo;
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel="Makemova home">
        <Image source={asset.logoMark} style={{ width: side, height: side }} contentFit="contain" />
      </Pressable>
    </Link>
  );
}
