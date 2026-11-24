import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { ChooseAnswer, type Answer } from '@/components/ChooseAnswer';
import { ChooseCritiqueFocus, type CritiqueFocus } from '@/components/ChooseCritiqueFocus';
import { ConfirmCritique } from '@/components/ConfirmCritique';
import { CritiqueRequest } from '@/components/CritiqueRequest';
import { Icon } from '@/components/Icon';
import { Motion } from '@/components/Motion';
import { NotEnoughCredits } from '@/components/NotEnoughCredits';
import { StarterChoices } from '@/components/StarterChoices';
import { Sticker } from '@/components/Sticker';
import { MovaToolCard, type Tool } from '@/components/MovaToolCard';
import { ToolHoverPreview } from '@/components/ToolHoverPreview';
import { TutorialsDialog } from '@/components/TutorialsDialog';
import { cardShadow, toolsShadow } from '@/lib/ui';
import { color, size, space } from '@/tokens';

const card = 'rounded-24 border border-border bg-white p-16';
const surface = `gap-16 ${card}`;

function Numbered({ n, label }: { n: number; label: string }) {
  return (
    <View className="flex-row items-center gap-8">
      <View className="h-stageMarker w-stageMarker items-center justify-center rounded-pill bg-stageDone">
        <Text className="font-medium text-meta text-ink">{n}</Text>
      </View>
      <Text className="font-medium text-labelUi text-ink">{label}</Text>
    </View>
  );
}

function Radio() {
  return <View className="h-radioChosen w-radioChosen rounded-pill border-radio border-ink bg-white" />;
}

function Caps({ children }: { children: string }) {
  return <Text className="font-semibold text-meta text-secondaryText">{children}</Text>;
}

