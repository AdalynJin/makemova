import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { AddScreenDialog } from '@/components/AddScreenDialog';
import { AppNav } from '@/components/AppNav';
import { BriefDetails } from '@/components/BriefDetails';
import { Button } from '@/components/Button';
import { CompareVersions, type CompareVersion } from '@/components/CompareVersions';
import { EditDropdown } from '@/components/EditDropdown';
import { EditSourceDialog } from '@/components/EditSourceDialog';
import { Icon } from '@/components/Icon';
import { ReviewScreen } from '@/components/ReviewScreen';
import { StageNav, type Stage } from '@/components/StageNav';
import { BriefPanel, ExplainPanel, MakePanel, ReflectPanel, RevisePanel } from '@/components/WorkspacePanels';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { asset } from '@/lib/ui';
import { WORK_UNAVAILABLE, checkWork, pickWorkFile, releaseWork, workPath, type Work } from '@/lib/work';
import { color, size, space } from '@/tokens';

/** Explain is a step inside Make: the stage nav still shows Make. */
type Step = Stage | 'explain';

/** A saved screen: artifact_versions row plus a signed URL to show it. */
type Version = { number: number; uri: string | null; file: string };
type Workspace = {
  title: string;
  audience: string;
  goal: string;
  example: boolean;
  versions: Version[];
};
type Load = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; ws: Workspace };

const EXAMPLE: Workspace = {
  title: 'Campus café ordering',
  audience: 'Students between classes.',
  goal: 'Make pickup easy to find and keep the menu accessible.',
  example: true,
  versions: [],
};

/** Copy the café frames use where the brief is paraphrased (Edit source step 2, R6 · Brief details). */
const EXAMPLE_COPY = {
  sameGoal: 'pickup easy to find.',
  success: 'Make pickup easy to find; keep the menu accessible.',
};

