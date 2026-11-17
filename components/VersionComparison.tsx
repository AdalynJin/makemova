import { Image } from 'expo-image';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import type { Version } from '@/lib/workspace-data';
import { cardShadow } from '@/lib/ui';
import { size, space } from '@/tokens';

export type Comparison = [number | null, number | null];
type Props = {
  versions: Version[];
  value: Comparison;
  onChange: (side: 0 | 1, number: number) => void;
  onChoose?: (number: number) => void;
  onUpload?: (side: 0 | 1) => void;
  onExit?: () => void;
};

export function VersionComparison({ versions, value, onChange, onChoose, onUpload, onExit }: Props) {
  const [picker, setPicker] = useState<{ side: 0 | 1; list: boolean } | null>(null);
  const available = picker ? versions.filter((v) => v.number !== value[1 - picker.side]) : [];
  const canChoose = value.every((number) => number !== null);
  const dismiss = () => setPicker(null);

  function renderSide(side: 0 | 1) {
    const number = value[side];
    const version = versions.find((v) => v.number === number);
    const open = () => setPicker({ side, list: version !== undefined });
    return (
      <View className="gap-12" style={{ flexBasis: size.compareImage, flexGrow: 1, flexShrink: 1 }}>
        <View className="flex-row items-center justify-between">
          <Text className="font-medium text-labelUi text-ink">
            {side === 0 ? 'A' : 'B'}{version ? ` · Version ${version.number}` : ''}
          </Text>
          {version && onExit && <Button label="Change" size="sm" variant="white" onPress={open} />}
        </View>
        {version ? (
          <View className="items-center justify-center rounded-10 bg-chip p-12" style={{ height: size.compareImageHeight }}>
            {version.source ? (
              <Image source={version.source} contentFit="contain" style={{ width: '100%', height: '100%' }} />
            ) : <Text className="font-regular text-labelUi text-secondaryText">Preview unavailable</Text>}
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={open}
            disabled={!onExit}
            className="items-center justify-center gap-8 rounded-10 border border-dashed border-secondaryText bg-white"
            style={{ height: size.compareImageHeight }}
          >
            {onExit && <Text accessible={false} className="font-bold text-heading text-ink">+</Text>}
            <Text className="font-medium text-labelUi text-ink">{onExit ? 'Add a version' : 'No screenshot yet'}</Text>
          </Pressable>
        )}
        {onChoose && version && (
          <Button label={`Use version ${version.number}`} variant="white" disabled={!canChoose} onPress={() => onChoose(version.number)} />
        )}
      </View>
    );
  }

  return (
    <View className="gap-16 rounded-24 bg-white p-24">
      <View className="flex-row items-center justify-between">
        <Text className="font-bold text-heading text-ink">{onExit ? 'Compare versions' : 'See what changed'}</Text>
        {onExit && <Button label="Exit comparison" variant="white" size="sm" onPress={onExit} />}
      </View>
      <View className="flex-row flex-wrap gap-24">{renderSide(0)}{renderSide(1)}</View>
      {onChoose && <Text className="font-regular text-labelUi text-secondaryText">Choose the version you want to revise. Comparing is free.</Text>}
      {picker && (
        <Modal transparent animationType="fade" onRequestClose={dismiss}>
          <View className="flex-1 items-center justify-center bg-ink/40 p-24">
            <View className="w-full gap-16 rounded-16 bg-white p-24" style={{ ...cardShadow, maxWidth: size.panel }}>
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-cardTitle text-ink">{picker.list ? 'Choose a saved version' : 'Add a version'}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Close version picker" onPress={dismiss}>
                  <Text className="font-medium text-cardTitle text-ink">×</Text>
                </Pressable>
              </View>
              {picker.list ? (
                <ScrollView style={{ maxHeight: size.compareImageHeight }} contentContainerStyle={{ gap: space[12] }}>
                  {available.length === 0 && <Text className="font-regular text-labelUi text-secondaryText">No other saved versions yet.</Text>}
                  {available.map((version) => (
                    <Pressable
                      accessibilityRole="button"
                      key={version.number}
                      onPress={() => { onChange(picker.side, version.number); dismiss(); }}
                      className="flex-row items-center justify-between gap-12 rounded-10 bg-paper p-12"
                    >
                      <View className="flex-1 gap-4">
                        <Text className="font-bold text-labelUi text-ink">Version {version.number}</Text>
                        {version.label && <Text numberOfLines={1} className="font-regular text-meta text-secondaryText">{version.label}</Text>}
                      </View>
                      {version.source && <Image source={version.source} style={{ width: size.previewThumb / 2, height: size.previewThumbHeight / 2 }} contentFit="contain" />}
                    </Pressable>
                  ))}
                </ScrollView>
              ) : (
                <Button label="Choose a saved version" variant="white" onPress={() => setPicker({ ...picker, list: true })} />
              )}
              {onUpload && (
                <Button label="Add a new screenshot" variant="white" onPress={() => { dismiss(); onUpload(picker.side); }} />
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
