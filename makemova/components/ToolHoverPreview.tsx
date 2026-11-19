import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import type { Tool } from '@/components/MovaToolCard';
import { asset, hoverShadow } from '@/lib/ui';
import { size } from '@/tokens';

const preview: Record<Tool, { name: string; intro: string; surface: string; top: number; motion: number }> = {
  critique: {
    name: 'Critique',
    intro: 'Get feedback on one version and find one concrete change to try.',
    surface: 'bg-previewCritique border-previewCritiqueBorder',
    top: size.toolPreviewTopCritique,
    motion: asset.motionCritique,
  },
  compare: {
    name: 'Compare',
    intro: 'Put two versions side by side and choose which one to revise.',
    surface: 'bg-previewCompare border-previewCompareBorder',
    top: size.toolPreviewTopCompare,
    motion: asset.motionCompare,
  },
  tutorials: {
    name: 'Tutorials',
    intro: 'Follow a short guide and try the technique on your own screen.',
    surface: 'bg-previewTutorials border-previewTutorialsBorder',
    top: size.toolPreviewTopTutorials,
    motion: asset.motionTutorials,
  },
};

/**
 * Figma: MOVA · Hover preview · <tool> (11125:42023, 42028, 42033). Shown on mouse enter, left of the tools panel.
 * The screenshot slot (312 × 132) waits for the three preview images; it shows its white fill until then.
 */
export function ToolHoverPreview({ tool }: { tool: Tool }) {
  const p = preview[tool];
  return (
    <View
      pointerEvents="none"
      className={`h-toolPreviewHeight w-toolPreview gap-9 rounded-20 border pb-15 pt-14 px-15 ${p.surface}`}
      style={[hoverShadow, { position: 'absolute', left: size.toolPreviewLeft, top: p.top }]}
    >
      <Text className="font-bold text-previewName text-ink">{p.name}</Text>
      <Text className="w-toolPreviewIntro font-regular text-previewIntro text-ink">{p.intro}</Text>
      <View className="h-toolPreviewShotHeight w-toolPreviewShot rounded-12 bg-white" />
      <Image
        source={p.motion}
        style={{
          position: 'absolute',
          left: size.toolPreviewMotionLeft,
          top: size.toolPreviewMotionTop,
          width: size.toolPreviewMotion,
          height: size.toolPreviewMotionHeight,
        }}
        contentFit="contain"
      />
    </View>
  );
}