/** Edit menu dialogs. Figma: Edit source, Add a screen, Review screen (swap), Brief details. */
type EditDialog = 'source' | 'add' | 'review' | 'brief' | null;

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
  const [editOpen, setEditOpen] = useState(false);
  // Compare versions · Selection only: Figma's compare = true, single = false (tools and header actions hide).
  const [comparing, setComparing] = useState(false);
  const [dialog, setDialog] = useState<EditDialog>(null);
  const [work, setWork] = useState<Work | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => releaseWork(work), [work]);

  const fetchProject = useCallback(async () => {
    if (id === 'example') return;
    setLoad({ status: 'loading' });
    const { data, error } = await supabase
      .from('projects')
      .select('title, project_contexts(goal, audience), artifact_versions(version_number, file_ref)')
      .eq('id', id)
      .maybeSingle();
    if (error) return setLoad({ status: 'error', message: error.message });
    if (!data)
      return setLoad({
        status: 'error',
        message: 'This project was not found.',
      });
    const ctx = Array.isArray(data.project_contexts) ? data.project_contexts[0] : data.project_contexts;
    const rows = [
      ...((data.artifact_versions ?? []) as {
        version_number: number;
        file_ref: string | null;
      }[]),
    ].sort((a, b) => a.version_number - b.version_number);
    const paths = rows.map((r) => r.file_ref).filter((p): p is string => !!p);
    const signed = paths.length
      ? ((await supabase.storage.from('artifacts').createSignedUrls(paths, 60 * 60)).data ?? [])
      : [];
    const urlFor = (path: string | null) => signed.find((u) => u.path === path)?.signedUrl ?? null;
    const versions = rows.map((r) => ({
      number: r.version_number,
      uri: urlFor(r.file_ref),
      file: r.file_ref?.split('/').at(-1) ?? '',
    }));
    if (versions.length) setVersion(versions[versions.length - 1].number);
    setLoad({
      status: 'ready',
      ws: {
        title: data.title,
        audience: ctx?.audience || 'Add who this is for.',
        goal: ctx?.goal || 'Add what you want to improve.',
        example: false,
        versions,
      },
    });
  }, [id]);

  useEffect(() => {
    if (session) fetchProject();
  }, [session, fetchProject]);

  function go(next: Step) {
    setStep(next);
    if (load.status === 'ready' && load.ws.example) setVersion(versionsAt[next].current);
    setPanelOpen(true);
    setEditOpen(false);
    setComparing(false);
  }

  /** Compare tool → comparison of two versions on Make. */
  function compare() {
    go('make');
    setComparing(true);
  }

  /** Edit menu items close the menu, then open their dialog (Figma: R8/edit-open = false, then Open overlay). */
  function openDialog(d: EditDialog) {
    setEditOpen(false);
    setAddError(null);
    setDialog(d);
  }

  /** A picked or dropped screen: check it, then swap Add a screen for Review screen. */
  const takeFile = useCallback((file: File | null) => {
    if (!file) return;
    const checked = checkWork(file);
    if (typeof checked === 'string') return setAddError(checked);
    setAddError(null);
    setReviewError(null);
    setWork(checked);
    setDialog('review');
  }, []);

  const chooseFile = useCallback(async () => {
    if (Platform.OS !== 'web') return setAddError(WORK_UNAVAILABLE);
    takeFile(await pickWorkFile());
  }, [takeFile]);

  function closeDialog() {
    if (busy) return;
    setDialog(null);
    setWork(null);
    setReviewError(null);
  }

  /** Review screen · Add to project: save the screen as the next version, then go to Make. */
  async function addVersion() {
    if (!work || load.status !== 'ready' || !session) return;
    const { ws } = load;
    if (ws.example) {
      // The café example is read-only: follow the prototype to Make without saving.
      closeDialog();
      return go('make');
    }
    const next = (ws.versions.at(-1)?.number ?? 0) + 1;
    setBusy(true);
    setReviewError(null);
    const path = workPath(session.user.id, id, work, next);
    const { error: uploadError } = await supabase.storage
      .from('artifacts')
      .upload(path, work.file, { contentType: work.type, upsert: false });
    const { error: versionError } = uploadError
      ? { error: null }
      : await supabase.from('artifact_versions').insert({ project_id: id, file_ref: path, version_number: next });
    if (uploadError || versionError) {
      if (!uploadError) await supabase.storage.from('artifacts').remove([path]);
      setBusy(false);
      return setReviewError('Your screen could not be added. Check your connection, then try again.');
    }
    const { data: signed } = await supabase.storage.from('artifacts').createSignedUrl(path, 60 * 60);
    setLoad({
      status: 'ready',
      ws: {
        ...ws,
        versions: [
          ...ws.versions,
          {
            number: next,
            uri: signed?.signedUrl ?? null,
            file: path.split('/').at(-1) ?? '',
          },
        ],
      },
    });
    setVersion(next);
    setBusy(false);
    setDialog(null);
    setWork(null);
    go('make');
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
              <Button
                label="Back to My projects"
                variant="white"
                size="sm"
                onPress={() => router.replace('/projects')}
              />
            </>
          )}
        </View>
      </View>
    );
  }

  const { ws } = load;
  const stage: Stage = step === 'explain' ? 'make' : step;
  const count = ws.example ? versionsAt[step].count : Math.max(1, ws.versions.length);
  const shown = ws.versions.find((v) => v.number === version);

  /** Café example names and files from the Figma version pickers; real projects use their saved files. */
  const compareVersions: CompareVersion[] = ws.example
    ? [
        {
          number: 1,
          name: 'v1 · First attempt',
          file: 'cafe-home-v1.png',
          source: asset.cafe1,
        },
        {
          number: 2,
          name: 'v2 · Current direction',
          file: 'cafe-home-v2.png',
          source: asset.cafe2,
        },
      ]
    : ws.versions.map((v, i) => ({
        number: v.number,
        name: i === ws.versions.length - 1 ? `v${v.number} · Current` : `v${v.number}`,
        file: v.file,
        source: v.uri ? { uri: v.uri } : null,
      }));
  const latest = compareVersions.at(-1)?.number ?? 1;
  const previous = compareVersions.at(-2)?.number ?? latest + 1;

  const editItems = [
    { label: 'Edit source', onPress: () => openDialog('source') },
    { label: 'Add screenshot', onPress: () => openDialog('add') },
    ...(step === 'brief' ? [{ label: 'Brief details', onPress: () => openDialog('brief') }] : []),
  ];

  const next: Record<
    Step,
    {
      label: string;
      to?: Step;
      disabled?: boolean;
      arrow?: boolean;
      finish?: boolean;
    }
  > = {
    brief: { label: 'Next: Make', to: 'make' },
    make: { label: 'Next: Revise', to: 'explain', arrow: true },
    explain: {
      label: 'Next: Revise',
      to: 'revise',
      arrow: true,
      disabled: !tradeOff,
    },
    revise: { label: 'Next: Reflect', to: 'reflect', arrow: true },
    reflect: { label: 'Finish', finish: true },
  };
  const n = next[step];

  return (
    <View className="flex-1 bg-canvas">
      <AppNav variant="workspace" />

      {/* R8 · Compact workspace header */}
      <View
        className="h-navHeight flex-row items-center justify-between border-b border-border bg-white px-64"
        style={{ zIndex: 2 }}
      >
        <Text numberOfLines={1} className="w-column font-semibold text-cardTitle text-ink">
          {ws.title}
        </Text>
        <StageNav current={stage} onChange={(s) => go(s)} />
        <View className="w-column flex-row items-center justify-end gap-12">
          {!comparing && (
            <>
              <View>
                <Button label="Edit" variant="secondary" size="header" onPress={() => setEditOpen(!editOpen)} />
                {editOpen && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: size.editDropdownTop,
                    }}
                  >
                    <EditDropdown items={editItems} />
                  </View>
                )}
              </View>
              <Button
                label={n.label}
                size="header"
                width={size.nextButton}
                arrow={n.arrow}
                leading={n.finish ? 'finish' : undefined}
                disabled={n.disabled}
                onPress={() => (n.finish ? router.replace('/projects') : n.to && go(n.to))}
              />
            </>
          )}
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="p-24">
        <View
          className={`rounded-24 ${step === 'brief' ? 'bg-white' : ''}`}
          style={{ minHeight: size.artworkHeight + space[48] }}
        >
          {comparing ? (
            <View style={{ marginLeft: size.compareModeLeft }}>
              <CompareVersions
                versions={compareVersions}
                initialA={previous}
                initialB={latest}
                onUse={(v) => {
                  go('explain');
                  setVersion(v);
                }}
                onExit={() => {
                  setComparing(false);
                  setPanelOpen(true);
                }}
              />
            </View>
          ) : (
            /* Artwork, or the before/after comparison on Reflect */
            <View style={{ marginLeft: size.artworkLeft, width: size.artwork }}>
              {step === 'reflect' ? (
                <ReflectCompare example={ws.example} />
              ) : (
                <View style={{ width: size.artwork, height: size.artworkHeight }}>
                  {ws.example || shown?.uri ? (
                    <Image
                      source={ws.example ? cafe[version - 1] : { uri: shown?.uri ?? undefined }}
                      style={{
                        position: 'absolute',
                        left: space[16],
                        top: space[16],
                        width: size.artworkImage,
                        height: size.artworkImageHeight,
                      }}
                      contentFit={ws.example ? 'cover' : 'contain'}
                    />
                  ) : (
                    <EmptyArtwork />
                  )}
                </View>
              )}
            </View>
          )}

          {/* Version switcher · Floating */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: size.versionTop - (step === 'brief' ? 0 : size.versionRow / 2),
            }}
          >
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

          {/* R10 · Tools open control (hidden while comparing, as the tools anchor follows Figma's single) */}
          {!comparing && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={panelOpen ? 'Collapse panel' : 'Expand panel'}
              onPress={() => setPanelOpen(!panelOpen)}
              className="h-collapse w-collapse items-center justify-center rounded-pill border border-border bg-white"
              style={{ position: 'absolute', right: 0, top: 0 }}
            >
              <Icon name={step === 'make' && panelOpen ? 'chevronDown' : 'arrowRight'} size={size.iconSmall} />
            </Pressable>
          )}

          {panelOpen && !comparing && (
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: size.panelTop,
                width: step === 'make' ? size.panelMake : size.panel,
              }}
            >
              {step === 'brief' && (
                <BriefPanel
                  title={ws.example ? 'The café brief' : 'Your brief'}
                  audience={ws.audience}
                  goal={ws.goal}
                />
              )}
              {step === 'make' && (
                <MakePanel version={`v${version} · Current`} onCritique={() => go('explain')} onCompare={compare} />
              )}
              {step === 'explain' && <ExplainPanel tradeOff={tradeOff} onTradeOff={setTradeOff} onBack={compare} />}
              {step === 'revise' && <RevisePanel />}
              {step === 'reflect' && (
                <ReflectPanel onBack={() => go('make')} onFinish={() => router.replace('/projects')} />
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit menu · Click outside to close: covers the workspace below the header. */}
      {editOpen && (
        <Pressable
          accessibilityLabel="Close edit menu"
          onPress={() => setEditOpen(false)}
          className="absolute bottom-0 left-0 right-0"
          style={{ top: size.navHeight * 2, zIndex: 1 }}
        />
      )}

      <EditSourceDialog
        visible={dialog === 'source'}
        goal={ws.example ? EXAMPLE_COPY.sameGoal : ws.goal}
        onClose={closeDialog}
        onAddScreenshot={() => openDialog('add')}
      />
      <AddScreenDialog
        visible={dialog === 'add'}
        error={addError}
        onClose={closeDialog}
        onChoose={chooseFile}
        onDropFile={takeFile}
      />
      <ReviewScreen
        work={dialog === 'review' ? work : null}
        busy={busy}
        error={reviewError}
        onClose={closeDialog}
        onReplace={chooseFile}
        onChooseAnother={() => {
          setWork(null);
          setReviewError(null);
          setDialog('add');
        }}
        onAdd={addVersion}
      />
      <BriefDetails
        visible={dialog === 'brief'}
        title={ws.example ? 'The café brief' : 'Your brief'}
        audience={ws.audience}
        goal={ws.example ? EXAMPLE_COPY.success : ws.goal}
        onClose={closeDialog}
      />
    </View>
  );
}

function EmptyArtwork() {
  return (
    <View
      className="items-center justify-center gap-8 rounded-24 border border-dashed border-secondaryText bg-white"
      style={{
        position: 'absolute',
        left: space[16],
        top: space[16],
        width: size.artworkImage,
        height: size.artworkImageHeight,
      }}
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
