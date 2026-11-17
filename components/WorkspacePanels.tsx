import { Image } from 'expo-image';
import { useState, type ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { asset, cardShadow } from '@/lib/ui';
import { color, size, space } from '@/tokens';

const surface = 'gap-16 rounded-24 border border-border bg-white p-16';

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

function Caps({ children }: { children: string }) {
  return <Text className="font-medium text-meta text-secondaryText">{children}</Text>;
}

/** Figma: CH02 · Brief panel — "The café brief". */
export function BriefPanel({ title, audience, goal }: { title: string; audience: string; goal: string }) {
  return (
    <View>
      <Image
        source={asset.peekMateGoal}
        style={{
          position: 'absolute',
          left: size.peekGoalLeft,
          top: -size.peekMateGoalHeight,
          width: size.peekMateGoal,
          height: size.peekMateGoalHeight,
        }}
      />
      <View className={`${surface} pb-40`} style={cardShadow}>
        <Text className="font-bold text-briefTitle text-ink">{title}</Text>
        <View className="gap-8">
          <Caps>AUDIENCE</Caps>
          <View className="rounded-10 bg-paper px-12 py-10">
            <Text className="font-regular text-bodySmall text-ink">{audience}</Text>
          </View>
        </View>
        <View className="gap-8">
          <Caps>GOAL</Caps>
          <View className="rounded-10 bg-paper px-12 py-10">
            <Text className="font-regular text-bodySmall text-ink">{goal}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const tools = [
  { name: 'Critique', intro: 'Find what to improve.', meta: '5 credits / new run', bg: 'bg-critique', edge: asset.edgeCritique },
  { name: 'Compare', intro: 'View versions side by side.', meta: 'Manual comparison · Free', bg: 'bg-compare', edge: asset.edgeCompare },
  { name: 'Tutorials', intro: 'Learn a tool or principle.', meta: 'Short guides · Free', bg: 'bg-guidance', edge: asset.edgeTutorials },
] as const;

/** Figma: CH03 · Make — R7 Tools (MOVA tool cards). */
export type WorkspaceTool = 'Critique' | 'Compare' | 'Tutorials' | 'Guidelines';

export function MakePanel({
  confirmation,
  critiqueMeta,
  onTool,
}: {
  confirmation?: ReactNode;
  critiqueMeta?: string;
  onTool: (name: WorkspaceTool) => void;
}) {
  return (
    <View className="gap-16 rounded-24 border border-border bg-white p-24" style={cardShadow}>
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-cardTitle text-ink">Tools</Text>
        <Button label="Guidelines" variant="quiet" size="sm" onPress={() => onTool('Guidelines')} />
      </View>
      <View className="gap-12">
        {tools.map((t) => (
          <Pressable
            key={t.name}
            accessibilityRole="button"
            onPress={() => onTool(t.name)}
            className={`w-toolCard h-toolCardHeight justify-center gap-4 overflow-hidden rounded-22 px-16 ${t.bg}`}
          >
            <Text className="font-bold text-toolTitle text-ink">{t.name}</Text>
            <Text className="font-regular text-labelSmall text-ink">{t.intro}</Text>
            <Text className="font-bold text-meta text-ink">{t.name === 'Critique' ? critiqueMeta ?? t.meta : t.meta}</Text>
            <Image
              source={t.edge}
              style={{ position: 'absolute', right: 0, top: 0, width: size.toolEdge, height: size.toolCardHeight }}
              contentFit="contain"
            />
          </Pressable>
        ))}
      </View>
      {confirmation}
    </View>
  );
}

const risks = ['The menu could be harder to find', 'Two dark buttons would compete', 'Students may miss the hours'];

/** Figma: CH03 · Explain your choice (incomplete → complete). */
export function ExplainPanel({
  example,
  goalFit,
  evidence,
  tradeOff,
  onGoalFit,
  onEvidence,
  onTradeOff,
  onBack,
  onSave,
  saving,
  saved,
}: {
  example: boolean;
  goalFit: string;
  evidence: string;
  tradeOff: string;
  onGoalFit: (value: string) => void;
  onEvidence: (value: string) => void;
  onTradeOff: (r: string) => void;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
}) {
  const [open, setOpen] = useState(false);
  const done = [goalFit, evidence, tradeOff].filter((answer) => answer.trim()).length;
  return (
    <View className={surface} style={cardShadow}>
      <Pressable accessibilityRole="link" onPress={onBack} className="flex-row items-center gap-6 self-start">
        <Icon name="arrowLeft" size={size.iconXs} />
        <Text className="font-regular text-labelSmall text-secondaryText">Back to comparison</Text>
      </Pressable>
      <Text className="font-bold text-heading text-ink">Explain your choice</Text>
      <View className="gap-8">
        <View className="flex-row justify-between">
          <Text className="font-medium text-meta text-ink">{done} of 3 done</Text>
          <Text className="font-regular text-meta text-secondaryText">{done === 3 ? 'Ready to save' : 'Add your reasoning'}</Text>
        </View>
        <View className="flex-row gap-4">
          {[0, 1, 2].map((i) => (
            <View key={i} className={`h-segment flex-1 rounded-pill ${i < done ? 'bg-ink' : 'bg-border'}`} />
          ))}
        </View>
      </View>
      {([
        ['Goal fit', goalFit, onGoalFit],
        ['Visible evidence', evidence, onEvidence],
      ] as const).map(([label, answer, change], i) => (
        <View key={label} className="gap-8">
          <Numbered n={i + 1} label={label} />
          <TextInput accessibilityLabel={label} value={answer} onChangeText={change}
            className="min-h-control rounded-10 border border-border px-12 font-regular text-labelUi text-ink" />
        </View>
      ))}
      <View className="gap-8">
        <Numbered n={3} label="Trade-off" />
        {example ? <Pressable
          accessibilityRole="button"
          onPress={() => setOpen(!open)}
          className={`min-h-control flex-row items-center justify-between rounded-10 px-12 ${
            tradeOff ? 'border-dash border-ink' : 'border border-dashed border-secondaryText'
          }`}
        >
          <Text className={tradeOff ? 'font-medium text-labelUi text-ink' : 'font-regular text-labelUi text-secondaryText'}>
            {tradeOff || 'Choose a risk you will check'}
          </Text>
          <Icon name="chevronDown" />
        </Pressable> : <TextInput accessibilityLabel="Trade-off" value={tradeOff} onChangeText={onTradeOff}
          placeholder="What will you check next?"
          className="min-h-control rounded-10 border border-border px-12 font-regular text-labelUi text-ink" />}
        {example && open && (
          <View className="overflow-hidden rounded-10 border border-border bg-white">
            {risks.map((r) => (
              <Pressable
                key={r}
                accessibilityRole="menuitem"
                onPress={() => {
                  onTradeOff(r);
                  setOpen(false);
                }}
                className={`px-12 py-10 ${tradeOff === r ? 'bg-paper' : ''}`}
              >
                <Text className="font-regular text-labelUi text-ink">{r}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <Button label="Save choice" size="sm" disabled={done !== 3 || saved} busy={saving} onPress={onSave} />
      <View className="border-t border-border" />
      <View className="flex-row items-center gap-6">
        <Icon name="helpSmall" />
        <Text className="font-regular text-labelSmall text-secondaryText">
          {saved ? 'Saved with your choice · free' : 'Saving your choice is free'}
        </Text>
      </View>
    </View>
  );
}

/** Figma: CH04 · Revise one thing. */
export function RevisePanel({
  note, onNote, example, version, upload,
}: {
  note: string;
  onNote: (value: string) => void;
  example: boolean;
  version: number | null;
  upload?: ReactNode;
}) {
  return (
    <View className={surface} style={cardShadow}>
      <View className="gap-6 pr-64">
        <Text className="font-bold text-heading text-ink">Revise one thing</Text>
        <Text className="font-regular text-labelUi text-secondaryText">
          {example ? 'Keep pickup strong and make the menu easier to find.' : 'Make one change that supports your goal.'}
        </Text>
        <Image
          source={asset.motionRevise}
          style={{ position: 'absolute', right: -space[8], top: -space[8], width: size.motionRevise, height: size.motionReviseHeight }}
        />
      </View>
      <View className="flex-row items-center gap-10">
        <Caps>STARTING VERSION</Caps>
        <Text className="font-semibold text-labelUi text-ink">{version ? `Version ${version}` : 'No version yet'}</Text>
      </View>
      <View className="gap-8">
        <Numbered n={1} label="Edit source" />
        <View className="self-start">
          <Button label="Open source file" variant="white" size="sm" leading="edit" />
        </View>
      </View>
      <View className="gap-8">
        <Numbered n={2} label="Upload revision" />
        {example ? <View className="flex-row items-center gap-12 rounded-10 bg-paper p-12">
          <View className="h-fileIcon w-fileIcon rounded-6 bg-border" />
          <View className="flex-1">
            <Text className="font-medium text-labelSmall text-ink">cafe-revision.png</Text>
            <Text className="font-regular text-meta text-secondaryText">PNG · 1.2 MB</Text>
          </View>
          <Text className="font-medium text-meta text-secondaryText">Replace</Text>
        </View> : upload}
      </View>
      <View className="gap-8">
        <Numbered n={3} label="Note the change" />
        <TextInput
          multiline
          value={note}
          onChangeText={onNote}
          accessibilityLabel="Note the change"
          placeholderTextColor={color.secondaryText}
          className="min-h-control rounded-12 border border-secondaryText px-12 py-10 font-regular text-labelUi text-ink"
          style={{ outlineStyle: 'none' } as never}
        />
      </View>
      <View className="flex-row gap-8">
        <View className="flex-1">
          <Button label="Revision tips" variant="white" size="sm" full />
        </View>
        <View className="flex-1">
          <Button label="Why this version?" variant="white" size="sm" full />
        </View>
      </View>
    </View>
  );
}

/** Figma: CH05 · Reflect — Keep one useful lesson. */
export function ReflectPanel({
  lesson, onLesson, onBack, onFinish, saving,
}: {
  lesson: string;
  onLesson: (value: string) => void;
  onBack: () => void;
  onFinish: () => void;
  saving: boolean;
}) {
  return (
    <View>
      <Image
        source={asset.motionReflect}
        style={{
          position: 'absolute',
          right: space[64],
          top: -size.motionReflectHeight + space[28],
          width: size.motionReflect,
          height: size.motionReflectHeight,
          zIndex: 1,
        }}
      />
      <View className={surface} style={cardShadow}>
        <Text className="font-bold text-heading text-ink">Keep one useful lesson</Text>
        <View className="gap-8">
          <Text className="font-medium text-labelUi text-ink">What will you carry forward?</Text>
          <TextInput
            multiline
            value={lesson}
            onChangeText={onLesson}
            accessibilityLabel="What will you carry forward?"
            className="min-h-control rounded-12 border border-secondaryText px-12 py-10 font-regular text-labelUi text-ink"
            style={{ outlineStyle: 'none' } as never}
          />
        </View>
        <Button label="Open crit notes" variant="quiet" size="sm" />
        <View className="border-t border-border" />
        <Button label="Back to workspace" variant="quiet" size="sm" onPress={onBack} />
        <Button label="Save and finish" variant="white" size="sm" busy={saving} onPress={onFinish} />
      </View>
    </View>
  );
}
