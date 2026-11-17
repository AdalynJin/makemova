import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { asset, softShadow } from '@/lib/ui';
import { size } from '@/tokens';

/** Figma: My projects · "Choose how to start" — two start cards with Mate and Arti peeking. */
export function ChooseStart() {
  return (
    <View className="flex-row gap-24">
      <View className="w-choiceCard h-choiceCardHeight gap-18 rounded-24 bg-selected p-28" style={softShadow}>
        <Image
          source={asset.peekMateMake}
          style={{
            position: 'absolute',
            left: size.peekMateMakeLeft,
            top: -size.peekMateMakeHeight,
            width: size.peekMateMake,
            height: size.peekMateMakeHeight,
          }}
        />
        <Text className="font-medium text-labelSmall text-ink">YOUR OWN WORK</Text>
        <Text className="font-bold text-choiceTitle text-ink">Bring your own work</Text>
        <Text className="font-regular text-bodyLarge text-secondaryText">
          Set a goal and get help with one design decision.
        </Text>
        <Button label="Choose your work →" size="lg" full onPress={() => router.push('/projects/new')} />
      </View>
      <View className="w-choiceCard h-choiceCardHeight gap-18 rounded-24 bg-compare p-28" style={softShadow}>
        <Image
          source={asset.peekArtiInspect}
          style={{
            position: 'absolute',
            left: size.peekArtiLeft,
            top: -size.peekArtiHeight,
            width: size.peekArti,
            height: size.peekArtiHeight,
          }}
        />
        <Text className="font-medium text-labelSmall text-ink">GUIDED PRACTICE</Text>
        <Text className="font-bold text-choiceTitle text-ink">Explore practice templates</Text>
        <Text className="font-regular text-bodyLarge text-secondaryText">Learn by trying, comparing and explaining.</Text>
        <Button label="Browse templates →" variant="white" size="lg" full onPress={() => router.push('/projects/example')} />
      </View>
    </View>
  );
}