/** Figma: CH02 · Brief panel — "The café brief". */
export function BriefPanel({ title, audience, goal }: { title: string; audience: string; goal: string }) {
  return (
    <View>
      <Sticker crew="mateSetTheGoal" width={size.peekMateGoal} style={{ position: 'absolute', left: size.peekGoalLeft, bottom: '100%' }} />
      <View className={`${surface} pb-64`} style={cardShadow}>
        <Text className="font-bold text-briefTitle text-ink">{title}</Text>
        <View className="gap-6">
          <Caps>AUDIENCE</Caps>
          <View className="rounded-12 bg-paper px-12 py-12">
            <Text className="font-regular text-bodySmall text-ink">{audience}</Text>
          </View>
        </View>
        <View className="gap-6">
          <Caps>GOAL</Caps>
          <View className="rounded-12 bg-paper px-12 py-12">
            <Text className="font-regular text-bodySmall text-ink">{goal}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export const CRITIQUE_COST = 5;

/**
 * Figma: R7 · Tools · Fold and unfold (11125:41996) in Flow A · CH03 · Make and Flow B · CH03 · Make · Tools.
 * Prototype: hover a card → its MOVA · Hover preview. Critique toggles Critique · One focus only
 * (Change → R5 · Choose critique focus; Get feedback → R4 · Confirm critique, or Not enough credits under 5);
 * Use 5 credits → the critique is saved on this version as feedback pins and the tools fold.
 * Compare opens the comparison. Tutorials opens R5 · Tutorials · Tool & design. Guidelines opens Guidelines · On demand.
 */
export function MakePanel({
  version,
  balance,
  onCritique,
  onCompare,
  onGuidelines,
  onPlans,
}: {
  version: string;
  balance: number;
  onCritique: (focus: CritiqueFocus) => void;
  onCompare: () => void;
  onGuidelines: () => void;
  onPlans: () => void;
}) {
  const [hovered, setHovered] = useState<Tool | null>(null);
  const [request, setRequest] = useState(false);
  const [focus, setFocus] = useState<CritiqueFocus>('Main action');
  const [dialog, setDialog] = useState<'focus' | 'confirm' | 'short' | 'tutorials' | null>(null);

  function press(tool: Tool) {
    setHovered(null);
    if (tool === 'critique') return setRequest(!request);
    setRequest(false);
    if (tool === 'compare') return onCompare();
    setDialog('tutorials');
  }

  return (
    <View className="gap-16 rounded-24 border border-border bg-white p-24" style={toolsShadow}>
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-panelTitle text-ink">Tools</Text>
        <Button label="Guidelines" variant="paper" size="sm" onPress={onGuidelines} />
      </View>
      <View className="gap-12">
        {(['critique', 'compare', 'tutorials'] as const).map((tool) => (
          <MovaToolCard
            key={tool}
            tool={tool}
            onPress={() => press(tool)}
            onHover={(on) => setHovered((cur) => (on ? tool : cur === tool ? null : cur))}
          />
        ))}
        {request && (
          <CritiqueRequest
            version={version}
            focus={focus}
            cost={CRITIQUE_COST}
            onChange={() => setDialog('focus')}
            onGetFeedback={() => setDialog(balance >= CRITIQUE_COST ? 'confirm' : 'short')}
          />
        )}
      </View>
      {hovered && <ToolHoverPreview tool={hovered} />}

      <ChooseCritiqueFocus
        visible={dialog === 'focus'}
        onChoose={(f) => {
          setFocus(f);
          setDialog(null);
        }}
        onClose={() => setDialog(null)}
      />
      <ConfirmCritique
        visible={dialog === 'confirm'}
        cost={CRITIQUE_COST}
        balance={balance}
        onClose={() => setDialog(null)}
        onConfirm={() => {
          setDialog(null);
          setRequest(false);
          onCritique(focus);
        }}
      />
      <NotEnoughCredits
        visible={dialog === 'short'}
        cost={CRITIQUE_COST}
        balance={balance}
        onClose={() => setDialog(null)}
        onPlans={() => {
          setDialog(null);
          onPlans();
        }}
      />
      <TutorialsDialog visible={dialog === 'tutorials'} onClose={() => setDialog(null)} />
    </View>
  );
}

/** The café answers for each chosen version (Flow A · CH06 and R6 · Explain your choice · v1). */
export const CAFE_EXPLAIN: Record<number, { goal: string; evidence: string; tradeOff: string }> = {
  1: {
    goal: 'Both actions are easy to see at a glance.',
    evidence: 'Both buttons are filled the same way.',
    tradeOff: 'Pickup may not stand out as the first step.',
  },
  2: {
    goal: 'Pickup is the first thing students see.',
    evidence: 'Only “Order pickup” is a filled button.',
    tradeOff: 'The menu may be harder to find.',
  },
  3: {
    goal: 'Pickup is the first thing students see.',
    evidence: 'Only “Order pickup · 5 min” is a filled button.',
    tradeOff: 'The menu may be harder to find.',
  },
};

const GOAL_REASONS: Answer[] = [
  { title: 'Keep the route easy to choose', body: 'Connects the visual choice to a student ordering between classes.' },
  { title: 'Keep both actions understandable', body: 'Uses the clarity of the two labels as the reason.' },
];
const EVIDENCE: Answer[] = [
  { title: 'Compare the weight of the actions', body: 'Point to the fill and emphasis you can actually see.' },
  { title: 'Read the labels in context', body: 'Describe the two labels without claiming users understood them.' },
];
const TRADE_OFFS: Answer[] = [
  { title: 'Check what the hierarchy hides', body: 'Name the likely risk this direction creates.' },
  { title: 'Keep the conclusion provisional', body: 'Separate what you see from evidence about real use.' },
];

export type CafeAnswers = { goal: number | null; evidence: number | null; tradeOff: number | null };

/**
 * Figma: Flow A · CH06 · Explain choice · Incomplete → Complete (11125:42129, 42279), R6 · Explain your choice · v1.
 * Prototype: each answer opens its R4 · Dialog · Choose (Goal reason, Visible evidence, Trade-off);
 * the trade-off completes the decision. Decision tips → R6 · Decision guidance. Back to comparison → compare mode.
 */
export function ExplainPanel({
  chosen,
  answers,
  onAnswers,
  onBack,
  onTips,
}: {
  chosen: number;
  answers: CafeAnswers;
  onAnswers: (a: CafeAnswers) => void;
  onBack: () => void;
  onTips: () => void;
}) {
  const [asking, setAsking] = useState<keyof CafeAnswers | null>(null);
  const text = CAFE_EXPLAIN[chosen] ?? CAFE_EXPLAIN[2];
  const done = [answers.goal, answers.evidence, answers.tradeOff].filter((x) => x !== null).length;
  const rows: { key: keyof CafeAnswers; label: string; answer: string; empty: string }[] = [
    { key: 'goal', label: 'Goal fit', answer: text.goal, empty: 'Choose why it fits the goal' },
    { key: 'evidence', label: 'Visible evidence', answer: text.evidence, empty: 'Choose what supports it' },
    { key: 'tradeOff', label: 'Trade-off', answer: text.tradeOff, empty: 'Choose a risk you will check' },
  ];
  const dialogs = {
    goal: { title: 'Why does it fit the goal?', description: 'Pick a reason. It stays a draft until the whole decision is saved.', options: GOAL_REASONS },
    evidence: {
      title: 'What supports your choice?',
      description: 'Use something you can point to on the screen. An observation is not a usability result.',
      options: EVIDENCE,
    },
    tradeOff: {
      title: 'What could become harder?',
      description: 'A trade-off is a risk to check. You can prefer either direction and still reason well.',
      options: TRADE_OFFS,
    },
  };
  return (
    <View className={surface} style={cardShadow}>
      <Pressable accessibilityRole="link" onPress={onBack} className="flex-row items-center gap-6 self-start">
        <Icon name="arrowLeft" size={size.iconXs} />
        <Text className="font-medium text-labelSmall text-secondaryText">Back to comparison</Text>
      </Pressable>
      <Text className="font-bold text-heading text-ink">Explain your choice</Text>
      <View className="gap-8">
        <View className="flex-row justify-between">
          <Text className="font-medium text-labelSmall text-ink">{done} of 3 done</Text>
          <Text className="font-medium text-labelSmall text-secondaryText">{done === 3 ? 'Ready to save' : 'Trade-off missing'}</Text>
        </View>
        <View className="flex-row gap-4">
          {[0, 1, 2].map((i) => (
            <View key={i} className={`h-segment flex-1 rounded-pill ${i < done ? 'bg-ink' : 'bg-border'}`} />
          ))}
        </View>
      </View>
      {rows.map((r, i) => {
        const has = answers[r.key] !== null;
        return (
          <View key={r.key} className="gap-8">
            <Numbered n={i + 1} label={r.label} />
            <Pressable
              accessibilityRole="button"
              onPress={() => setAsking(r.key)}
              className={`flex-row items-center gap-12 rounded-10 px-16 py-12 ${
                has ? 'border-dash border-ink bg-paper' : 'border border-dashed border-secondaryText'
              }`}
            >
              {has && <Radio />}
              <Text className={has ? 'flex-1 font-medium text-labelUi text-ink' : 'flex-1 font-regular text-bodyUi text-secondaryText'}>
                {has ? r.answer : r.empty}
              </Text>
              {!has && <Icon name="chevronDown" />}
            </Pressable>
          </View>
        );
      })}
      <Button label="Decision tips" variant="quiet" size="sm" onPress={onTips} />
      <View className="border-t border-border" />
      <View className="flex-row items-center gap-6">
        <Icon name="helpSmall" />
        <Text className="font-regular text-bodySmall text-secondaryText">
          {done === 3 ? 'Saving is free. Find this in your critique notes.' : 'Add a trade-off to save · free'}
        </Text>
      </View>
      {asking && (
        <ChooseAnswer
          visible
          title={dialogs[asking].title}
          description={dialogs[asking].description}
          options={dialogs[asking].options}
          value={answers[asking]}
          onClose={() => setAsking(null)}
          onUse={(i) => {
            onAnswers({ ...answers, [asking]: i });
            setAsking(null);
          }}
        />
      )}
    </View>
  );
}

export type OwnDecision = { reason: string; evidence: string | null; tradeOff: string | null; saved: boolean };

// Figma writes these for Kiln studio ("Booking is easier for a first-time visitor to find.").
// The same three starters, worded so they fit any project the designer brings.
const GOAL_STARTERS = [
  'The main action is easier for a first-time visitor to find.',
  'The options are easier for a first-time visitor to scan.',
  'I am not sure yet; I need to check this with someone I am designing for.',
];
const EVIDENCE_STARTERS = [
  'The main action has more visual emphasis.',
  'The introduction and main action lead the layout.',
  'The largest image leads the page.',
];
const TRADE_OFF_STARTERS = [
  'Exploring the other options may feel secondary.',
  'The main action may take longer to find.',
  'Smaller details may receive less attention.',
];

/**
 * Figma: R11 · Compare and explain → Context panel · Expanded "Explain your choice" (11125:44606).
 * Your reason is free-form; Optional reasoning prompts → Own project · Goal fit; visible evidence and trade-off are
 * optional (Own project · Visible evidence / Trade-off). Save decision → Decision saved → Next: Revise.
 */
export function ExplainYourChoice({
  decision,
  onDecision,
  onFold,
  onNext,
}: {
  decision: OwnDecision;
  onDecision: (d: OwnDecision) => void;
  onFold: () => void;
  onNext: () => void;
}) {
  const [asking, setAsking] = useState<'goal' | 'evidence' | 'tradeOff' | null>(null);
  const set = (patch: Partial<OwnDecision>) => onDecision({ ...decision, ...patch, saved: false });
  const starters = {
    goal: { title: 'Optional starters', description: 'Use a starting idea, change it, or write something different in your reason.', options: GOAL_STARTERS },
    evidence: { title: 'Visible evidence', description: 'What on the page supports that choice?', options: EVIDENCE_STARTERS },
    tradeOff: { title: 'Trade-off', description: 'What could become less effective with this choice?', options: TRADE_OFF_STARTERS },
  };
  const optional = (key: 'evidence' | 'tradeOff', label: string, empty: string) => (
    <View className="gap-6">
      <Text className="font-medium text-labelUi text-ink">{label}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setAsking(key)}
        className="flex-row items-center gap-12 rounded-12 border border-border bg-white px-12 py-14"
      >
        <Text className={`flex-1 text-bodyUi ${decision[key] ? 'font-medium text-ink' : 'font-regular text-secondaryText'}`}>
          {decision[key] ?? empty}
        </Text>
        <Icon name="chevronDown" />
      </Pressable>
    </View>
  );
  return (
    <View className={surface} style={cardShadow}>
      <View className="flex-row items-center justify-between">
        <Text className="font-bold text-heading text-ink">Explain your choice</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fold decision panel"
          onPress={onFold}
          className="h-collapse w-collapse items-center justify-center rounded-pill border border-border bg-white"
        >
          <Icon name="arrowRight" size={size.icon} />
        </Pressable>
      </View>
      <Text className="font-regular text-bodySmall text-secondaryText">
        Explain why you would keep this direction. Your own words matter most.
      </Text>
      <View className="gap-6">
        <Text className="font-medium text-labelUi text-ink">Your reason</Text>
        <TextInput
          multiline
          value={decision.reason}
          onChangeText={(reason) => set({ reason })}
          placeholder="Write your reason…"
          placeholderTextColor={color.secondaryText}
          className="min-h-fieldMinHeight rounded-12 border border-secondaryText px-14 py-12 font-regular text-bodyUi text-ink"
          style={{ outlineStyle: 'none', textAlignVertical: 'top' } as never}
        />
        <View className="self-start">
          <Button label="Optional reasoning prompts" variant="ash" size="sm" onPress={() => setAsking('goal')} />
        </View>
      </View>
      {optional('evidence', 'Visible evidence · optional', 'Add an observation or point to the work…')}
      {optional('tradeOff', 'Possible trade-off · optional', 'What might this choice make less effective?')}
      {decision.saved ? (
        <View className="gap-12">
          <View className="flex-row items-center gap-8">
            <Icon name="checkSmall" />
            <Text className="font-medium text-labelUi text-ink">Decision saved</Text>
          </View>
          <Button label="Next: Revise" size="md" full arrow onPress={onNext} />
        </View>
      ) : (
        <Button
          label="Save decision"
          size="md"
          full
          disabled={!decision.reason.trim()}
          onPress={() => onDecision({ ...decision, saved: true })}
        />
      )}
      {asking && (
        <StarterChoices
          visible
          title={starters[asking].title}
          description={starters[asking].description}
          options={starters[asking].options}
          onClose={() => setAsking(null)}
          onChoose={(text) => {
            if (asking === 'goal') set({ reason: text });
            else set({ [asking]: text });
            setAsking(null);
          }}
        />
      )}
    </View>
  );
}

export type RevisionFile = { name: string; meta: string };

/**
 * Figma: Flow A · CH07 · Revise & save (11125:42426) and Flow B · CH07 · Revise · Awaiting update → Update ready.
 * Prototype: Open source file → R4 · Edit source (café) / Source guidance → B / C · Edit source guidance (own work);
 * Add file / Replace → add the updated screenshot; Revision tips → R6 · Revision guidance;
 * Why this version? → R6 · Saved decision. Next: Reflect saves the revision.
 */
export function RevisePanel({
  example,
  starting,
  lead,
  file,
  onSource,
  onUpload,
  onTips,
  onWhy,
}: {
  example: boolean;
  starting: string;
  lead: string;
  file: RevisionFile | null;
  onSource: () => void;
  onUpload: () => void;
  onTips: () => void;
  onWhy: () => void;
}) {
  const [note, setNote] = useState(
    example ? 'Pickup stays filled. Menu is now an outlined button so it is easier to find.' : '',
  );
  return (
    <View className={surface} style={cardShadow}>
      <Motion name="revise" width={size.motionRevise} style={{ position: 'absolute', right: space[14], top: 0 }} />
      <View className="gap-10">
        <Text className="font-bold text-heading text-ink">Revise one thing</Text>
        <Text className="font-regular text-bodyUi text-secondaryText">{lead}</Text>
      </View>
      <View className="flex-row items-center gap-12">
        <Caps>STARTING VERSION</Caps>
        <Text className="font-medium text-labelUi text-ink">{starting}</Text>
      </View>
      <View className="gap-12">
        <Numbered n={1} label="Edit source" />
        <View className="self-start">
          <Button label={example ? 'Open source file' : 'Source guidance'} variant="secondary" size="sm" leading="edit" onPress={onSource} />
        </View>
      </View>
      <View className="gap-12">
        <Numbered n={2} label="Upload revision" />
        <Pressable
          accessibilityRole="button"
          onPress={onUpload}
          className="flex-row items-center gap-12 rounded-10 bg-paper px-12 py-10"
        >
          <View className="h-fileIcon w-fileIcon items-center justify-center rounded-6 bg-border">
            <Icon name="image" size={size.iconXs} />
          </View>
          <View className="flex-1 gap-2">
            <Text className="font-medium text-labelSmall text-ink">{file ? file.name : 'No update added yet'}</Text>
            <Text className="font-regular text-bodySmall text-secondaryText">{file ? file.meta : 'PNG or JPG'}</Text>
          </View>
          <Text className="font-medium text-labelSmall text-secondaryText">{file ? 'Replace' : 'Add file'}</Text>
        </Pressable>
      </View>
      <View className="gap-12">
        <Numbered n={3} label="Note the change" />
        <TextInput
          multiline
          value={note}
          onChangeText={setNote}
          editable={!!file}
          placeholder={file ? 'What did you change?' : 'Upload a revision first.'}
          placeholderTextColor={color.secondaryText}
          className="min-h-control rounded-12 border border-secondaryText px-14 py-10 font-regular text-bodyUi text-ink"
          style={{ outlineStyle: 'none' } as never}
        />
      </View>
      <View className="flex-row gap-12">
        <View className="flex-1">
          <Button label="Revision tips" variant="ash" size="sm" full onPress={onTips} />
        </View>
        <View className="flex-1">
          <Button label="Why this version?" variant="ash" size="sm" full onPress={onWhy} />
        </View>
      </View>
    </View>
  );
}

const TAKEAWAYS: Answer[] = [
  { title: 'Hierarchy needs a findable alternative', body: 'Make the main action prominent, then check the second stays easy to find.' },
  { title: 'Test before generalising', body: 'Watch where students click before treating emphasis as proof.' },
  { title: 'I need more evidence', body: 'No conclusion yet. I need to observe students first.' },
];

/**
 * Figma: Flow A · CH08 · Reflect & continue (11125:42599) and Flow B · CH08 · Reflect · v2 revised (11125:45090).
 * Prototype: What will you carry forward? → R4 · Dialog · Choose · Takeaway; Open crit notes → R6 · Saved record;
 * Back to workspace → Make; Finish → My projects.
 */
export function ReflectPanel({
  example,
  takeaway,
  onTakeaway,
  onNotes,
  onBack,
  onFinish,
}: {
  example: boolean;
  takeaway: string | null;
  onTakeaway: (t: string) => void;
  onNotes: () => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [choosing, setChoosing] = useState(false);
  const [changed, setChanged] = useState('');
  const [next, setNext] = useState('');
  const field = (label: string, value: string, onChange: (v: string) => void, placeholder: string) => (
    <View className="gap-6">
      <Caps>{label}</Caps>
      <TextInput
        multiline
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={color.secondaryText}
        className="min-h-control rounded-12 bg-paper px-14 py-10 font-regular text-bodyUi text-ink"
        style={{ outlineStyle: 'none' } as never}
      />
    </View>
  );
  return (
    <View>
      <Motion
        name="reflect"
        width={size.motionReflect}
        style={{ position: 'absolute', left: size.reflectMotionLeft, top: size.reflectMotionTop, zIndex: 1 }}
      />
      <View className={`gap-10 ${card}`} style={cardShadow}>
        <Text className="font-bold text-heading text-ink">What I learned</Text>
        {!example && field('WHAT CHANGED?', changed, setChanged, 'Name the one thing you changed.')}
        <View className="gap-8">
          <Text className="font-medium text-labelUi text-ink">What will you carry forward?</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setChoosing(true)}
            className="min-h-control justify-center rounded-12 border border-secondaryText px-14 py-10"
          >
            <Text className={`text-bodyUi ${takeaway ? 'font-regular text-ink' : 'font-regular text-secondaryText'}`}>
              {takeaway ?? 'Choose a lesson, or say you are not ready to conclude yet.'}
            </Text>
          </Pressable>
        </View>
        {!example && field('NEXT CHECK', next, setNext, 'What will you check next, and with whom?')}
        <Button label="Open crit notes" variant="quiet" size="sm" onPress={onNotes} />
        <View className="border-t border-border" />
        <Button label="Back to workspace" variant="quiet" size="md" onPress={onBack} />
        <Pressable accessibilityRole="link" onPress={onFinish} className="flex-row items-center gap-6">
          <Icon name="arrowLeft" size={size.iconXs} />
          <Text className="font-regular text-bodySmall text-secondaryText">Finish returns to My projects</Text>
        </Pressable>
      </View>
      <ChooseAnswer
        visible={choosing}
        title="What will you carry forward?"
        description="Choose a lesson, or say you are not ready to conclude yet."
        options={TAKEAWAYS}
        value={Math.max(0, TAKEAWAYS.findIndex((t) => t.body === takeaway))}
        onClose={() => setChoosing(false)}
        onUse={(i) => {
          onTakeaway(TAKEAWAYS[i].body);
          setChoosing(false);
        }}
      />
    </View>
  );
}
