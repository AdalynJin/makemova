import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Motion } from '@/components/Motion';
import { useAuth } from '@/lib/auth';
import { credits } from '@/lib/credits';
import { size } from '@/tokens';

type Plan = {
  name: string;
  price: string;
  note: string;
  features: readonly string[];
  action: string;
};

const plans: Plan[] = [
  {
    name: 'Free Preview',
    price: 'Free',
    note: 'Try the first stages',
    features: ['1 included critique', 'Project setup and first-stage guidance', 'Continue with a Project Pass'],
    action: 'Included',
  },
  {
    name: 'Project Pass',
    price: 'One payment',
    note: 'One project you choose',
    features: ['4 included critiques', 'All stages, revisions and reflection', 'Extra use priced before you start'],
    action: 'Get Project Pass',
  },
  {
    name: 'Studio',
    price: 'Per month',
    note: 'Ongoing practice',
    features: ['400 credits each month', '2 active projects', 'History and decisions across projects'],
    action: 'Current plan',
  },
];

/**
 * Figma: Account · Plans (11125:52604), from "View plans" on Credits & usage and the homepage plan cards.
 * The member's plan comes from lib/credits (static: Studio). There is no checkout yet, so
 * "Get Project Pass" does nothing, as in the prototype.
 */
export default function Plans() {
  const { session, loading } = useAuth();
  if (loading) return <View className="flex-1 bg-paper" />;
  if (!session) return <Redirect href="/sign-in" />;

  return (
    <View className="flex-1 bg-paper">
      <AppNav />
      <ScrollView className="flex-1" contentContainerClassName="items-center pt-48 pb-96">
        <View className="w-pageContent">
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push('/account/credits')}
            className="flex-row items-center gap-6 self-start"
          >
            <Icon name="arrowLeft" size={size.iconSmall} />
            <Text className="font-medium text-caption text-secondaryText">Credits & usage</Text>
          </Pressable>

          <View className="mt-40 gap-8 self-start">
            <View className="self-start">
              <Text className="font-extrabold text-accountTitle text-ink">Choose how to keep learning.</Text>
              {/* Figma: MOVA · Motion · brief, flag up just after the title. */}
              <Motion
                name="brief"
                width={size.plansBrief}
                style={{ position: 'absolute', left: '100%', marginLeft: size.plansBriefGap, top: size.plansBriefTop }}
              />
            </View>
            <Text className="font-regular text-nav text-secondaryText">
              Start with your own work or a practice template. Credits are only used for new AI requests.
            </Text>
          </View>

          <View className="mt-40 flex-row gap-24">
            {plans.map((p) => {
              const current = p.name === credits.plan;
              return (
                <View
                  key={p.name}
                  className={`flex-1 gap-20 rounded-20 border p-24 ${
                    current ? 'border-mateOrange bg-selected' : 'border-border bg-white'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="font-bold text-h4 text-ink">{p.name}</Text>
                    {current && (
                      <View className="flex-row items-center gap-6 rounded-pill bg-white px-10 py-2">
                        <View className="h-6 w-6 rounded-pill bg-mateOrange" />
                        <Text className="font-medium text-caption text-ink">Current</Text>
                      </View>
                    )}
                  </View>
                  <View className="gap-4">
                    <Text className="font-bold text-planPrice text-ink">{p.price}</Text>
                    <Text className="font-medium text-caption text-secondaryText">{p.note}</Text>
                  </View>
                  <View className="gap-10">
                    {p.features.map((f) => (
                      <View key={f} className="flex-row items-center gap-8">
                        <Icon name="check" size={size.iconSmall} />
                        <Text className="font-regular text-nav text-ink">{f}</Text>
                      </View>
                    ))}
                  </View>
                  <Button
                    label={current ? 'Current plan' : p.action}
                    variant={p.name === 'Project Pass' && !current ? 'primary' : 'secondary'}
                    full
                  />
                </View>
              );
            })}
          </View>

          <View className="mt-40 gap-6 py-16">
            <Text className="font-bold text-h4 text-ink">Some tools need Project Pass or Studio</Text>
            <Text className="font-regular text-nav text-secondaryText">
              Deeper AI tools use credits. Manual compare and notes stay free.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
