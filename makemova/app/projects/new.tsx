import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { AppNav } from '@/components/AppNav';
import { CrewMosaic } from '@/components/CrewMosaic';
import { AuthField } from '@/components/AuthField';
import { Button } from '@/components/Button';
import { ChoiceOption } from '@/components/ChoiceOption';
import { Icon } from '@/components/Icon';
import { Sticker } from '@/components/Sticker';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { cardShadow } from '@/lib/ui';
import { opacity, size } from '@/tokens';

const guidance = ['More guidance', 'Direction support', 'Targeted skill'] as const;
type Start = 'brief' | 'screen';

/** Figma: Flow A · Set up project (10551:5702) */
export default function NewProject() {
  const { session, loading } = useAuth();
  const [name, setName] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState<(typeof guidance)[number]>('More guidance');
  const [start, setStart] = useState<Start>('brief');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return null;
  if (!session) return <Redirect href="/sign-in" />;

  async function create() {
    if (!session) return;
    if (!name.trim()) {
      setError('Give your project a name to start.');
      return;
    }
    setBusy(true);
    setError(null);
    const { data, error: insertError } = await supabase
      .from('projects')
      .insert({ title: name.trim(), owner_id: session.user.id, status: 'active', skill_focus: level })
      .select('id')
      .single();
    if (insertError || !data) {
      setBusy(false);
      setError(insertError?.message ?? 'The project could not be saved.');
      return;
    }
    const { error: contextError } = await supabase.from('project_contexts').insert({
      project_id: data.id,
      goal: goal.trim() || null,
      audience: audience.trim() || null,
      brief_source: start === 'brief' ? 'guided' : 'own_work',
    });
    setBusy(false);
    if (contextError) setError(contextError.message);
    else router.replace(`/projects/${data.id}`);
  }

  return (
    <View className="flex-1 bg-paper">
      <AppNav />
      <View className="flex-1">
        {/* Figma: MOVA · Decorative background / Projects. Crew mosaic at 6.2%, repeat from the body top-left. */}
        <CrewMosaic opacity={opacity.patternProjects} />
        <ScrollView className="flex-1" contentContainerClassName="items-center pt-28 pb-96">
          <View className="w-setupContent gap-24">
            <Pressable
              accessibilityRole="link"
              onPress={() => router.push('/projects')}
              className="flex-row items-center gap-6 self-start"
            >
              <Icon name="arrowLeft" size={size.iconXs} />
              <Text className="font-medium text-labelSmall text-secondaryText">My projects</Text>
            </Pressable>

            <View className="flex-row items-end justify-between">
              <View className="gap-8">
                <Text className="font-bold text-pageTitle text-ink">Set up your project</Text>
                <Text className="font-regular text-bodyUi text-secondaryText">Set a goal and choose a starting point.</Text>
              </View>
              <View className="pb-8">
                <Button label="Four-stage guide" variant="white" size="sm" />
              </View>
            </View>

            <View className="gap-24 rounded-14 border border-border bg-white p-32" style={cardShadow}>
              <Sticker
                crew="mateEncourage"
                width={size.setupMate}
                style={{ position: 'absolute', left: size.setupMateLeft, top: size.setupMateTop }}
              />
              <View className="gap-16">
                <Text className="font-semibold text-cardTitle text-ink">1 · Project</Text>
                <View className="flex-row gap-16">
                  <View className="flex-1">
                    <AuthField label="Project name" value={name} onChangeText={setName} placeholder="Crumb bakery website" />
                  </View>
                  <View className="flex-1">
                    <AuthField
                      label="Who is it for?"
                      value={audience}
                      onChangeText={setAudience}
                      placeholder="Hiring managers who skim in two minutes"
                    />
                  </View>
                </View>
                <AuthField
                  label="What do you want to improve?"
                  value={goal}
                  onChangeText={setGoal}
                  placeholder="Make my case studies easy to find"
                />
              </View>

              <View className="gap-16">
                <View className="flex-row items-center justify-between">
                  <Text className="font-semibold text-cardTitle text-ink">2 · Guidance</Text>
                  <Button label="Help choosing" variant="quiet" size="sm" />
                </View>
                <View className="flex-row gap-12">
                  {guidance.map((g) => (
                    <ChoiceOption key={g} label={g} selected={level === g} onPress={() => setLevel(g)} />
                  ))}
                </View>
              </View>

              <View className="gap-16">
                <Text className="font-semibold text-cardTitle text-ink">3 · Starting point</Text>
                <View className="flex-row gap-12">
                  <ChoiceOption
                    label="Start with the brief"
                    hint="Read the goal, then make a first direction."
                    selected={start === 'brief'}
                    onPress={() => setStart('brief')}
                  />
                  <ChoiceOption
                    label="Bring a screen I already have"
                    hint="Add one PNG or JPG and go straight to Make."
                    selected={start === 'screen'}
                    onPress={() => setStart('screen')}
                  />
                </View>
              </View>

              {error && (
                <View className="rounded-12 bg-selected px-14 py-10">
                  <Text className="font-medium text-labelUi text-ink">{error}</Text>
                </View>
              )}

              <View className="flex-row items-center justify-end gap-12">
                <Button label="Cancel" variant="quiet" size="md" onPress={() => router.push('/projects')} />
                <Button label="Start project" arrow size="md" busy={busy} onPress={create} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
