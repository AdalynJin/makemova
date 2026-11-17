import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { StageNav, type Stage } from '@/components/StageNav';
import { VersionComparison, type Comparison } from '@/components/VersionComparison';
import { VersionTimeline } from '@/components/VersionTimeline';
import { BriefPanel, ExplainPanel, MakePanel, ReflectPanel, RevisePanel, type WorkspaceTool } from '@/components/WorkspacePanels';
import { useAuth } from '@/lib/auth';
import { canPickScreenshot, pickScreenshot } from '@/lib/screenshot-picker';
import { supabase } from '@/lib/supabase';
import { asset, cardShadow } from '@/lib/ui';
import { loadVersions, saveWorkspaceProgress, uploadVersion, type Version, type WorkspaceProgress } from '@/lib/workspace-data';
import { nextStage, pickComparisonVersion } from '@/lib/workspace-rules';
import { color, size, space } from '@/tokens';

type Workspace = { title: string; audience: string; goal: string };
type Load = { status: 'loading' | 'error' } | { status: 'ready'; workspace: Workspace };
type Panel = 'Critique' | 'Compare' | 'Tutorials' | 'Guidelines' | 'Explain' | null;

const exampleWorkspace = {
  title: 'Campus café ordering',
  audience: 'Students between classes.',
  goal: 'Make pickup easy to find and keep the menu accessible.',
};
const exampleVersions: Version[] = [asset.cafe1, asset.cafe2, asset.cafe3].map((source, index) => ({
  number: index + 1, label: ['Original', 'Alternative', 'Revision'][index], source,
}));
const exampleAnswers: WorkspaceProgress = {
  goal_fit: 'Pickup is the first thing students see.',
  evidence: 'Only “Order pickup” is a filled button.',
  revision_note: 'Pickup stays filled. Menu is now an outlined button so it is easier to find.',
  lesson: 'Give one action the most contrast; make the second one quieter, not hidden.',
};
const nextLabels = { brief: 'Next: Make', make: 'Next: Revise', revise: 'Next: Reflect', reflect: 'Finish' };

async function fetchWorkspace(id: string, exampleKey: string): Promise<{
  workspace: Workspace;
  progress: WorkspaceProgress;
  images: Version[];
  initialStage: Stage;
  initialVersion: number | null;
}> {
  if (id === 'example') {
    const stored = await AsyncStorage.getItem(exampleKey);
    const progress = stored ? { ...exampleAnswers, ...JSON.parse(stored) } as WorkspaceProgress : exampleAnswers;
    const initialVersion = progress.decision_version ?? (progress.stage === 'revise' ? 3 : progress.stage === 'make' ? 2 : 1);
    return { workspace: exampleWorkspace, progress, images: exampleVersions, initialStage: 'brief', initialVersion };
  }
  const [project, progressRow, images] = await Promise.all([
    supabase.from('projects').select('title, project_contexts(goal, audience, brief_source)').eq('id', id).maybeSingle(),
    supabase.from('workspace_progress').select('stage, decision_version, goal_fit, evidence, trade_off, revision_note, lesson').eq('project_id', id).maybeSingle(),
    loadVersions(id),
  ]);
  if (project.error || progressRow.error || !project.data) throw new Error('Project unavailable');
  const context = Array.isArray(project.data.project_contexts) ? project.data.project_contexts[0] : project.data.project_contexts;
  const progress = (progressRow.data ?? {}) as WorkspaceProgress;
  return {
    workspace: {
      title: project.data.title,
      audience: context?.audience || 'Add who this is for.',
      goal: context?.goal || 'Add what you want to improve.',
    },
    progress,
    images,
    initialStage: context?.brief_source === 'own_work' ? 'make' : 'brief',
    initialVersion: images.find((image) => image.number === progress.decision_version)?.number ?? images.at(-1)?.number ?? null,
  };
}

export default function ProjectWorkspaceRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session, loading } = useAuth();
  if (loading) return <ActivityIndicator color={color.ink} />;
  if (!session) return <Redirect href={id === 'example' ? { pathname: '/sign-in', params: { project: 'example' } } : '/sign-in'} />;
  return <ProjectWorkspace key={session.user.id + ':' + id} id={id} userId={session.user.id} />;
}

