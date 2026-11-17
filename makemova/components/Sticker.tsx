import { Image } from 'expo-image';
import { View } from 'react-native';

import { asset } from '@/lib/ui';

export type Crew = 'mate' | 'versa' | 'opus' | 'arti';
const src = { mate: asset.stMate, versa: asset.stVersa, opus: asset.stOpus, arti: asset.stArti } as const;

/** Figma: MOVA · Crew sticker — die-cut border under the art, same box. */
export function Sticker({ crew, size, style }: { crew: Crew; size: number; style?: object }) {
  const [cut, art] = src[crew];
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <Image source={cut} style={{ position: 'absolute', width: size, height: size }} contentFit="contain" />
      <Image source={art} style={{ position: 'absolute', width: size, height: size }} contentFit="contain" />
    </View>
  );
}
