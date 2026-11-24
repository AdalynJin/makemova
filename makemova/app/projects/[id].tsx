import type { ImageSource } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { AddScreenDialog } from '@/components/AddScreenDialog';
import { AddScreenshotDialog } from '@/components/AddScreenshotDialog';
import { AddVersionDialog } from '@/components/AddVersionDialog';
import { AppNav } from '@/components/AppNav';
import { BriefDetails } from '@/components/BriefDetails';
import { Button } from '@/components/Button';
import type { CritiqueFocus } from '@/components/ChooseCritiqueFocus';
import { CompareVersions, type CompareVersion } from '@/components/CompareVersions';
import { CritiqueSaved } from '@/components/CritiqueSaved';
import { EditDropdown } from '@/components/EditDropdown';
import { EditSourceDialog } from '@/components/EditSourceDialog';
import { FeedbackPin } from '@/components/FeedbackPin';
import { NextAction } from '@/components/NextAction';
import { GuidanceDialog } from '@/components/GuidanceDialog';
import { Icon } from '@/components/Icon';
import { ProjectSummary } from '@/components/ProjectSummary';
import { ReviewScreen } from '@/components/ReviewScreen';
import { SavedRecord, type Record as CritRecord } from '@/components/SavedRecord';
import { StatusNotice } from '@/components/StatusNotice';
import { SavedVersionsDialog } from '@/components/SavedVersionsDialog';
import { ScreenshotReady } from '@/components/ScreenshotReady';
import { StageNav, type Stage } from '@/components/StageNav';
import { VersionPreview } from '@/components/VersionPreview';
import {
  AddDirectionPanel,
  BriefPanel,
  CAFE_EXPLAIN,
  ExplainPanel,
  ExplainYourChoice,
  MakePanel,
  ReflectPanel,
  RevisePanel,
  type CafeAnswers,
  type OwnDecision,
  type RevisionFile,
} from '@/components/WorkspacePanels';
import { useAuth } from '@/lib/auth';
import { loadCritiques, requestCritique, type CritiquePin } from '@/lib/critique';
import { credits } from '@/lib/credits';
import { supabase } from '@/lib/supabase';
import { asset } from '@/lib/ui';
import {
  WORK_UNAVAILABLE,
  checkWork,
  describeWork,
  pickWorkFile,
  releaseWork,
  uploadErrorText,
  workPath,
  type Work,
} from '@/lib/work';
import { color, size } from '@/tokens';

/** Inside Make: the tools on the work, the comparison, or the chosen version with Explain your choice. */
type MakeView = 'work' | 'compare' | 'decision' | 'direction';

/** A saved screen. Café screens are bundled; a real project's come from storage as signed URLs. */
type Version = { number: number; name: string; file: string; source: ImageSource | number | null; id?: string };
type Workspace = {
  title: string;
  audience: string;
  goal: string;
  example: boolean;
  versions: Version[];
};
type Load = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; ws: Workspace };

/** Café screens, named as in the Figma version pickers (R5 · Choose current version 11125:60054). */
const CAFE: Version[] = [
  { number: 1, name: 'v1 · First attempt', file: 'cafe-home-v1.png', source: asset.cafe1 },
  { number: 2, name: 'v2 · Current direction', file: 'cafe-home-v2.png', source: asset.cafe2 },
  { number: 3, name: 'v3 · Saved revision', file: 'cafe-revision.png', source: asset.cafe3 },
];

const EXAMPLE: Workspace = {
  title: 'Campus café ordering',
  audience: 'Students between classes.',
  goal: 'Make pickup easy to find and keep the menu accessible.',
  example: true,
  versions: CAFE,
};

/** Copy the café frames use where the brief is paraphrased (Edit source step 2, R6 · Brief details, Guidelines). */
const EXAMPLE_COPY = {
  sameGoal: 'pickup easy to find.',
  success: 'Make pickup easy to find; keep the menu accessible.',
  guideline: 'Make pickup the first thing students see.',
  constant: 'Students, menu items, prices, photo and viewport.',
  revise: 'Keep pickup prominent and make the menu easier to find.',
  direction: 'Give pickup more emphasis: a filled "Order pickup" and a hero that says what you get. Keep the menu link.',
};

/** How many café versions exist at each stage, and which one is selected on arrival (Flow A frames). */
const cafeAt: Record<Stage, { count: number; current: number }> = {
  brief: { count: 1, current: 1 },
  make: { count: 1, current: 1 }, // v1 only; v2 arrives through Try another direction
  revise: { count: 3, current: 3 },
  reflect: { count: 3, current: 2 },
};

/** Every overlay the workspace opens. Each one is a Figma dialog page; see the flow map in the PR. */
type Dialog =
  | 'source' // R4 · Dialog · Edit source (café)
  | 'sourceGuide' // B / C · Edit source guidance (own work)
  | 'add' // R4 · Dialog · Add a screen → 'review'
  | 'review' // R4 · Dialog · Review screen
  | 'brief' // R6 · Brief details
  | 'guidelines' // Guidelines · On demand
  | 'decisionTips' // R6 · Decision guidance
  | 'revisionTips' // R6 · Revision guidance
  | 'why' // R6 · Saved decision
  | 'addVersion' // Own project · Add a version
  | 'savedVersions' // Own project · Saved versions
  | 'addShot' // Own project · Add screenshot → 'shotReady'
  | 'shotReady' // Own project · Screenshot ready
  | 'notes' // R6 · Saved record
  | 'summary' // R4 · Dialog · Project summary
  | null;