function ProjectWorkspace({ id, userId }: { id: string; userId: string }) {
  const example = id === 'example';
  const exampleKey = 'makemova:example:' + userId;
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [stage, setStage] = useState<Stage>('brief');
  const [versions, setVersions] = useState<Version[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [panel, setPanel] = useState<Panel>(null);
  const [comparison, setComparison] = useState<Comparison>([null, null]);
  const [decision, setDecision] = useState<number | null>(null);
  const [draft, setDraft] = useState<WorkspaceProgress>({});
  const [saved, setSaved] = useState<WorkspaceProgress>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [critique, setCritique] = useState<{ version: number; text: string } | null>(null);
  const [openingFeedback, setOpeningFeedback] = useState(false);
  const saveLock = useRef(false);
  const uploadLock = useRef(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    void fetchWorkspace(id, exampleKey).then(({ workspace, progress, images, initialVersion, initialStage }) => {
      if (!active) return;
      setStage(progress.stage ?? initialStage);
      setVersions(images);
      setSelected(initialVersion);
      setDraft(progress);
      setSaved(progress);
      setLoad({ status: 'ready', workspace });
    }, () => {
      if (active) setLoad({ status: 'error' });
    });
    return () => { active = false; };
  }, [attempt, exampleKey, id]);

  const current = versions.find((v) => v.number === selected);
  const feedback = critique?.version === selected ? critique?.text : null;

  async function persist(patch: WorkspaceProgress) {
    if (saveLock.current) return false;
    saveLock.current = true;
    setSaving(true);
    setMessage(null);
    try {
      if (example) await AsyncStorage.setItem(exampleKey, JSON.stringify({ ...saved, ...patch }));
      else await saveWorkspaceProgress(id, patch);
      setSaved((previous) => ({ ...previous, ...patch }));
      return true;
    } catch {
      setMessage('Your changes are still here. Try saving again.');
      return false;
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  async function go(next: Stage) {
    if (next === stage) return;
    const patch: WorkspaceProgress = { stage: next };
    if (stage === 'revise') patch.revision_note = draft.revision_note ?? '';
    if (stage === 'reflect') patch.lesson = draft.lesson ?? '';
    if (!(await persist(patch))) return;
    setStage(next);
    setPanel(null);
    setPanelOpen(true);
    if (example && next === 'make') setSelected(saved.decision_version ?? 2);
    if (example && next === 'revise') setSelected(saved.decision_version ?? 3);
  }

  async function finish() {
    if (await persist({ stage: 'reflect', revision_note: draft.revision_note ?? '', lesson: draft.lesson ?? '' })) router.replace('/projects');
  }

  function changeComparison(side: 0 | 1, number: number) {
    setComparison((previous) => {
      const candidate = pickComparisonVersion(previous[side === 0 ? 1 : 0], number);
      if (candidate === null) return previous;
      return side === 0 ? [candidate, previous[1]] : [previous[0], candidate];
    });
  }

  async function upload(side?: 0 | 1) {
    if (example || !canPickScreenshot || uploadLock.current) return;
    uploadLock.current = true;
    setUploading(true);
    setMessage(null);
    try {
      const file = await pickScreenshot();
      if (!file) return;
      const number = await uploadVersion(id, userId, file);
      const images = await loadVersions(id);
      setVersions(images);
      if (side === undefined) setSelected(number);
      else changeComparison(side, number);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load the new version. Reopen the project before retrying.');
    } finally {
      uploadLock.current = false;
      setUploading(false);
    }
  }

  function openTool(tool: WorkspaceTool) {
    setMessage(null);
    if (tool === 'Compare') {
      setComparison([selected, example ? versions.find((v) => v.number !== selected)?.number ?? null : null]);
    }
    setPanel(panel === 'Critique' && tool === 'Critique' ? null : tool);
  }

  function explain(number: number) {
    setDecision(number);
    setSelected(number);
    if (number !== decision) {
      setDraft((previous) => ({
        ...previous,
        goal_fit: number === saved.decision_version ? saved.goal_fit : example ? exampleAnswers.goal_fit : '',
        evidence: number === saved.decision_version ? saved.evidence : example ? exampleAnswers.evidence : '',
        trade_off: number === saved.decision_version ? saved.trade_off : '',
      }));
    }
    setPanel('Explain');
    setPanelOpen(true);
  }

  async function openFeedback() {
    if (selected === null || openingFeedback) return;
    if (example) {
      setCritique({ version: selected, text: selected === 1
        ? 'The pickup and menu actions have similar weight. Make pickup easier to spot by giving just that action the filled style.'
        : 'Pickup reads first. Check that the quieter menu action is still easy to find.' });
      return;
    }
    if (!current?.id) return;
    setOpeningFeedback(true);
    setMessage(null);
    const result = await supabase.from('critique_sessions').select('feedback')
      .eq('project_id', id).eq('version_id', current.id).not('feedback', 'is', null)
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    setOpeningFeedback(false);
    if (result.error) setMessage('Feedback could not load. Try again.');
    else if (result.data?.feedback) setCritique({ version: selected, text: result.data.feedback });
    else setMessage('No saved feedback for this version. New critiques are unavailable.');
  }

  const uploadButton = !example && (canPickScreenshot
    ? <Button label="Add screenshot" size="sm" busy={uploading} onPress={() => void upload()} />
    : <Text className="font-regular text-labelUi text-secondaryText">Open Makemova on the web to add a screenshot.</Text>);

  if (load.status !== 'ready') {
    return (
      <View className="flex-1 bg-canvas">
        <AppNav variant="workspace" />
        <View className="flex-1 items-center justify-center gap-16">
          {load.status === 'loading' ? <ActivityIndicator color={color.ink} /> : (
            <>
              <Text className="font-semibold text-cardTitle text-ink">Project could not load</Text>
              <Text className="font-regular text-bodyUi text-secondaryText">Check your connection and try again.</Text>
              <Button label="Try again" size="sm" onPress={() => {
                setLoad({ status: 'loading' });
                setAttempt((value) => value + 1);
              }} />
              <Button label="Back to My projects" variant="white" size="sm" onPress={() => router.replace('/projects')} />
            </>
          )}
        </View>
      </View>
    );
  }

  const following = nextStage(stage);
  const decisionSaved = decision !== null && saved.decision_version === decision
    && saved.goal_fit === draft.goal_fit && saved.evidence === draft.evidence && saved.trade_off === draft.trade_off;
  const changeDraft = (key: 'goal_fit' | 'evidence' | 'trade_off' | 'revision_note' | 'lesson', value: string) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
  };
  const critiquePanel = (
    <View className="gap-8 rounded-12 bg-paper p-16">
      <Text className="font-semibold text-labelUi text-ink">{selected === null ? 'Choose a screenshot first' : 'Version ' + selected + ' · Current'}</Text>
      {feedback ? <Text className="font-regular text-labelUi text-ink">{feedback}</Text> : (
        <>
          <Text className="font-regular text-labelUi text-secondaryText">
            {example ? 'Preview the café feedback. No credits are used.' : 'Open existing feedback for this screenshot. New critiques are currently unavailable.'}
          </Text>
          <Button label={example ? 'View example feedback' : 'Open saved feedback · Free'} size="sm" busy={openingFeedback} disabled={!current} onPress={openFeedback} />
        </>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-canvas">
      <AppNav variant="workspace" />
      <View className="h-navHeight flex-row items-center justify-between border-b border-border bg-white px-64">
        <Text numberOfLines={1} className="w-column font-semibold text-cardTitle text-ink">{load.workspace.title}</Text>
        <StageNav current={stage} onChange={(next) => void go(next)} />
        <View className="w-column flex-row items-center justify-end gap-12">
          {stage === 'make' && current && !example ? uploadButton : <Button label="Edit" variant="white" size="md" />}
          <Button label={nextLabels[stage]} size="md" width={size.nextButton}
            arrow={following !== null} leading={following === null ? 'finish' : undefined} busy={saving}
            onPress={() => (following ? go(following) : finish())} />
        </View>
      </View>
      {message && (
        <View className="border-b border-border bg-white px-24 py-12">
          <Text accessibilityRole="alert" className="font-medium text-labelUi text-ink">{message}</Text>
        </View>
      )}
      <ScrollView className="flex-1" contentContainerClassName="p-24">
        {panel === 'Compare' ? (
          <VersionComparison versions={versions} value={comparison} onChange={changeComparison} onChoose={explain}
            onUpload={!example && canPickScreenshot && !uploading ? (side) => void upload(side) : undefined}
            onExit={() => setPanel(null)} />
        ) : (
          <View className={'rounded-24' + (stage === 'brief' ? ' bg-white' : '')} style={{ minHeight: size.artworkHeight + space[48] }}>
            <View style={{ marginLeft: size.artworkLeft, width: size.artwork }}>
              {stage === 'reflect' && versions.length >= 2 ? (
                <VersionComparison versions={versions}
                  value={[versions[versions.length - 2].number, versions.at(-1)?.number ?? null]}
                  onChange={changeComparison} />
              ) : (
                <View style={{ width: size.artwork, height: size.artworkHeight }}>
                  {current?.source ? (
                    <Image source={current.source} accessibilityLabel={'Version ' + current.number + ' screenshot'}
                      style={{ position: 'absolute', left: space[16], top: space[16], width: size.artworkImage, height: size.artworkImageHeight }}
                      contentFit={example ? 'cover' : 'contain'} />
                  ) : (
                    <View className="items-center justify-center gap-8 rounded-24 border border-dashed border-secondaryText bg-white"
                      style={{ position: 'absolute', left: space[16], top: space[16], width: size.artworkImage, height: size.artworkImageHeight }}>
                      <Text className="font-semibold text-cardTitle text-ink">{current ? 'Screenshot unavailable' : 'No screen yet'}</Text>
                      {uploadButton}
                    </View>
                  )}
                </View>
              )}
            </View>
            {stage !== 'reflect' && versions.length > 0 && <VersionTimeline versions={versions} selected={selected} onSelect={setSelected} />}
            <Pressable accessibilityRole="button" accessibilityLabel={panelOpen ? 'Collapse panel' : 'Expand panel'}
              accessibilityState={{ expanded: panelOpen }} onPress={() => setPanelOpen(!panelOpen)}
              className="h-collapse w-collapse items-center justify-center rounded-pill border border-border bg-white"
              style={{ position: 'absolute', right: 0, top: 0 }}>
              <Icon name={panelOpen ? 'chevronDown' : 'arrowRight'} size={size.iconSmall} />
            </Pressable>
            {panelOpen && (
              <View style={{ position: 'absolute', right: 0, top: size.panelTop, width: stage === 'make' && (!panel || panel === 'Critique') ? size.panelMake : size.panel }}>
                {stage === 'brief' && <BriefPanel title={example ? 'The café brief' : 'Your brief'} audience={load.workspace.audience} goal={load.workspace.goal} />}
                {stage === 'make' && (panel === null || panel === 'Critique') && (
                  <MakePanel onTool={openTool} critiqueMeta={example ? 'Example feedback · Free' : 'Saved feedback · Free'}
                    confirmation={panel === 'Critique' ? critiquePanel : undefined} />
                )}
                {stage === 'make' && (panel === 'Tutorials' || panel === 'Guidelines') && (
                  <View className="gap-16 rounded-24 bg-white p-24" style={cardShadow}>
                    <Button label="Back to tools" variant="quiet" size="sm" onPress={() => setPanel(null)} />
                    <Text className="font-bold text-heading text-ink">{panel}</Text>
                    {panel === 'Tutorials' ? (
                      <>
                        <Text className="font-semibold text-labelUi text-ink">Action hierarchy</Text>
                        <Text className="font-regular text-labelUi text-secondaryText">Give the most important action the strongest contrast. Then check that the second action is still easy to find.</Text>
                        <Text className="font-semibold text-labelUi text-ink">Compare one change</Text>
                        <Text className="font-regular text-labelUi text-secondaryText">Keep the content and layout steady. Change one thing and compare both versions against the same goal.</Text>
                      </>
                    ) : <Text className="font-regular text-labelUi text-secondaryText">Bring one screenshot and one decision. Compare versions for free, and review the cost before any new critique.</Text>}
                  </View>
                )}
                {stage === 'make' && panel === 'Explain' && (
                  <ExplainPanel example={example} goalFit={draft.goal_fit ?? ''} evidence={draft.evidence ?? ''} tradeOff={draft.trade_off ?? ''}
                    onGoalFit={(value) => changeDraft('goal_fit', value)}
                    onEvidence={(value) => changeDraft('evidence', value)}
                    onTradeOff={(value) => changeDraft('trade_off', value)}
                    onBack={() => setPanel('Compare')}
                    onSave={() => {
                      if (decision !== null) void persist({ stage, decision_version: decision, goal_fit: draft.goal_fit, evidence: draft.evidence, trade_off: draft.trade_off });
                    }}
                    saving={saving} saved={decisionSaved} />
                )}
                {stage === 'revise' && <RevisePanel note={draft.revision_note ?? ''} onNote={(value) => changeDraft('revision_note', value)} version={selected} example={example} upload={uploadButton} />}
                {stage === 'reflect' && <ReflectPanel lesson={draft.lesson ?? ''} onLesson={(value) => changeDraft('lesson', value)} onBack={() => void go('make')} onFinish={finish} saving={saving} />}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
