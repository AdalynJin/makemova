import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

import { asset } from '@/lib/ui';
import { size } from '@/tokens';

/** Figma: MOVA · Week 8 wordmark (140 × 19.89). `home`: 211.2 wide, on the homepage nav. */
export function Wordmark({ href = '/', home }: { href?: '/' | '/projects'; home?: boolean }) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel="Makemova home">
        <Image
          source={asset.wordmark}
          style={{
            width: home ? size.wordmarkHome : size.wordmark,
            height: home ? size.wordmarkHomeHeight : size.wordmarkHeight,
          }}
          contentFit="contain"
        />
      </Pressable>
    </Link>
  );
}
