import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';
import { ChooseCritiqueFocus, type CritiqueFocus } from '@/components/ChooseCritiqueFocus';
import { ConfirmCritique } from '@/components/ConfirmCritique';
import { CritiqueRequest } from '@/components/CritiqueRequest';
import { Icon } from '@/components/Icon';
import { MovaToolCard, type Tool } from '@/components/MovaToolCard';
import { ToolHoverPreview } from '@/components/ToolHoverPreview';
import { TutorialsDialog } from '@/components/TutorialsDialog';
import { asset, cardShadow, toolsShadow } from '@/lib/ui';
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

/** The nav shows the same balance (AppNav "368 credits"). */
const BALANCE = 368;
const CRITIQUE_COST = 5;

/**
 * Figma: R7 · Tools · Fold and unfold (11125:41996) in Flow A · CH03 · Make.
 * Prototype: hover a card → its MOVA · Hover preview; Critique toggles Critique · One focus only;
 * Compare opens the comparison; Tutorials opens R5 · Tutorials · Tool & design.
 */
export function MakePanel({ version, onCritique, onCompare }: { version: string; onCritique: () => void; onCompare: () => void }) {
  const [hovered, setHovered] = useState<Tool | null>(null);
  const [request, setRequest] = useState(false);
  const [focus, setFocus] = useState<CritiqueFocus>('Main action');
  const [dialog, setDialog] = useState<'focus' | 'confirm' | 'tutorials' | null>(null);

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
        <Button label="Guidelines" variant="paper" size="sm" />
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
            onGetFeedback={() => setDialog('confirm')}
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
        balance={BALANCE}
        onClose={() => setDialog(null)}
        onConfirm={() => {
          setDialog(null);
          onCritique();
        }}
      />
      <TutorialsDialog visible={dialog === 'tutorials'} onClose={() => setDialog(null)} />
    </View>
  );
}

const risks = ['The menu could be harder to find', 'Two dark buttons would compete', 'Students may miss the hours'];

/** Figma: CH03 · Explain your choice (incomplete → complete). */
export function ExplainPanel({
  tradeOff,
  onTradeOff,
  onBack,
}: {
  tradeOff: string | null;
  onTradeOff: (r: string) => void;
  onBack: () => void;
}) {
  const [open, setOpen] = useState(false);
  const done = tradeOff ? 3 : 2;
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
          <Text className="font-regular text-meta text-secondaryText">{tradeOff ? 'Ready to save' : 'Trade-off missing'}</Text>
        </View>
        <View className="flex-row gap-4">
          {[0, 1, 2].map((i) => (
            <View key={i} className={`h-segment flex-1 rounded-pill ${i < done ? 'bg-ink' : 'bg-border'}`} />
          ))}
        </View>
      </View>
      {[
        ['Goal fit', 'Pickup is the first thing students see.'],
        ['Visible evidence', 'Only “Order pickup” is a filled button.'],
      ].map(([label, answer], i) => (
        <View key={label} className="gap-8">
          <Numbered n={i + 1} label={label} />
          <View className="min-h-control flex-row items-center gap-12 rounded-10 border-dash border-ink px-12">
            <View className="h-radioOuter w-radioOuter items-center justify-center rounded-pill border-focus border-ink">
              <View className="h-radioInner w-radioInner rounded-pill bg-ink" />
            </View>
            <Text className="font-medium text-labelUi text-ink">{answer}</Text>
          </View>
        </View>
      ))}
      <View className="gap-8">
        <Numbered n={3} label="Trade-off" />
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpen(!open)}
          className={`min-h-control flex-row items-center justify-between rounded-10 px-12 ${
            tradeOff ? 'border-dash border-ink' : 'border border-dashed border-secondaryText'
          }`}
        >
          <Text className={tradeOff ? 'font-medium text-labelUi text-ink' : 'font-regular text-labelUi text-secondaryText'}>
            {tradeOff ?? 'Choose a risk you will check'}
          </Text>
          <Icon name="chevronDown" />
        </Pressable>
        {open && (
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
      <Button label="Decision tips" variant="quiet" size="sm" />
      <View className="border-t border-border" />
      <View className="flex-row items-center gap-6">
        <Icon name="helpSmall" />
        <Text className="font-regular text-labelSmall text-secondaryText">
          {tradeOff ? 'Saved with your choice · free' : 'Add a trade-off to save · free'}
        </Text>
      </View>
    </View>
  );
}

/** Figma: CH04 · Revise one thing. */
export function RevisePanel() {
  const [note, setNote] = useState(
    'Pickup stays filled. Menu is now an outlined button so it is easier to find.',
  );
  return (
    <View className={surface} style={cardShadow}>
      <View className="gap-6 pr-64">
        <Text className="font-bold text-heading text-ink">Revise one thing</Text>
        <Text className="font-regular text-labelUi text-secondaryText">Keep pickup strong and make the menu easier to find.</Text>
        <Image
          source={asset.motionRevise}
          style={{ position: 'absolute', right: -space[8], top: -space[8], width: size.motionRevise, height: size.motionReviseHeight }}
        />
      </View>
      <View className="flex-row items-center gap-10">
        <Caps>STARTING VERSION</Caps>
        <Text className="font-semibold text-labelUi text-ink">v2 · Current</Text>
      </View>
      <View className="gap-8">
        <Numbered n={1} label="Edit source" />
        <View className="self-start">
          <Button label="Open source file" variant="white" size="sm" leading="edit" />
        </View>
      </View>
      <View className="gap-8">
        <Numbered n={2} label="Upload revision" />
        <View className="flex-row items-center gap-12 rounded-10 bg-paper p-12">
          <View className="h-fileIcon w-fileIcon rounded-6 bg-border" />
          <View className="flex-1">
            <Text className="font-medium text-labelSmall text-ink">cafe-revision.png</Text>
            <Text className="font-regular text-meta text-secondaryText">PNG · 1.2 MB</Text>
          </View>
          <Text className="font-medium text-meta text-secondaryText">Replace</Text>
        </View>
      </View>
      <View className="gap-8">
        <Numbered n={3} label="Note the change" />
        <TextInput
          multiline
          value={note}
          onChangeText={setNote}
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
export function ReflectPanel({ onBack, onFinish }: { onBack: () => void; onFinish: () => void }) {
  const [lesson, setLesson] = useState(
    'Give one action the most contrast; make the second one quieter, not hidden.',
  );
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
            onChangeText={setLesson}
            className="min-h-control rounded-12 border border-secondaryText px-12 py-10 font-regular text-labelUi text-ink"
            style={{ outlineStyle: 'none' } as never}
          />
        </View>
        <Button label="Open crit notes" variant="quiet" size="sm" />
        <View className="border-t border-border" />
        <Button label="Back to workspace" variant="quiet" size="sm" onPress={onBack} />
        <Pressable accessibilityRole="link" onPress={onFinish} className="flex-row items-center gap-6">
          <Icon name="arrowLeft" size={size.iconXs} />
          <Text className="font-regular text-labelSmall text-secondaryText">Finish returns to My projects</Text>
        </Pressable>
      </View>
    </View>
  );
}
