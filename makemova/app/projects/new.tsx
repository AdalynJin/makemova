import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { AppNav } from '@/components/AppNav';
import { CrewMosaic } from '@/components/CrewMosaic';
import { AuthField } from '@/components/AuthField';
import { Button } from '@/components/Button';
import { ChoiceOption } from '@/components/ChoiceOption';
import { Dropzone } from '@/components/Dropzone';
import { FileChip } from '@/components/FileChip';
import { GuidanceOptions } from '@/components/GuidanceOptions';
import { Icon } from '@/components/Icon';
import { QuickGuide } from '@/components/QuickGuide';
import { ReviewScreen } from '@/components/ReviewScreen';
import { Sticker } from '@/components/Sticker';
import { UploadTips } from '@/components/UploadTips';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import {
  WORK_UNAVAILABLE,
  checkWork,
  describeWork,
  pickWorkFile,
  releaseWork,
  workPath,
  type Work,
} from '@/lib/work';
import { cardShadow } from '@/lib/ui';
import { opacity, size } from '@/tokens';

const guidance = ['More guidance', 'Direction support', 'Targeted skill'] as const;
type Start = 'brief' | 'screen';

/**
 * Choosing a starting point swaps the screen between the two Refined frames:
 * Flow A · CH02 · Set up a guided project (11125:41362) and Flow B · CH01 · Bring existing work (11125:41492).
 */
const copy = {
  brief: {
    title: 'Set up your project',
    lead: 'Set a goal and choose a starting point.',
    section: '1 · Project',
    nameLabel: 'Project name',
    screenTitle: 'Bring a screen I already have',
    screenHint: 'Add one PNG or JPG and go straight to Make.',
    start: 'Start project',
  },
  screen: {
    title: 'Bring your own work',
    lead: 'Set a goal, then upload your work.',
    section: '1 · Your work',
    nameLabel: 'Work name',
    screenTitle: 'Bring work I already have',
    screenHint: 'Upload an image of your design.',
    start: 'Continue with my work',
  },
} as const;

/** Shared · Explore practice templates → Tandem. Flow C is not built yet, so its brief pre-fills Flow A set-up. */
const templateBriefs = {
  tandem: {
    name: 'Tandem app icon',
    audience: 'People scanning a busy home screen',
    goal: 'Keep the icon clear at small sizes',
  },
} as const;

