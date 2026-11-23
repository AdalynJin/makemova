import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { CrewMosaic } from '@/components/CrewMosaic';
import { Icon, type IconName } from '@/components/Icon';
import { Motion, type MotionName } from '@/components/Motion';
import { PublicNav } from '@/components/PublicNav';
import { Sticker, type Crew } from '@/components/Sticker';
import { cardShadow } from '@/lib/ui';
import { opacity } from '@/tokens';

/** Who stands on the auth card: a still peek (feet on the card's top edge) or a looping motion. */
export type AccountArt =
  | { crew: Crew; width: number; left: number }
  | { motion: MotionName; width: number; left: number; top: number };

type Props = {
  title: string;
  subtitle: string;
  icon?: IconName;
  art: AccountArt;
  children?: ReactNode;
  footer?: ReactNode;
  /** CH00a and CH00d show "Need help? Open Quick guide from the top bar." under the card. */
  help?: boolean;
};

/**
 * Figma: CH00a Sign in, CH00b Reset password / Email sent, CH00c Set new password / Password saved,
 * CH00d Create account (Refined 11125:38700). Crew mosaic at 12.5% behind a 480 card.
 */
export function AccountScreen({ title, subtitle, icon = 'folder', art, children, footer, help }: Props) {
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
                <Icon name={icon} />
              </View>
              <View className="gap-8">
                <Text className="font-bold text-heading text-ink">{title}</Text>
                <Text className="font-regular text-bodyUi text-secondaryText">{subtitle}</Text>
              </View>
              {children}
              {footer ? <View className="flex-row items-center justify-center gap-6">{footer}</View> : null}
            </View>
            {'crew' in art ? (
              <Sticker crew={art.crew} width={art.width} style={{ position: 'absolute', left: art.left, bottom: '100%' }} />
            ) : (
              <Motion name={art.motion} width={art.width} style={{ position: 'absolute', left: art.left, top: art.top }} />
            )}
          </View>
          {help && (
            <View className="mt-20 flex-row items-center gap-6">
              <Icon name="helpSmall" />
              <Text className="font-regular text-bodySmall text-secondaryText">Need help? Open Quick guide from the top bar.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

/** Inline error / notice inside an auth card. */
export function AccountNote({ tone, children }: { tone: 'error' | 'notice'; children: string }) {
  return (
    <View className={`rounded-12 px-14 py-10 ${tone === 'error' ? 'bg-selected' : 'bg-compare'}`}>
      <Text className="font-medium text-labelUi text-ink">{children}</Text>
    </View>
  );
}
