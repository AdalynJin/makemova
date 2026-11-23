import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Sticker } from '@/components/Sticker';
import { softShadow } from '@/lib/ui';
import { size } from '@/tokens';

/**
 * Figma: Two ways to start (R5 · My projects, CH01b · First visit). Mate · Make and Arti · Inspect (crew v3)
 * stand on the cards. Choose your work → Flow B · CH01; Browse templates → Shared · Explore practice templates.
 */
export function ChooseStart() {
  return (
    <View className="flex-row gap-24">
      <View className="w-choiceCard h-choiceCardHeight gap-18 rounded-24 bg-selected p-28" style={softShadow}>
        <Sticker crew="mateMake" width={size.peekMateMake} style={{ position: 'absolute', left: size.peekMateMakeLeft, bottom: '100%' }} />
        <Text className="font-medium text-labelSmall text-ink">YOUR OWN WORK</Text>
        <Text className="font-bold text-choiceTitle text-ink">Bring your own work</Text>
        <Text className="font-regular text-bodyLarge text-secondaryText">
          Set a goal and get help with one design decision.
        </Text>
        <Button label="Choose your work →" size="lg" full onPress={() => router.push('/projects/new')} />
      </View>
      <View className="w-choiceCard h-choiceCardHeight gap-18 rounded-24 bg-compare p-28" style={softShadow}>
        <Sticker crew="artiInspect" width={size.peekArti} style={{ position: 'absolute', left: size.peekArtiLeft, bottom: '100%' }} />
        <Text className="font-medium text-labelSmall text-ink">GUIDED PRACTICE</Text>
        <Text className="font-bold text-choiceTitle text-ink">Explore practice templates</Text>
        <Text className="font-regular text-bodyLarge text-secondaryText">Learn by trying, comparing and explaining.</Text>
        <Button label="Browse templates →" variant="white" size="lg" full onPress={() => router.push('/templates')} />
      </View>
    </View>
  );
}
