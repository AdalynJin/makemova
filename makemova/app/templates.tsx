import { Image } from 'expo-image';
import { Redirect, router, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/Button';
import { CrewMosaic } from '@/components/CrewMosaic';
import { Motion } from '@/components/Motion';
import { useAuth } from '@/lib/auth';
import { asset } from '@/lib/ui';
import { opacity, size } from '@/tokens';

type Template = {
  kind: string;
  name: string;
  lead: string;
  art: 'cafe' | 'tandem';
  /** Café → the read-only café example (Flow A). Tandem → Flow C set-up, pre-filled (Flow C screens are not built yet). */
  to: Href;
};

const templates: Template[] = [
  {
    kind: 'WEB PAGE / GUIDED PROJECT',
    name: 'Campus café',
    lead: 'Practise hierarchy, compare directions and explain a design choice.',
    art: 'cafe',
    to: '/projects/example',
  },
  {
    kind: 'APP ICON / FOCUSED PRACTICE',
    name: 'Tandem',
    lead: 'Practise small-size clarity using two app-icon versions.',
    art: 'tandem',
    to: { pathname: '/projects/new', params: { template: 'tandem' } },
  },
];

/** Figma: Shared · Explore practice templates (11125:41603), opened from "Browse templates →" on My projects. */
export default function Templates() {
  const { session, loading } = useAuth();
  if (loading) return <View className="flex-1 bg-paper" />;
  if (!session) return <Redirect href="/sign-in" />;

  return (
    <View className="flex-1 bg-paper">
      <AppNav />
      <View className="flex-1">
        <CrewMosaic opacity={opacity.patternProjects} />
        <ScrollView className="flex-1" contentContainerClassName="items-center pt-64 pb-96">
          <View className="w-pageContent gap-28">
            <Text className="font-semibold text-templateEyebrow text-ink">PRACTICE TEMPLATES</Text>
            <View>
              <Text className="font-bold text-templateTitle text-ink">A starting point.</Text>
              <View className="self-start">
                <Text className="font-bold text-templateTitle text-ink">Room to make it yours.</Text>
                {/* Figma: MOVA · Motion · hello, just after "yours.". Anchored to the text end so it never overlaps. */}
                <Motion
                  name="hello"
                  width={size.templateHello}
                  style={{ position: 'absolute', left: '100%', marginLeft: size.templateHelloGap, top: size.templateHelloTop }}
                />
              </View>
            </View>
            <Text className="font-regular text-templateLead text-secondaryText">
              Pick an example and practise one design decision.
            </Text>

            <View className="flex-row gap-24">
              {templates.map((t) => (
                <View key={t.name} className="flex-1 gap-16 rounded-16 bg-white p-24">
                  <View className="h-templateArt items-center overflow-hidden rounded-12 bg-paper pt-16">
                    {t.art === 'cafe' ? (
                      <Image
                        source={asset.templateCafe}
                        accessibilityLabel="Campus café web page, version 2"
                        style={{ width: size.templateCafe, height: size.templateCafeHeight }}
                        contentFit="contain"
                      />
                    ) : (
                      <Image
                        source={asset.templateTandem}
                        accessibilityLabel="Tandem app icon, version 2"
                        style={{ width: size.templateTandem, height: size.templateTandem }}
                        contentFit="contain"
                      />
                    )}
                  </View>
                  <Text className="font-semibold text-templateEyebrow text-secondaryText">{t.kind}</Text>
                  <Text className="font-bold text-templateName text-ink">{t.name}</Text>
                  <Text className="font-regular text-templateBody text-secondaryText">{t.lead}</Text>
                  <Text className="font-regular text-templateMeta text-secondaryText">
                    {'Template · free    Critique · 5 credits'}
                  </Text>
                  <Button label="Use this template →" size="lg" full onPress={() => router.push(t.to)} />
                </View>
              ))}
            </View>

            <Button
              label="Bring my own work instead"
              variant="secondary"
              size="lg"
              width={size.templateBringOwn}
              onPress={() => router.push('/projects/new')}
            />
            <Text className="font-regular text-templateNote text-secondaryText">
              Any icon, poster, illustration, interface or website. Feedback follows your goal.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
