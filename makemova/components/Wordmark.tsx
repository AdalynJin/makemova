import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

import { asset } from '@/lib/ui';
import { size } from '@/tokens';

/** Figma: MOVA · Week 8 wordmark (140 × 19.89) */
export function Wordmark({ href = '/' }: { href?: '/' | '/projects' }) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" accessibilityLabel="Makemova home">
        <Image source={asset.wordmark} style={{ width: size.wordmark, height: size.wordmarkHeight }} contentFit="contain" />
      </Pressable>
    </Link>
  );
}
