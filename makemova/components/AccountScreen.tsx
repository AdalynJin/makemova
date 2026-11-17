import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { PublicNav } from '@/components/PublicNav';
import { asset, cardShadow } from '@/lib/ui';
import { size } from '@/tokens';

type Props = { title: string; subtitle: string; children: ReactNode; footer: ReactNode };

/** Figma: Sign in / Create account — shape grid, Mate peek, 480 card. */
export function AccountScreen({ title, subtitle, children, footer }: Props) {
  return (
    <View className="flex-1 bg-canvas">
      <PublicNav />
      <ScrollView className="flex-1" contentContainerClassName="items-center pt-96 pb-64">
        <Image
          source={asset.bgAccount}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: size.accountBg, opacity: 0.75 }}
          contentFit="cover"
          contentPosition="top"
        />
        <View className="w-authCard">
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: -size.peekClipHeight,
              left: size.peekOffset,
              width: size.peekClip,
              height: size.peekClipHeight,
              overflow: 'hidden',
            }}
          >
            <Image
              source={asset.mateShowTheWay}
              style={{ position: 'absolute', left: -size.peekInsetX, top: -size.peekInsetY, width: size.mateShowTheWay, height: size.mateShowTheWayHeight }}
            />
          </View>
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
        </View>
        <View className="mt-20 flex-row items-center gap-6">
          <Icon name="helpSmall" />
          <Text className="font-regular text-bodySmall text-secondaryText">Need help? Open Quick guide from the top bar.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