export default function NewProject() {
  const { session, loading } = useAuth();
  const { template } = useLocalSearchParams<{ template?: string }>();
  const preset = template === 'tandem' ? templateBriefs.tandem : null;
  const [name, setName] = useState<string>(preset?.name ?? '');
  const [audience, setAudience] = useState<string>(preset?.audience ?? '');
  const [goal, setGoal] = useState<string>(preset?.goal ?? '');
  const [level, setLevel] = useState<(typeof guidance)[number]>('More guidance');
  const [start, setStart] = useState<Start>('brief');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [work, setWork] = useState<Work | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => () => releaseWork(work), [work]);

  /** A picked or dropped file: check it, then open Review screen (the prototype's next step). */
  const takeFile = useCallback((file: File | null) => {
    if (!file) return;
    const checked = checkWork(file);
    if (typeof checked === 'string') {
      setReviewing(false);
      setError(checked);
      return;
    }
    setError(null);
    setReviewError(null);
    setWork(checked);
    setReviewing(true);
  }, []);

  const chooseFile = useCallback(async () => {
    if (Platform.OS !== 'web') {
      setError(WORK_UNAVAILABLE);
      return;
    }
    takeFile(await pickWorkFile());
  }, [takeFile]);

  if (loading) return null;
  if (!session) return <Redirect href="/sign-in" />;

  const t = copy[start];

  function chooseAnother() {
    setReviewing(false);
    setReviewError(null);
    setWork(null);
  }

  /** Flow B "Continue with my work": needs a name and a file, then Review screen. */
  function continueWithWork() {
    if (!name.trim()) return setError('Give your work a name to start.');
    if (!work) return setError('Add your work to continue.');
    setError(null);
    setReviewError(null);
    setReviewing(true);
  }

  async function create() {
    if (!session) return;
    if (!name.trim()) {
      setReviewing(false);
      setError(start === 'screen' ? 'Give your work a name to start.' : 'Give your project a name to start.');
      return;
    }
    if (start === 'screen' && !work) {
      setError('Add your work to continue.');
      return;
    }
    const fail = (message: string) => {
      setBusy(false);
      if (start === 'screen') setReviewError(message);
      else setError(message);
    };
    setBusy(true);
    setError(null);
    setReviewError(null);
    const { data, error: insertError } = await supabase
      .from('projects')
      .insert({ title: name.trim(), owner_id: session.user.id, status: 'active', skill_focus: level })
      .select('id')
      .single();
    if (insertError || !data) return fail(insertError?.message ?? 'The project could not be saved.');
    const { error: contextError } = await supabase.from('project_contexts').insert({
      project_id: data.id,
      goal: goal.trim() || null,
      audience: audience.trim() || null,
      brief_source: start === 'brief' ? 'guided' : 'own_work',
    });
    if (contextError) return fail(contextError.message);

    if (start === 'screen' && work) {
      // Your work becomes version 1. If the upload fails, remove the half-made project so a retry starts clean.
      const path = workPath(session.user.id, data.id, work);
      const { error: uploadError } = await supabase.storage
        .from('artifacts')
        .upload(path, work.file, { contentType: work.type, upsert: true });
      const { error: versionError } = uploadError
        ? { error: null }
        : await supabase.from('artifact_versions').insert({ project_id: data.id, file_ref: path, version_number: 1 });
      if (uploadError || versionError) {
        await supabase.from('projects').delete().eq('id', data.id);
        return fail('Your work could not be uploaded. Check your connection, then try again.');
      }
    }

    setBusy(false);
    setReviewing(false);
    router.replace(`/projects/${data.id}`);
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
                <Text className="font-bold text-pageTitle text-ink">{t.title}</Text>
                <Text className="font-regular text-bodyUi text-secondaryText">{t.lead}</Text>
              </View>
              <View className="pb-8">
                <Button label="Four-stage guide" variant="white" size="sm" onPress={() => setGuideOpen(true)} />
              </View>
            </View>

            <View className="gap-24 rounded-14 border border-border bg-white p-32" style={cardShadow}>
              {/* Figma: Flow A · Mate · Move it; Flow B · Mate · Make. Feet on the card's top edge. */}
              <Sticker
                crew={start === 'screen' ? 'mateMake' : 'mateMoveIt'}
                width={start === 'screen' ? size.setupMateMake : size.setupMateMoveIt}
                style={{ position: 'absolute', left: start === 'screen' ? size.setupMateMakeLeft : size.setupMateMoveItLeft, bottom: '100%' }}
              />
              <View className="gap-16">
                <Text className="font-semibold text-cardTitle text-ink">{t.section}</Text>
                <View className="flex-row gap-16">
                  <View className="flex-1">
                    <AuthField label={t.nameLabel} value={name} onChangeText={setName} placeholder="Crumb bakery website" />
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
                  <Button label="Help choosing" variant="quiet" size="sm" onPress={() => setHelpOpen(true)} />
                </View>
                <View className="flex-row gap-12">
                  {guidance.map((g) => (
                    <ChoiceOption key={g} label={g} selected={level === g} onPress={() => setLevel(g)} />
                  ))}
                </View>
              </View>

              <View className="gap-16">
                <View className="min-h-controlSmall flex-row items-center justify-between">
                  <Text className="font-semibold text-cardTitle text-ink">3 · Starting point</Text>
                  {start === 'screen' && (
                    <Button label="Upload tips" variant="quiet" size="sm" onPress={() => setTipsOpen(true)} />
                  )}
                </View>
                <View className="flex-row gap-12">
                  <ChoiceOption
                    label="Start with the brief"
                    hint="Read the goal, then make a first direction."
                    selected={start === 'brief'}
                    onPress={() => setStart('brief')}
                  />
                  <ChoiceOption
                    label={t.screenTitle}
                    hint={t.screenHint}
                    selected={start === 'screen'}
                    onPress={() => setStart('screen')}
                  />
                </View>
                {start === 'screen' &&
                  (work ? (
                    <FileChip fileName={work.name} meta={describeWork(work)} onAction={chooseFile} />
                  ) : (
                    <Dropzone onChoose={chooseFile} onDropFile={takeFile} />
                  ))}
              </View>

              {error && (
                <View className="rounded-12 bg-selected px-14 py-10">
                  <Text className="font-medium text-labelUi text-ink">{error}</Text>
                </View>
              )}

              <View className="flex-row items-center gap-12">
                <View className="flex-1 flex-row items-center gap-6">
                  {start === 'screen' && !work && (
                    <>
                      <Icon name="helpSmall" />
                      <Text className="font-regular text-bodySmall text-secondaryText">Add your work to continue</Text>
                    </>
                  )}
                </View>
                <Button label="Cancel" variant="quiet" size="md" onPress={() => router.push('/projects')} />
                <Button
                  label={t.start}
                  arrow
                  size="md"
                  busy={busy && !reviewing}
                  onPress={start === 'screen' ? continueWithWork : create}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <UploadTips visible={tipsOpen} onClose={() => setTipsOpen(false)} />
      <QuickGuide visible={guideOpen} onClose={() => setGuideOpen(false)} />
      <GuidanceOptions visible={helpOpen} value={level} onChange={setLevel} onClose={() => setHelpOpen(false)} />
      <ReviewScreen
        work={reviewing ? work : null}
        busy={busy}
        error={reviewError}
        onClose={() => setReviewing(false)}
        onReplace={chooseFile}
        onChooseAnother={chooseAnother}
        onAdd={create}
      />
    </View>
  );
}
