import { Image } from 'expo-image';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { Version } from '@/lib/workspace-data';
import { cardShadow } from '@/lib/ui';
import { size, space } from '@/tokens';

export function VersionTimeline({
  versions, selected, onSelect,
}: {
  versions: Version[];
  selected: number | null;
  onSelect: (version: number) => void;
}) {
  const [preview, setPreview] = useState<{ number: number; top: number } | null>(null);
  const scrollOffset = useRef(0);
  const item = versions.find((version) => version.number === preview?.number);
  const count = Math.min(versions.length, 7);

  return (
    <View
      className="absolute left-0 z-10"
      style={{ top: (size.artworkHeight - size.versionRow * count) / 2 }}
    >
      <ScrollView
        style={{ maxHeight: size.versionRow * count }}
        onScroll={({ nativeEvent }) => {
          scrollOffset.current = nativeEvent.contentOffset.y;
          setPreview(null);
        }}
        scrollEventThrottle={16}
      >
        {versions.map((version, index) => {
          const current = version.number === selected;
          const showPreview = () => setPreview({ number: version.number, top: index * size.versionRow - scrollOffset.current });
          return (
            <Pressable
              key={version.number}
              accessibilityRole="button"
              accessibilityState={{ selected: current }}
              onPress={() => onSelect(version.number)}
              onHoverIn={showPreview}
              onHoverOut={() => setPreview(null)}
              onFocus={showPreview}
              onBlur={() => setPreview(null)}
              className="h-versionRow flex-row items-center"
            >
              <View className="h-versionRow w-16 items-center justify-center">
                <View className="absolute h-versionRow border-l border-border" />
                <View className={`rounded-pill ${current ? 'h-versionDotCurrent w-versionDotCurrent bg-ink' : 'h-versionDot w-versionDot bg-border'}`} />
              </View>
              <View className={`h-versionLabelHeight w-versionLabel justify-center rounded-6 px-6 ${current ? 'bg-compare' : ''}`}>
                <Text className="font-regular text-labelUi text-ink">Version {version.number}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      {item?.source && preview && (
        <View
          pointerEvents="none"
          accessible={false}
          className="absolute rounded-10 border border-border bg-white p-8"
          style={{ ...cardShadow, left: size.versionLabel + space[24], top: preview.top }}
        >
          <Image source={item.source} style={{ width: size.previewThumb, height: size.previewThumbHeight }} contentFit="contain" />
        </View>
      )}
    </View>
  );
}
