import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { CrewMosaic } from '@/components/CrewMosaic';
import { Icon } from '@/components/Icon';
import { PublicNav } from '@/components/PublicNav';
import { Sticker } from '@/components/Sticker';
import { cardShadow } from '@/lib/ui';
import { opacity, size } from '@/tokens';

type Props = { title: string; subtitle: string; children: ReactNode; footer: ReactNode };

/** Figma: CH00a Sign in / CH00d Create account (Refined). Crew mosaic at 12.5%, Mate · Orient resting on the 480 card. */
export function AccountScreen({ title, subtitle, children, footer }: Props) {
  return (
    <View className="flex-1 bg-paper">
      <PublicNav />
      <View className="flex-1">
        {/* Figma: MOVA · Decorative background / Account. Fills the body under the nav, repeat from its top-left. */}
        <CrewMosaic opacity={opacity.patternAccount} />
        <ScrollView className="flex-1" contentContainerClassName="items-center pt-96 pb-64">
          <View className="w-authCard">
            <View className="gap-24 rounded-24 border border-border bg-white p-40" style={cardShadow}>
              <View className="h-iconBox w-iconBox items-center justify-center rounded-10 bg-border">
                <Icon name="folder" />
              </View>
              <View className="gap-8">
                <Text className="font-bold text-heading text-ink">{title}</Text>
                <Text className="font-regular text-bodyUi text-secondaryText">{subtitle}</Text>
              </View>
              {children}
              <View className="flex-row items-center justify-center gap-6">{footer}</View>
            </View>
            <Sticker crew="mate" width={size.signInMate} style={{ position: 'absolute', left: size.signInMateLeft, top: size.signInMateTop }} />
          </View>
          <View className="mt-20 flex-row items-center gap-6">
            <Icon name="helpSmall" />
            <Text className="font-regular text-bodySmall text-secondaryText">Need help? Open Quick guide from the top bar.</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
