import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { StageNav, type Stage } from '@/components/StageNav';
import { BriefPanel, ExplainPanel, MakePanel, ReflectPanel, RevisePanel } from '@/components/WorkspacePanels';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { asset } from '@/lib/ui';
import { color, size, space } from '@/tokens';

/** Explain is a step inside Make: the stage nav still shows Make. */
type Step = Stage | 'explain';

type Workspace = { title: string; audience: string; goal: string; example: boolean };
type Load = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; ws: Workspace };

const EXAMPLE: Workspace = {
  title: 'Campus café ordering',
  audience: 'Students between classes.',
  goal: 'Make pickup easy to find and keep the menu accessible.',
  example: true,
};

const cafe = [asset.cafe1, asset.cafe2, asset.cafe3];

/** Which versions exist, and which one is selected, at each step (as in the Week 8 frames). */
const versionsAt: Record<Step, { count: number; current: number }> = {
  brief: { count: 1, current: 1 },
  make: { count: 2, current: 2 },
  explain: { count: 2, current: 2 },
  revise: { count: 3, current: 3 },
  reflect: { count: 3, current: 2 },
};

/** Figma: Flow A · CH02 Brief → CH05 Reflect (10551:6067, 6282, 6644, 7121, 7380) */
export default function ProjectWorkspace() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session, loading } = useAuth();
  const [load, setLoad] = useState<Load>(id === 'example' ? { status: 'ready', ws: EXAMPLE } : { status: 'loading' });
  const [step, setStep] = useState<Step>('brief');
  const [version, setVersion] = useState(1);
  const [panelOpen, setPanelOpen] = useState(true);
  const [tradeOff, setTradeOff] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (id === 'example') return;
    setLoad({ status: 'loading' });
    const { data, error } = await supabase
      .from('projects')
      .select('title, project_contexts(goal, audience)')
      .eq('id', id)
      .maybeSingle();
    if (error) return setLoad({ status: 'error', message: error.message });
    if (!data) return setLoad({ status: 'error', message: 'This project was not found.' });
    const ctx = Array.isArray(data.project_contexts) ? data.project_contexts[0] : data.project_contexts;
    setLoad({
      status: 'ready',
      ws: {
        title: data.title,
        audience: ctx?.audience || 'Add who this is for.',
        goal: ctx?.goal || 'Add what you want to improve.',
        example: false,
      },
    });
  }, [id]);

  useEffect(() => {
    if (session) fetchProject();
  }, [session, fetchProject]);

  function go(next: Step) {
    setStep(next);
    setVersion(versionsAt[next].current);
    setPanelOpen(true);
  }

  if (loading) return null;
  if (!session) return <Redirect href="/sign-in" />;

  if (load.status !== 'ready') {
    return (
      <View className="flex-1 bg-canvas">
        <AppNav variant="workspace" />
        <View className="flex-1 items-center justify-center gap-16">
          {load.status === 'loading' ? (
            <ActivityIndicator color={color.ink} />
          ) : (
            <>
              <Text className="font-semibold text-cardTitle text-ink">Project could not load</Text>
              <Text className="font-regular text-bodyUi text-secondaryText">{load.message}</Text>
              <Button label="Back to My projects" variant="white" size="sm" onPress={() => router.replace('/projects')} />
            </>
          )}
        </View>
      </View>
    );
  }

  const { ws } = load;
  const stage: Stage = step === 'explain' ? 'make' : step;
  const { count } = versionsAt[step];

  const next: Record<Step, { label: string; to?: Step; disabled?: boolean; arrow?: boolean; finish?: boolean }> = {
    brief: { label: 'Next: Make', to: 'make' },
    make: { label: 'Next: Revise', to: 'explain', arrow: true },
    explain: { label: 'Next: Revise', to: 'revise', arrow: true, disabled: !tradeOff },
    revise: { label: 'Next: Reflect', to: 'reflect', arrow: true },
    reflect: { label: 'Finish', finish: true },
  };
  const n = next[step];

  return (
    <View className="flex-1 bg-canvas">
      <AppNav variant="workspace" />

      {/* R8 · Compact workspace header */}
      <View className="h-navHeight flex-row items-center justify-between border-b border-border bg-white px-64">
        <Text numberOfLines={1} className="w-column font-semibold text-cardTitle text-ink">
          {ws.title}
        </Text>
        <StageNav current={stage} onChange={(s) => go(s)} />
        <View className="w-column flex-row items-center justify-end gap-12">
          <Button label="Edit" variant="white" size="md" />
          <Button
            label={n.label}
            size="md"
            width={size.nextButton}
            arrow={n.arrow}
            leading={n.finish ? 'finish' : undefined}
            disabled={n.disabled}
            onPress={() => (n.finish ? router.replace('/projects') : n.to && go(n.to))}
          />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-24">
        <View className={`rounded-24 ${step === 'brief' ? 'bg-white' : ''}`} style={{ minHeight: size.artworkHeight + space[48] }}>
          {/* Artwork, or the before/after comparison on Reflect */}
          <View style={{ marginLeft: size.artworkLeft, width: size.artwork }}>
            {step === 'reflect' ? (
              <ReflectCompare example={ws.example} />
            ) : (
              <View style={{ width: size.artwork, height: size.artworkHeight }}>
                {ws.example ? (
                  <Image
                    source={cafe[version - 1]}
                    style={{ position: 'absolute', left: space[16], top: space[16], width: size.artworkImage, height: size.artworkImageHeight }}
                    contentFit="cover"
                  />
                ) : (
                  <EmptyArtwork />
                )}
              </View>
            )}
          </View>

          {/* Version switcher · Floating */}
          <View style={{ position: 'absolute', left: 0, top: size.versionTop - (step === 'brief' ? 0 : size.versionRow / 2) }}>
            {Array.from({ length: count }, (_, i) => i + 1).map((v) => {
              const current = v === version;
              return (
                <Pressable
                  key={v}
                  accessibilityRole="button"
                  accessibilityState={{ selected: current }}
                  onPress={() => setVersion(v)}
                  className="h-versionRow flex-row items-center"
                >
                  <View className="h-versionRow w-16 items-center justify-center">
                    <View className="absolute h-versionRow border-l border-border" />
                    <View
                      className={`rounded-pill ${current ? 'h-versionDotCurrent w-versionDotCurrent bg-ink' : 'h-versionDot w-versionDot bg-border'}`}
                    />
                  </View>
                  <View
                    className={`h-versionLabelHeight w-versionLabel justify-center rounded-6 px-6 ${current ? 'bg-compare' : ''}`}
                  >
                    <Text className="font-regular text-labelUi text-ink">Version {v}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* R10 · Tools open control */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={panelOpen ? 'Collapse panel' : 'Expand panel'}
            onPress={() => setPanelOpen(!panelOpen)}
            className="h-collapse w-collapse items-center justify-center rounded-pill border border-border bg-white"
            style={{ position: 'absolute', right: 0, top: 0 }}
          >
            <Icon name={step === 'make' && panelOpen ? 'chevronDown' : 'arrowRight'} size={size.iconSmall} />
          </Pressable>

          {panelOpen && (
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: size.panelTop,
                width: step === 'make' ? size.panelMake : size.panel,
              }}
            >
              {step === 'brief' && (
                <BriefPanel title={ws.example ? 'The café brief' : 'Your brief'} audience={ws.audience} goal={ws.goal} />
              )}
              {step === 'make' && <MakePanel onTool={() => go('explain')} />}
              {step === 'explain' && <ExplainPanel tradeOff={tradeOff} onTradeOff={setTradeOff} onBack={() => go('make')} />}
              {step === 'revise' && <RevisePanel />}
              {step === 'reflect' && (
                <ReflectPanel onBack={() => go('make')} onFinish={() => router.replace('/projects')} />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function EmptyArtwork() {
  return (
    <View
      className="items-center justify-center gap-8 rounded-24 border border-dashed border-secondaryText bg-white"
      style={{ position: 'absolute', left: space[16], top: space[16], width: size.artworkImage, height: size.artworkImageHeight }}
    >
      <Text className="font-semibold text-cardTitle text-ink">No screen yet</Text>
      <Text className="font-regular text-bodyUi text-secondaryText">Add one PNG or JPG in Make to get feedback.</Text>
    </View>
  );
}

/** Figma: CH05 · See what changed (v2 → v3). */
function ReflectCompare({ example }: { example: boolean }) {
  const card = (label: string, src: number) => (
    <View
      className="gap-16 rounded-16 border border-border p-28"
      style={{ width: size.compareCard, height: size.compareCardHeight }}
    >
      <Text className="font-medium text-bodySmall text-ink">{label}</Text>
      {example ? (
        <Image source={src} style={{ width: size.compareImage, height: size.compareImageHeight }} contentFit="cover" />
      ) : (
        <View className="flex-1 rounded-10 bg-chip" />
      )}
    </View>
  );
  return (
    <View className="gap-24 pr-24">
      <View className="gap-8">
        <Text className="font-bold text-eyebrow text-secondaryText">SEE WHAT CHANGED</Text>
        <Text className="font-bold text-heading text-ink">v2 → v3</Text>
      </View>
      <View className="flex-row gap-24">
        {card('Before · v2', asset.cafe2)}
        {card('After · v3', asset.cafe3)}
      </View>
      <View className="gap-6 px-14">
        <Text className="font-medium text-labelUi text-ink">What changed</Text>
        <Text className="font-regular text-labelUi text-secondaryText">
          Pickup stays the primary action. An outlined menu button keeps the second action easy to find.
        </Text>
      </View>
    </View>
  );
}
