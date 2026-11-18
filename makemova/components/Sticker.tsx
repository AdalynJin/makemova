import { Image } from 'expo-image';
import { View } from 'react-native';

import { asset } from '@/lib/ui';
import { crewArt } from '@/tokens';

/** Crew v2 pose: mate = Mate · Orient, mateEncourage = Mate · Encourage, versa = Compare, opus = Read, arti = Focus. */
export type Crew = keyof typeof crewArt;

type Props = {
  crew: Crew;
  /** Figma instance width (Refined crew · visual). The frame keeps the master's ratio. */
  width?: number;
  /** Square box the sticker fits inside, centred. Used where no Figma width is set. */
  size?: number;
  style?: object;
};

/**
 * Figma: Makemova geometric / Sticker v2 (Refined sticker masters 11203:19606).
 * One SVG exported from the master, die-cut border and shadow included.
 * The view is the component frame; the art overflows it exactly as in Figma, with no box behind it.
 */
export function Sticker({ crew, width, size, style }: Props) {
  const { art, box, offset } = crewArt[crew];
  const scale = width ? width / box[0] : Math.min((size ?? box[0]) / box[0], (size ?? box[1]) / box[1]);
  const frameW = box[0] * scale;
  const frameH = box[1] * scale;
  const outerW = width ? frameW : (size ?? frameW);
  const outerH = width ? frameH : (size ?? frameH);
  return (
    <View pointerEvents="none" style={[{ width: outerW, height: outerH }, style]}>
      <Image
        source={asset.crewV2[crew]}
        style={{
          position: 'absolute',
          left: (outerW - frameW) / 2 - offset[0] * scale,
          top: (outerH - frameH) / 2 - offset[1] * scale,
          width: art[0] * scale,
          height: art[1] * scale,
        }}
        contentFit="fill"
      />
    </View>
  );
}
