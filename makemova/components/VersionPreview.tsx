import { Image, type ImageSource } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

type Props = {
  source: ImageSource | number | string;
  /** The box the screen may use. A wide screen fills the width; a tall one fills the height. */
  maxWidth: number;
  maxHeight: number;
  /** Height ÷ width before the image has loaded (the café screens are 1088 × 694). */
  ratio?: number;
  label?: string;
  /** Keep the box at maxWidth × maxHeight and centre the screen in it (compare panes). */
  fill?: boolean;
  children?: React.ReactNode;
};

/**
 * Figma: Version preview. Shows the whole uploaded screen at its own proportions: never cropped,
 * never stretched. A phone UI stays a tall phone UI; a desktop page stays wide.
 * Children (feedback pins) are laid over the drawn screen, in its coordinates.
 */
export function VersionPreview({ source, maxWidth, maxHeight, ratio: initial = 694 / 1088, label, fill, children }: Props) {
  const [ratio, setRatio] = useState(initial);
  let width = maxWidth;
  let height = width * ratio;
  if (height > maxHeight) {
    height = maxHeight;
    width = height / ratio;
  }
  const art = (
    <View style={{ width, height }}>
      <Image
        source={source}
        accessibilityLabel={label}
        style={{ width, height }}
        contentFit="contain"
        onLoad={(e) => {
          const { width: w, height: h } = e.source;
          if (w && h) setRatio(h / w);
        }}
      />
      {children}
    </View>
  );
  if (!fill) return <View className="items-center" style={{ width: maxWidth }}>{art}</View>;
  return (
    <View className="items-center justify-center" style={{ width: maxWidth, height: maxHeight }}>
      {art}
    </View>
  );
}
