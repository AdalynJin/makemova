import { Image } from 'expo-image';
import { View } from 'react-native';

import { asset } from '@/lib/ui';
import { crewArt } from '@/tokens';

/**
 * Crew v3 art as placed on the Refined prototype: the four stickers (mate, arti, versa, opus)
 * and the character peeks that stand on cards (mateShowTheWay, mateMake, artiInspect …).
 */
export type Crew = keyof typeof crewArt;

type Props = {
  crew: Crew;
  /** Figma placement frame width. Height keeps the frame's ratio. */
  width?: number;
  /** Square box the frame fits inside, centred. Used where no Figma width is set. */
  size?: number;
  style?: object;
};

/**
 * Figma: Sticker v3 / Character peek (Refined 11085:17520). One PNG exported at 2x from the placement,
 * die-cut edge and shadow included. The view is the placement frame; the art overflows it exactly as in
 * Figma (peeks rise above the card they stand on), with no box behind it.
 */
export function Sticker({ crew, width, size, style }: Props) {
  const { box, render } = crewArt[crew];
  const scale = width ? width / box[0] : Math.min((size ?? box[0]) / box[0], (size ?? box[1]) / box[1]);
  const frameW = box[0] * scale;
  const frameH = box[1] * scale;
  const outerW = width ? frameW : (size ?? frameW);
  const outerH = width ? frameH : (size ?? frameH);
  return (
    <View pointerEvents="none" style={[{ width: outerW, height: outerH }, style]}>
      <Image
        source={asset.crewV3[crew]}
        style={{
          position: 'absolute',
          left: (outerW - frameW) / 2 + render[0] * scale,
          top: (outerH - frameH) / 2 + render[1] * scale,
          width: render[2] * scale,
          height: render[3] * scale,
        }}
        contentFit="fill"
      />
    </View>
  );
}