/** Where a new screenshot goes: a new current version (Edit → Add screenshot), the comparison slot, or the revision. */
type UploadFor = 'version' | 'A' | 'B' | 'revision';

/** Feedback pins for a critiqued version (Makemova / Feedback pin / Versa). */
const PINS: Record<'cafe' | 'own', { title: string; body: string }[]> = {
  cafe: [
    { title: 'Action hierarchy', body: 'Pickup reads first. Keep it as the primary action.' },
    { title: 'Second action', body: 'Keep “View menu” easy to find without competing with pickup.' },
  ],
  own: [
    { title: 'Your focus', body: 'Sample note: the AI critique for your own work is not connected yet.' },
    { title: 'Try next', body: 'Change one thing for this focus, then add the update as a new version.' },
  ],
};

/** Figma: Week 8 Refined · Flow A (café, 11125:41684 → 42599) and Flow B (your own project, 11125:43429 → 45314). */
export default function ProjectWorkspace() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session, loading } = useAuth();
  const [load, setLoad] = useState<Load>(id === 'example' ? { status: 'ready', ws: EXAMPLE } : { status: 'loading' });
  const [step, setStep] = useState<Stage>('brief');
  const [view, setView] = useState<MakeView>('work');
  const [version, setVersion] = useState(1);
  const [hoverVersion, setHoverVersion] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);

  // Critique: Use 5 credits saves feedback pins on that version and shows Critique saved.
  const [balance, setBalance] = useState<number>(credits.remaining);
  const [critiqued, setCritiqued] = useState<number[]>([]);
  const [critiqueToast, setCritiqueToast] = useState(false);
  // Own project: Claude's pins per version number, and the request in flight or the one that failed.
  const [aiPins, setAiPins] = useState<Record<number, CritiquePin[]>>({});
  const [critiqueRun, setCritiqueRun] = useState<{ state: 'running' } | { state: 'error'; message: string; focus: CritiqueFocus } | null>(null);

  // Compare: A is the current version; B starts empty (own work) or as v2 (café).
  const [pairA, setPairA] = useState(1);
  const [pairB, setPairB] = useState<number | null>(null);
  const [changing, setChanging] = useState<'A' | 'B'>('B');
  // Café versions unlocked in Make: v1 at first, v2 once the designer adds it (Make · Add direction).
  const [cafeHas, setCafeHas] = useState(1);
  // Café screenshots added during this visit (the example itself is read-only).
  const [local, setLocal] = useState<Version[]>([]);

  // Explain your choice.
  const [chosen, setChosen] = useState<number | null>(null);
  const [cafeAnswers, setCafeAnswers] = useState<CafeAnswers>({ goal: 0, evidence: 0, tradeOff: null });
  const [decision, setDecision] = useState<OwnDecision>({ reason: '', evidence: null, tradeOff: null, saved: false });
  const [decisionOpen, setDecisionOpen] = useState(true);

  // Revise → Reflect.
  const [revision, setRevision] = useState<{ number: number; file: RevisionFile } | null>(null);
  const [revisionSaved, setRevisionSaved] = useState(false);
  const [takeaway, setTakeaway] = useState<string | null>(null);

  // Uploads.
  const [work, setWork] = useState<Work | null>(null);
  const [uploadFor, setUploadFor] = useState<UploadFor>('version');
  const [addError, setAddError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => () => releaseWork(work), [work]);

  const fetchProject = useCallback(async () => {
    if (id === 'example') return;
    setLoad({ status: 'loading' });
    const { data, error } = await supabase
      .from('projects')
      .select('title, project_contexts(goal, audience), artifact_versions(id, version_number, file_ref)')
      .eq('id', id)
      .maybeSingle();
    if (error) return setLoad({ status: 'error', message: error.message });
    if (!data) return setLoad({ status: 'error', message: 'This project was not found.' });
    const ctx = Array.isArray(data.project_contexts) ? data.project_contexts[0] : data.project_contexts;
    const rows = [...((data.artifact_versions ?? []) as { id: string; version_number: number; file_ref: string | null }[])].sort(
      (a, b) => a.version_number - b.version_number,
    );
    const paths = rows.map((r) => r.file_ref).filter((p): p is string => !!p);
    const signed = paths.length
      ? ((await supabase.storage.from('artifacts').createSignedUrls(paths, 60 * 60)).data ?? [])
      : [];
    const urlFor = (path: string | null) => signed.find((u) => u.path === path)?.signedUrl ?? null;
    const versions: Version[] = rows.map((r) => {
      const uri = urlFor(r.file_ref);
      return {
        number: r.version_number,
        name: `v${r.version_number}`,
        file: r.file_ref?.split('/').at(-1) ?? '',
        source: uri ? { uri } : null,
        id: r.id,
      };
    });
    // Saved critiques come back as feedback pins on their versions.
    const saved = await loadCritiques(id);
    const pins: Record<number, CritiquePin[]> = {};
    for (const v of versions) if (v.id && saved[v.id]) pins[v.number] = saved[v.id].pins;
    setAiPins(pins);
    setCritiqued(Object.keys(pins).map(Number));
    const last = versions.at(-1)?.number ?? 1;
    setVersion(last);
    setPairA(last);
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

  const example = load.status === 'ready' && load.ws.example;

  /** Stage navigation, as each frame's stepper and Next buttons do it. */
  function go(next: Stage) {
    setStep(next);
    setView('work');
    setPanelOpen(true);
    setEditOpen(false);
    setCritiqueToast(false);
    if (example) {
      // Revise shows the saved revision; Reflect compares the chosen version (v2 by default) with v3.
      setVersion(next === 'reflect' ? (chosen ?? cafeAt.reflect.current) : next === 'make' ? cafeHas : cafeAt[next].current);
    }
  }

  /** Café: Use 5 credits saves the sample pins right away. */
  function critiqueExample() {
    setBalance((b) => b - 5);
    setCritiqued((c) => (c.includes(version) ? c : [...c, version]));
    setPanelOpen(false);
    setCritiqueToast(true);
  }

  /** Own project: Claude looks at this version. Credits are used only when the critique comes back. */
  async function critiqueOwn(focus: CritiqueFocus) {
    const v = version;
    setPanelOpen(false);
    setCritiqueToast(false);
    setCritiqueRun({ state: 'running' });
    try {
      const result = await requestCritique(id, v, focus);
      setAiPins((p) => ({ ...p, [v]: result.pins }));
      setCritiqued((c) => (c.includes(v) ? c : [...c, v]));
      setBalance((b) => b - 5);
      setCritiqueRun(null);
      setCritiqueToast(true);
    } catch (e) {
      setCritiqueRun({ state: 'error', message: (e as Error).message, focus });
    }
  }

  /** Compare (tool, "Compare v1 and v2", "Back to comparison", "Change choice"). */
  function compare() {
    setEditOpen(false);
    setCritiqueToast(false);
    if (!example && load.status === 'ready' && load.ws.versions.length === 0) return openDialog('add', 'version');
    setStep('make');
    // Only one version: Compare has nothing to compare yet, so it opens Make · Add direction first.
    const count = example ? cafeHas + local.length : load.status === 'ready' ? load.ws.versions.length : 0;
    if (count < 2) {
      setView('direction');
      setPanelOpen(true);
      return;
    }
    setView('compare');
    if (chosen === null) {
      if (example) {
        setPairA(1);
        setPairB(cafeHas >= 2 ? 2 : (local[0]?.number ?? null));
      } else {
        setPairA(version);
        setPairB(null);
      }
    }
  }

  function openDialog(d: Dialog, purpose?: UploadFor) {
    setEditOpen(false);
    setAddError(null);
    setReviewError(null);
    if (purpose) setUploadFor(purpose);
    setDialog(d);
  }

  /** A picked or dropped screen: check it, then show its review dialog. */
  const takeFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      const checked = checkWork(file);
      if (typeof checked === 'string') return setAddError(checked);
      setAddError(null);
      setReviewError(null);
      setWork(checked);
      setDialog(dialog === 'addShot' ? 'shotReady' : 'review');
    },
    [dialog],
  );

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

  /**
   * Saves the reviewed screenshot as the next version and returns its number.
   * A real project uploads it to storage and adds an artifact_versions row; the café keeps it for this visit only.
   */
  async function saveWork(): Promise<number | null> {
    if (!work || load.status !== 'ready') return null;
    const { ws } = load;
    const all = [...ws.versions, ...local];
    // Café: a screenshot added in Make takes the next number after what the designer can see (v2 after v1).
    const seen = ws.example ? [...CAFE.slice(0, cafeHas), ...local] : all;
    const next = Math.max(0, ...seen.map((v) => v.number)) + 1;
    if (ws.example) {
      const uri = URL.createObjectURL(work.file);
      setLocal((l) => [...l, { number: next, name: `v${next} · Your screenshot`, file: work.name, source: { uri } }]);
      return next;
    }
    if (!session) return null;
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
      setReviewError(uploadErrorText(uploadError, 'Your screen could not be added. Check your connection, then try again.'));
      return null;
    }
    const { data: signed } = await supabase.storage.from('artifacts').createSignedUrl(path, 60 * 60);
    const added: Version = {
      number: next,
      name: `v${next}`,
      file: path.split('/').at(-1) ?? '',
      source: signed?.signedUrl ? { uri: signed.signedUrl } : null,
    };
    setLoad({ status: 'ready', ws: { ...ws, versions: [...ws.versions, added] } });
    setBusy(false);
    return next;
  }

  /** Review screen · Add to project / Screenshot ready · Add screenshot. */
  async function addReviewed() {
    const purpose = uploadFor;
    const name = work?.name ?? '';
    const meta = work ? describeWork(work) : '';
    const n = await saveWork();
    if (n === null) return;
    setDialog(null);
    setWork(null);
    if (purpose === 'version') {
      go('make');
      setVersion(n);
    } else if (purpose === 'A' || purpose === 'B') {
      if (purpose === 'A') setPairA(n);
      else setPairB(n);
    } else {
      setRevision({ number: n, file: { name, meta } });
      setVersion(n);
    }
  }

  if (loading) return null;
  if (!session) return <Redirect href="/sign-in" />;

  if (load.status !== 'ready') {
    return (
      <View className="flex-1 bg-paper">
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
  // A café screenshot the designer added replaces the sample with the same number.
  const own = (list: Version[]) => list.filter((v) => !local.some((l) => l.number === v.number));
  const all: Version[] = [...own(ws.versions), ...local];
  const listed: Version[] = ws.example
    ? [...own(CAFE.slice(0, step === 'brief' ? 1 : step === 'make' ? cafeHas : cafeAt[step].count)), ...local].sort((a, b) => a.number - b.number)
    : all;
  const shown = all.find((v) => v.number === version) ?? null;
  const hasScreen = all.length > 0;
  const makeCount = ws.example ? cafeHas + local.length : all.length;
  const kind = ws.example ? 'cafe' : 'own';

  const compareVersions: CompareVersion[] = (ws.example ? [...CAFE.slice(0, cafeHas), ...local] : all).map((v) => ({
    number: v.number,
    name: v.name,
    file: v.file,
    source: v.source,
  }));
  const pickable = compareVersions.filter((v) => v.number !== (changing === 'A' ? pairB : pairA));

  const editItems = [
    { label: 'Edit source', onPress: () => openDialog(ws.example ? 'source' : 'sourceGuide') },
    { label: 'Add screenshot', onPress: () => openDialog('add', 'version') },
    ...(step === 'brief' ? [{ label: 'Brief details', onPress: () => openDialog('brief') }] : []),
  ];

  const explained = ws.example ? cafeAnswers.tradeOff !== null : decision.saved;
  const next: Record<Stage, { label: string; disabled?: boolean; finish?: boolean; onPress: () => void }> = {
    brief: { label: 'Next: Make', onPress: () => go('make') },
    make: {
      label: 'Next: Revise',
      // Make → Revise is direct; after "Use vN" the decision has to be complete first.
      disabled: view === 'decision' && !explained,
      onPress: () => {
        if (chosen === null) setChosen(version);
        go('revise');
      },
    },
    revise: {
      label: 'Next: Reflect',
      disabled: !ws.example && !revision,
      onPress: () => {
        setRevisionSaved(true);
        go('reflect');
      },
    },
    reflect: { label: 'Finish', finish: true, onPress: () => router.replace('/projects') },
  };
  const n = next[step];

  const cafeChosen = chosen ?? 2;
  const record: CritRecord = ws.example
    ? {
        version: `v${cafeChosen}`,
        reason: CAFE_EXPLAIN[cafeChosen]?.goal ?? CAFE_EXPLAIN[2].goal,
        evidence: CAFE_EXPLAIN[cafeChosen]?.evidence ?? CAFE_EXPLAIN[2].evidence,
        tradeOff: CAFE_EXPLAIN[cafeChosen]?.tradeOff ?? CAFE_EXPLAIN[2].tradeOff,
        takeaway,
      }
    : {
        version: `v${chosen ?? version}`,
        reason: decision.reason || 'No reason saved yet.',
        evidence: decision.evidence ?? 'No evidence added.',
        tradeOff: decision.tradeOff ?? 'No trade-off named.',
        takeaway,
      };
  const startingVersion = chosen ?? (ws.example ? 2 : Math.max(1, revision ? revision.number - 1 : version));
  const comparing = step === 'make' && view === 'compare';
  const ownDecision = step === 'make' && view === 'decision' && !ws.example;
  const headerActions = !comparing;

  /** The work: the selected screen at its own proportions, with this version's feedback pins once critiqued. */
  const artwork = (v: Version | null) => (
    <View className="items-center" style={{ width: size.artwork, minHeight: size.artworkImageHeight }}>
      {v?.source ? (
        <VersionPreview source={v.source} label={v.name} maxWidth={size.artworkImage} maxHeight={size.artworkImageHeight}>
          {critiqued.includes(v.number) &&
            !ws.example &&
            aiPins[v.number]?.map((p, i) => (
              <FeedbackPin
                key={`${v.number}-${i}`}
                number={i + 1}
                title={p.title}
                body={p.body}
                side={p.x > 0.5 ? 'left' : 'right'}
                left={`${p.x * 100}%`}
                top={`${p.y * 100}%`}
              />
            ))}
          {critiqued.includes(v.number) &&
            (ws.example || !aiPins[v.number]) &&
            PINS[kind].map((p, i) => (
              <FeedbackPin
                key={p.title}
                number={i + 1}
                title={p.title}
                body={p.body}
                side={i === 0 ? 'right' : 'left'}
                {...pinAt(i)}
              />
            ))}
        </VersionPreview>
      ) : (
        <EmptyArtwork onAdd={() => openDialog('add', 'version')} />
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-paper">
      <AppNav variant="workspace" balance={balance} />

      {/* R8 · Compact workspace header */}
      <View
        className="h-navHeight flex-row items-center justify-between border-b border-border bg-paper px-64"
        style={{ zIndex: 2 }}
      >
        <Text numberOfLines={1} className="w-column font-semibold text-cardTitle text-ink">
          {ws.title}
        </Text>
        <StageNav current={step} onChange={(s) => go(s)} />
        <View className="w-column flex-row items-center justify-end gap-12">
          {headerActions && (
            <>
              <View>
                <Button label="Edit" variant="secondary" size="header" onPress={() => setEditOpen(!editOpen)} />
                {editOpen && (
                  <View style={{ position: 'absolute', left: 0, top: size.editDropdownTop }}>
                    <EditDropdown items={editItems} />
                  </View>
                )}
              </View>
              <Button
                label={n.label}
                size="header"
                width={size.nextButton}
                arrow={!n.finish}
                leading={n.finish ? 'finish' : undefined}
                disabled={n.disabled}
                onPress={n.onPress}
              />
            </>
          )}
        </View>
      </View>

      {/* Next action · Fixed footer: what to do next in Make. */}
      {step === 'make' && view === 'work' && hasScreen && (
        <NextAction
          state={makeCount >= 2 ? 'compare' : critiqued.includes(version) ? 'savedCritique' : 'addDirection'}
          onPress={() => {
            if (makeCount >= 2) return compare();
            setCritiqueToast(false);
            setView('direction');
            setPanelOpen(true);
          }}
        />
      )}

      <ScrollView className="flex-1" contentContainerClassName="items-center">
        {/* The 1440 frame, centred: the work sits in the middle of the window, as in every Figma frame. */}
        <View className="p-24" style={{ width: size.page }}>
          <View style={{ minHeight: step === 'reflect' ? size.reflectHeight : size.artworkHeight }}>
            {comparing ? (
              <View style={{ marginLeft: size.compareModeLeft }}>
                <CompareVersions
                  versions={compareVersions}
                  a={pairA}
                  b={pairB}
                  onChange={(side) => {
                    setChanging(side);
                    openDialog('addVersion', side);
                  }}
                  onUse={(v) => {
                    setChosen(v);
                    setVersion(v);
                    setDecisionOpen(true);
                    setPanelOpen(true);
                    if (ws.example) {
                      // Flow A · CH06: v2 (and v3) arrive with goal and evidence drafted; v1 starts the same way.
                      setCafeAnswers({ goal: 0, evidence: 0, tradeOff: null });
                    } else {
                      setDecision({ reason: '', evidence: null, tradeOff: null, saved: false });
                    }
                    setView('decision');
                  }}
                  onExit={() => {
                    setView('work');
                    setPanelOpen(true);
                  }}
                />
              </View>
            ) : ownDecision ? (
              /* R11 · Selected version and decision: the chosen screen, Explain your choice beside it. */
              <View style={{ marginLeft: size.compareModeLeft - size.versionLabel }}>
                <View className="flex-row items-center gap-12 pb-12">
                  <Button label="← Back to comparison" variant="secondary" size="sm" onPress={compare} />
                  <Text className="font-medium text-labelUi text-ink">{all.find((v) => v.number === chosen)?.name}</Text>
                </View>
                {(() => {
                  const c = all.find((v) => v.number === chosen);
                  return c?.source ? (
                    <VersionPreview source={c.source} label={c.name} maxWidth={size.chosenVersion} maxHeight={size.portraitMaxHeight} />
                  ) : null;
                })()}
              </View>
            ) : step === 'reflect' ? (
              <View style={{ marginLeft: size.artworkLeft, width: size.artwork }}>
                {revisionSaved ? (
                  <ReflectCompare
                    before={all.find((v) => v.number === startingVersion) ?? null}
                    after={ws.example ? CAFE[2] : (all.find((v) => v.number === revision?.number) ?? null)}
                    example={ws.example}
                  />
                ) : (
                  <NoSavedRevision onRevise={() => go('revise')} onBack={() => go('make')} />
                )}
              </View>
            ) : (
              <View style={{ marginLeft: size.artworkLeft, width: size.artwork }}>{artwork(shown)}</View>
            )}

            {/* Version switcher · Floating. Hovering a version shows its thumbnail. */}
            {!comparing && !ownDecision && listed.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: size.versionTop - ((listed.length - 1) * size.versionRow) / 2,
                  zIndex: 3,
                }}
              >
                {listed.map((v) => {
                  const current = v.number === version;
                  return (
                    <Pressable
                      key={v.number}
                      accessibilityRole="button"
                      accessibilityState={{ selected: current }}
                      onPress={() => {
                        setVersion(v.number);
                        setHoverVersion(null);
                        if (step === 'make' && view === 'decision') setView('work');
                      }}
                      onHoverIn={() => setHoverVersion(v.number)}
                      onHoverOut={() => setHoverVersion((h) => (h === v.number ? null : h))}
                      className="h-versionRow flex-row items-center"
                    >
                      <View className="h-versionRow w-16 items-center justify-center">
                        <View className="absolute h-versionRow border-l border-border" />
                        <View
                          className={`rounded-pill ${current ? 'h-versionDotCurrent w-versionDotCurrent bg-ink' : 'h-versionDot w-versionDot bg-border'}`}
                        />
                      </View>
                      <View
                        className={`h-versionLabelHeight w-versionLabel justify-center rounded-6 px-6 ${current ? 'bg-softBlue' : ''}`}
                      >
                        <Text className={`font-regular text-labelUi ${current ? 'text-ink' : 'text-secondaryText'}`}>
                          Version {v.number}
                        </Text>
                      </View>
                      {hoverVersion === v.number && v.source && (
                        <View
                          className="gap-6 rounded-12 border border-border bg-white p-8"
                          style={{ position: 'absolute', left: size.versionLabel + size.connector16 + size.connector16 }}
                        >
                          <VersionPreview
                            source={v.source}
                            maxWidth={size.versionHoverPreview}
                            maxHeight={size.versionHoverPreviewHeight}
                            fill
                          />
                          <Text className="font-medium text-labelSmall text-ink">{v.name}</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* R10 · Tools open control */}
            {!comparing && !ownDecision && hasScreen && (step !== 'reflect' || revisionSaved) && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={panelOpen ? 'Collapse panel' : 'Expand panel'}
                onPress={() => setPanelOpen(!panelOpen)}
                className="flex-row items-center gap-8"
                style={[
                  { position: 'absolute' },
                  step === 'reflect'
                    ? { left: size.artworkLeft + size.artwork - size.collapse, top: size.reflectPanelTop }
                    : { right: 0, top: 0 },
                ]}
              >
                {!panelOpen && step === 'make' && critiqued.includes(version) && (
                  <Text className="font-regular text-labelSmall text-secondaryText">Details</Text>
                )}
                <View className="h-collapse w-collapse items-center justify-center rounded-pill border border-border bg-white">
                  <Icon
                    name={!panelOpen && step === 'make' ? 'message' : step === 'make' && panelOpen ? 'chevronDown' : 'arrowRight'}
                    size={size.icon}
                  />
                </View>
              </Pressable>
            )}

            {panelOpen && !comparing && (hasScreen || step === 'brief') && (step !== 'reflect' || revisionSaved) && (
              <View
                style={[
                  { position: 'absolute' },
                  step === 'reflect'
                    ? {
                        left: size.artworkLeft + size.reflectPanelLeft,
                        top: size.reflectPanelTop + size.reflectSurfaceTop,
                        width: size.reflectPanel,
                      }
                    : ownDecision
                      ? { right: 0, top: 0, width: size.decisionPanel }
                      : { right: 0, top: size.panelTop, width: step === 'make' && (view === 'work' || view === 'direction') ? size.panelMake : size.panel },
                ]}
              >
                {step === 'brief' && (
                  <BriefPanel title={ws.example ? 'The café brief' : 'Your brief'} audience={ws.audience} goal={ws.goal} />
                )}
                {step === 'make' && view === 'work' && (
                  <MakePanel
                    version={shown?.name ?? `v${version}`}
                    balance={balance}
                    onCritique={(focus: CritiqueFocus) => (ws.example ? critiqueExample() : critiqueOwn(focus))}
                    onCompare={compare}
                    onGuidelines={() => openDialog('guidelines')}
                    onPlans={() => router.push('/account/plans')}
                  />
                )}
                {step === 'make' && view === 'direction' && (
                  <AddDirectionPanel
                    example={ws.example}
                    next={ws.example ? 2 : Math.max(0, ...all.map((v) => v.number)) + 1}
                    change={ws.example ? EXAMPLE_COPY.direction : `Change one thing toward your goal: ${ws.goal}`}
                    constant={ws.example ? EXAMPLE_COPY.constant : 'Same audience, content, images and screen size.'}
                    onSample={() => {
                      setCafeHas(2);
                      setVersion(2);
                      setView('work');
                      setPanelOpen(true);
                    }}
                    onUpload={() => openDialog('add', 'version')}
                    onBack={() => {
                      setView('work');
                      setPanelOpen(true);
                    }}
                  />
                )}
                {step === 'make' && view === 'decision' && ws.example && (
                  <ExplainPanel
                    chosen={cafeChosen}
                    answers={cafeAnswers}
                    onAnswers={setCafeAnswers}
                    onBack={compare}
                    onTips={() => openDialog('decisionTips')}
                  />
                )}
                {ownDecision &&
                  (decisionOpen ? (
                    <ExplainYourChoice
                      decision={decision}
                      onDecision={setDecision}
                      onFold={() => setDecisionOpen(false)}
                      onNext={() => go('revise')}
                    />
                  ) : (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setDecisionOpen(true)}
                      className="flex-row items-center justify-end gap-8"
                    >
                      <Text className="font-regular text-labelSmall text-secondaryText">Decision</Text>
                      <View className="h-collapse w-collapse items-center justify-center rounded-pill border border-border bg-white">
                        <Icon name="message" size={size.icon} />
                      </View>
                    </Pressable>
                  ))}
                {step === 'revise' && (
                  <RevisePanel
                    example={ws.example}
                    starting={ws.example ? `v${startingVersion} · Current` : `v${startingVersion} · Selected`}
                    lead={ws.example ? EXAMPLE_COPY.revise : `Keep what works and change one thing toward: ${ws.goal}`}
                    file={ws.example ? { name: 'cafe-revision.png', meta: 'PNG · 1.2 MB' } : (revision?.file ?? null)}
                    onSource={() => openDialog(ws.example ? 'source' : 'sourceGuide')}
                    onUpload={() => openDialog('addShot', 'revision')}
                    onTips={() => openDialog('revisionTips')}
                    onWhy={() => openDialog('why')}
                  />
                )}
                {step === 'reflect' && (
                  <ReflectPanel
                    example={ws.example}
                    takeaway={takeaway}
                    onTakeaway={setTakeaway}
                    onNotes={() => openDialog('notes')}
                    onBack={() => go('make')}
                    onFinish={() => router.replace('/projects')}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {critiqueToast && <CritiqueSaved onClose={() => setCritiqueToast(false)} />}
      {critiqueRun && (
        <View
          className="w-critiqueToast"
          style={{ position: 'absolute', right: size.critiqueToastRight, bottom: size.critiqueToastBottom, zIndex: 4 }}
        >
          {critiqueRun.state === 'running' ? (
            <StatusNotice state="running" actionLabel="Hide" onAction={() => setCritiqueRun(null)} />
          ) : (
            <StatusNotice
              state="error"
              body={`${critiqueRun.message} 0 credits used.`}
              onAction={() => critiqueOwn(critiqueRun.focus)}
            />
          )}
        </View>
      )}

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
        onAddScreenshot={() => openDialog(step === 'revise' ? 'addShot' : 'add', step === 'revise' ? 'revision' : 'version')}
      />
      <GuidanceDialog
        visible={dialog === 'sourceGuide'}
        title="Edit in your design tool."
        description="Make the change in your source file, then return here to add the updated screenshot."
        motion="revise"
        onClose={closeDialog}
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
        title={hasScreen ? 'Review your screen' : undefined}
        description={hasScreen ? 'This becomes your next saved version.' : undefined}
        busy={busy}
        error={reviewError}
        onClose={closeDialog}
        onReplace={chooseFile}
        onChooseAnother={() => {
          setWork(null);
          setReviewError(null);
          setDialog('add');
        }}
        onAdd={addReviewed}
      />
      <BriefDetails
        visible={dialog === 'brief'}
        title={ws.example ? 'The café brief' : 'Your brief'}
        audience={ws.audience}
        goal={ws.example ? EXAMPLE_COPY.success : ws.goal}
        onClose={closeDialog}
      />
      <GuidanceDialog
        visible={dialog === 'guidelines'}
        title="Project guidelines"
        motion="guide"
        sections={[
          { label: 'GOAL', body: ws.example ? EXAMPLE_COPY.guideline : ws.goal },
          { label: 'KEEP CONSTANT', body: ws.example ? EXAMPLE_COPY.constant : `${ws.audience} Keep the content and viewport the same.` },
        ]}
        onClose={closeDialog}
      />
      <GuidanceDialog
        visible={dialog === 'decisionTips'}
        title="Write a decision you can explain"
        sections={[
          { label: 'GOAL', body: 'Why does this version help the person using it?' },
          { label: 'EVIDENCE', body: 'Point to one visible detail.' },
          { label: 'TRADE-OFF', body: 'Name one risk to check next.' },
        ]}
        action="Done"
        onClose={closeDialog}
      />
      <GuidanceDialog
        visible={dialog === 'revisionTips'}
        title="Make one useful change"
        description="Edit your source file, then add an updated screen."
        sections={[{ body: 'Save it as a new version so your earlier attempts remain available.', tone: 'guidance' }]}
        action="Back to revision"
        onClose={closeDialog}
      />
      <GuidanceDialog
        visible={dialog === 'why'}
        title="Why this version?"
        sections={[
          { label: 'YOUR DECISION', body: ws.example ? `v${cafeChosen} · ${record.reason}` : `${record.version} · ${record.reason}` },
          { label: 'TRADE-OFF TO CHECK', body: record.tradeOff },
        ]}
        action="Back to revision"
        onClose={closeDialog}
      />
      <AddVersionDialog
        visible={dialog === 'addVersion'}
        onClose={closeDialog}
        onChooseSaved={() => setDialog('savedVersions')}
        onAddScreenshot={() => openDialog('addShot', changing)}
      />
      <SavedVersionsDialog
        visible={dialog === 'savedVersions'}
        options={pickable}
        onClose={closeDialog}
        onAddScreenshot={() => openDialog('addShot', changing)}
        onChoose={(num) => {
          if (changing === 'A') setPairA(num);
          else setPairB(num);
          setDialog(null);
        }}
      />
      <AddScreenshotDialog
        visible={dialog === 'addShot'}
        error={addError}
        onClose={closeDialog}
        onChoose={chooseFile}
        onDropFile={takeFile}
      />
      <ScreenshotReady
        work={dialog === 'shotReady' ? work : null}
        next={`v${Math.max(0, ...all.map((v) => v.number)) + 1}`}
        description={
          uploadFor === 'revision'
            ? ws.example
              ? 'The café example keeps this screenshot for this visit only.'
              : 'Add this screenshot as your revision.'
            : ws.example
              ? 'Add this screenshot to the comparison. The café example keeps it for this visit only.'
              : 'Add this screenshot to the comparison.'
        }
        action={uploadFor === 'revision' ? 'Add revision' : 'Add screenshot'}
        busy={busy}
        error={reviewError}
        onClose={closeDialog}
        onChooseAnother={() => {
          setWork(null);
          setReviewError(null);
          setDialog('addShot');
        }}
        onAdd={addReviewed}
      />
      <SavedRecord visible={dialog === 'notes'} record={record} onClose={closeDialog} onSummary={() => setDialog('summary')} />
      <ProjectSummary
        visible={dialog === 'summary'}
        title={ws.title}
        goal={ws.example ? 'make the pickup action easy to find' : ws.goal}
        before={`v${startingVersion}`}
        after={ws.example ? 'v3' : `v${revision?.number ?? startingVersion}`}
        decision={ws.example ? `v${cafeChosen} · ${CAFE[cafeChosen - 1]?.name.split(' · ')[1] ?? ''}` : record.version}
        record={record}
        onClose={() => setDialog('notes')}
      />
    </View>
  );
}

/** Where pin i sits on the drawn screen (Feedback 1 · vN at 403,486 and Feedback 2 · vN at 602,486 on the café frame). */
function pinAt(i: number) {
  const left = (i === 0 ? size.feedbackPin1Left : size.feedbackPin2Left) / size.artworkImage;
  const top = size.feedbackPinTop / size.artworkImageHeight;
  return { left: `${left * 100}%` as const, top: `${top * 100}%` as const };
}

/** Flow B · CH02a / CH03a · No screen yet. */
function EmptyArtwork({ onAdd }: { onAdd: () => void }) {
  return (
    <View
      className="items-center justify-center gap-12 rounded-24 border border-dashed border-secondaryText bg-white"
      style={{ width: size.artworkImage, height: size.artworkImageHeight }}
    >
      <Text className="font-semibold text-cardTitle text-ink">No screen yet</Text>
      <Text className="font-regular text-bodyUi text-secondaryText">Add one PNG or JPG to get feedback.</Text>
      <Button label="Add your first screen" size="md" leading="uploadWhite" onPress={onAdd} />
    </View>
  );
}

/** CH08b · Reflect · No saved revision (11125:43336). */
function NoSavedRevision({ onRevise, onBack }: { onRevise: () => void; onBack: () => void }) {
  return (
    <View
      className="items-center justify-center gap-12 rounded-24 border border-dashed border-secondaryText bg-white"
      style={{ width: size.artworkImage, height: size.artworkImageHeight }}
    >
      <Text className="font-semibold text-cardTitle text-ink">Save a revision to see your progress.</Text>
      <Text className="font-regular text-bodyUi text-secondaryText">
        Your first and latest saved screens will appear here, with the reason for your change.
      </Text>
      <View className="flex-row gap-12">
        <Button label="Back to workspace" variant="secondary" size="md" onPress={onBack} />
        <Button label="Go to Revise" size="md" arrow onPress={onRevise} />
      </View>
    </View>
  );
}

/** Figma: CH08 · See what changed (before → after), each screen whole at its own proportions. */
function ReflectCompare({ before, after, example }: { before: Version | null; after: Version | null; example: boolean }) {
  const card = (label: string, v: Version | null) => (
    <View
      className="gap-12 rounded-14 border border-border p-16"
      style={{ width: size.compareCard, minHeight: size.compareCardHeight }}
    >
      <Text className="font-medium text-labelUi text-ink">{label}</Text>
      <View
        className="flex-1 items-center justify-center rounded-10 bg-paper p-8"
        style={{ minHeight: size.compareCanvasHeight }}
      >
        {v?.source ? (
          // Capped at the canvas height so the What I learned card never covers a tall phone screen; still whole, never cropped.
          <VersionPreview source={v.source} label={v.name} maxWidth={size.compareImage} maxHeight={size.compareCanvasHeight} />
        ) : (
          <Icon name="image" />
        )}
      </View>
    </View>
  );
  const b = before?.number ?? 2;
  const a = after?.number ?? 3;
  return (
    <View className="gap-24">
      <View className="gap-6">
        <Text className="font-semibold text-meta text-secondaryText">SEE WHAT CHANGED</Text>
        <Text className="font-bold text-heading text-ink">
          v{b} → v{a}
        </Text>
      </View>
      <View className="flex-row items-stretch gap-24">
        {card(`Before · v${b}`, before)}
        {card(`After · v${a}`, after)}
      </View>
      <View className="gap-6 pt-16" style={{ width: size.reflectChangedText }}>
        <Text className="font-medium text-labelUi text-ink">What changed</Text>
        <Text className="font-regular text-bodyUi text-secondaryText">
          {example
            ? 'Pickup stays the primary action. An outlined menu button keeps the second action easy to find.'
            : 'Compare the two screens, then write what changed in What I learned.'}
        </Text>
      </View>
    </View>
  );
}
