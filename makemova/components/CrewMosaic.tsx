import { Image } from 'expo-image';
import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import { asset } from '@/lib/ui';
import { size } from '@/tokens';

type Props = {
  /** Layer opacity: opacity.patternWelcome, patternAccount or patternProjects. */
  opacity: number;
  /** How far above this view the repeat starts, so it lines up with the Figma frame origin. */
  originY?: number;
};

/**
 * Figma: Brand pattern · Crew mosaic (Refined).
 * 288 × 288 tiles of "05 · Crew mosaic" placed edge to edge from the frame origin,
 * clipped at the field boundary, one opacity for the whole layer.
 */
export function CrewMosaic({ opacity, originY = 0 }: Props) {
  const [field, setField] = useState({ w: 0, h: 0 });
  const tile = size.crewMosaicTile;
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== field.w || height !== field.h) setField({ w: width, h: height });
  };
  const firstRow = Math.floor(originY / tile);
  const cols = Math.ceil(field.w / tile);
  const rows = Math.ceil((field.h + originY) / tile) - firstRow;
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push(
        <Image
          key={`${r}-${c}`}
          source={asset.crewMosaicTile}
          style={{ position: 'absolute', left: c * tile, top: (firstRow + r) * tile - originY, width: tile, height: tile }}
          contentFit="fill"
        />,
      );
    }
  }
  return (
    <View
      pointerEvents="none"
      onLayout={onLayout}
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden', opacity }}
    >
      {tiles}
    </View>
  );
}
