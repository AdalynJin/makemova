import { Redirect, router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Motion } from '@/components/Motion';
import { useAuth } from '@/lib/auth';
import { credits } from '@/lib/credits';
import { size } from '@/tokens';

const rates = [
  { topic: 'Tool or design question', on: 'Any plan', cost: 1 },
  { topic: 'Extra explanation / next step', on: 'New request only', cost: 2 },
  { topic: 'Quick critique · one work version', on: 'Preview · Pass · Studio', cost: 5 },
  { topic: 'Deep critique · work + context', on: 'Project Pass · Studio', cost: 8 },
  { topic: 'AI comparison · two directions', on: 'Project Pass · Studio', cost: 6 },
  { topic: 'Recall past choices with AI', on: 'Project Pass · Studio', cost: 2 },
] as const;

const free = [
  'Add screens',
  'Switch stages or versions',
  'Compare manually',
  'Save decisions',
  'Revise and reflect',
  'Reopen saved feedback',
] as const;

function Stat({ label, value, note, used }: { label: string; value: number; note: string; used?: number }) {
  return (
    <View className="w-creditsColumn gap-8 rounded-16 border border-border bg-white p-24">
      <Text className="font-medium text-caption text-secondaryText">{label}</Text>
      <Text className="font-extrabold text-accountTitle text-ink">{value}</Text>
      <Text className="font-medium text-caption text-secondaryText">{note}</Text>
      {used !== undefined && (
        <View className="h-usageBar overflow-hidden rounded-pill bg-border">
          <View className="h-usageBar rounded-pill bg-ink" style={{ width: `${used * 100}%` }} />
        </View>
      )}
    </View>
  );
}

/** Figma: Account · Credits & usage (11125:52489), opened from the credits pill and "See every AI credit rate →". */
export default function Credits() {
  const { session, loading } = useAuth();
  if (loading) return <View className="flex-1 bg-paper" />;
  if (!session) return <Redirect href="/sign-in" />;

  return (
    <View className="flex-1 bg-paper">
      <AppNav />
      <ScrollView className="flex-1" contentContainerClassName="items-center pt-48 pb-96">
        <View className="w-pageContent gap-40">
          <View className="flex-row items-end justify-between">
            <View className="gap-8">
              <Text className="font-extrabold text-accountTitle text-ink">Credits & usage</Text>
              <Text className="font-regular text-nav text-secondaryText">
                {`${credits.plan} · ${credits.allowance} credits a month. Cost depends on the AI action.`}
              </Text>
            </View>
            <Button label="View plans" variant="secondary" arrow onPress={() => router.push('/account/plans')} />
            {/* Figma: MOVA · Motion · guide points at "View plans". */}
            <Motion
              name="guide"
              width={size.creditsGuide}
              style={{ position: 'absolute', left: size.creditsGuideLeft, top: size.creditsGuideTop }}
            />
          </View>

          <View className="flex-row gap-24">
            <Stat label="Credits remaining" value={credits.remaining} note={`Resets ${credits.resets}`} />
            <Stat label="Monthly allowance" value={credits.allowance} note={`${credits.plan} plan`} />
            <Stat
              label="Used this cycle"
              value={credits.allowance - credits.remaining}
              note={`${credits.requests} AI requests`}
              used={(credits.allowance - credits.remaining) / credits.allowance}
            />
          </View>

          <View className="flex-row items-start gap-24">
            <View className="flex-1 overflow-hidden rounded-16 border border-border bg-white">
              <View className="flex-row gap-16 border-b border-border px-24 py-16">
                <Text className="w-creditTopicColumn font-bold text-tableHead text-ink">ONLY A NEW AI REQUEST USES CREDITS</Text>
                <Text className="w-creditPlanColumn font-bold text-tableHead text-ink">AVAILABLE ON</Text>
                <Text className="font-bold text-tableHead text-ink">COST</Text>
              </View>
              {rates.map((r, i) => (
                <View
                  key={r.topic}
                  className={`flex-row items-center gap-16 px-24 py-14 ${i < rates.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <Text className="w-creditTopicColumn font-regular text-nav text-ink">{r.topic}</Text>
                  <Text className="w-creditPlanColumn font-medium text-caption text-secondaryText">{r.on}</Text>
                  <View className="h-creditCost flex-row items-center gap-6 rounded-pill bg-paper px-12">
                    <Icon name="zap" size={size.iconXs} />
                    <Text className="font-medium text-caption text-ink">{r.cost === 1 ? '1 credit' : `${r.cost} credits`}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View className="w-creditsColumn gap-12 rounded-16 border border-border bg-white p-24">
              <Text className="font-bold text-h4 text-ink">Always free · 0 credits</Text>
              <Text className="font-regular text-nav text-secondaryText">Only new AI responses use credits.</Text>
              {free.map((f) => (
                <View key={f} className="flex-row items-center gap-10">
                  <Icon name="check" size={size.iconSmall} />
                  <Text className="font-regular text-nav text-ink">{f}</Text>
                </View>
              ))}
              <Text className="font-medium text-caption text-secondaryText">
                Includes the explanation and one next step. Follow-ups cost 2 credits.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
