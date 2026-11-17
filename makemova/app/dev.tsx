import type { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Breadcrumb } from '@/components/Breadcrumb';
import { DecisionPanel } from '@/components/DecisionPanel';
import { FeedbackNote, type FeedbackNoteState } from '@/components/FeedbackNote';
import { FocusChoice } from '@/components/FocusChoice';
import { LearningPath, type LearningPathStage } from '@/components/LearningPath';
import { NavigationItem, type NavigationItemState } from '@/components/NavigationItem';
import { PillAction, type PillActionState, type PillActionType } from '@/components/PillAction';
import { ScreenshotUpload, type ScreenshotUploadState } from '@/components/ScreenshotUpload';
import { StatusNotice, type StatusNoticeState } from '@/components/StatusNotice';
import { TextField, type TextFieldState } from '@/components/TextField';

/**
 * Dev screen: every component in every state, labeled.
 * Never ships, never leaves. Compare it side by side with the Week 8 Figma page.
 * States come from docs/state-matrix.md.
 */

function Section({ name, children }: { name: string; children: ReactNode }) {
  return (
    <View className="gap-16 border-t border-borderDefault pt-24">
      <Text className="font-bold text-panel text-ink">{name}</Text>
      {children}
    </View>
  );
}

function Case({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-8">
      <Text className="font-bold text-small uppercase text-secondaryText">{label}</Text>
      {children}
    </View>
  );
}

const pillTypes: PillActionType[] = ['primary', 'secondary'];
const pillStates: PillActionState[] = ['default', 'hover', 'disabled'];
const fieldStates: TextFieldState[] = ['default', 'focused', 'filled', 'error', 'disabled', 'readOnly'];
const uploadStates: ScreenshotUploadState[] = ['empty', 'dragOver', 'uploading', 'attached', 'error'];
const stages: LearningPathStage[] = ['brief', 'make', 'revise', 'reflect'];
const noteStates: FeedbackNoteState[] = ['default', 'selected', 'resolved'];
const noticeStates: StatusNoticeState[] = ['saved', 'running', 'error', 'insufficientCredits'];
const navStates: NavigationItemState[] = ['default', 'hover', 'selected'];

const fieldValue: Record<TextFieldState, string> = {
  default: '',
  focused: 'Pickup reads first…',
  filled: 'Pickup reads first, which fits a student in a hurry.',
  error: '',
  disabled: '',
  readOnly: 'Pickup reads first, which fits a student in a hurry.',
};
const fieldHelper: Record<TextFieldState, string> = {
  default: 'Your own words. Evidence and trade-offs are optional.',
  focused: 'Your own words. Evidence and trade-offs are optional.',
  filled: 'Your own words. Evidence and trade-offs are optional.',
  error: '',
  disabled: 'Choose a direction to start.',
  readOnly: 'Saved with v2. Choose Edit to change it.',
};

export default function Dev() {
  return (
    <SafeAreaView className="flex-1 bg-paper">
      <ScrollView contentContainerClassName="gap-32 p-24 pb-64">
        <View className="gap-8">
          <Text className="font-bold text-title text-ink">Dev · components</Text>
          <Text className="font-regular text-body text-secondaryText">
            Every component in every state. Side by side with Figma, every difference is a bug in one of them.
          </Text>
        </View>

        <Section name="Pill action">
          {pillTypes.map((t) =>
            pillStates.map((s) => (
              <Case key={t + s} label={`type=${t} · state=${s}`}>
                <View className="flex-row">
                  <PillAction label="Get feedback" type={t} state={s} />
                </View>
              </Case>
            )),
          )}
        </Section>

        <Section name="Focus choice">
          <Case label="state=default">
            <FocusChoice label="Main action" state="default" />
          </Case>
          <Case label="state=selected">
            <FocusChoice label="Main action" state="selected" />
          </Case>
        </Section>

        <Section name="Text field">
          {fieldStates.map((s) => (
            <Case key={s} label={`state=${s}`}>
              <TextField
                label="Your reason"
                state={s}
                value={fieldValue[s]}
                placeholder="Why does this direction fit the goal?"
                helper={fieldHelper[s]}
                errorText="Add your reason to save the decision."
              />
            </Case>
          ))}
        </Section>

        <Section name="Screenshot upload">
          {uploadStates.map((s) => (
            <Case key={s} label={`state=${s}`}>
              <ScreenshotUpload state={s} />
            </Case>
          ))}
        </Section>

        <Section name="Learning path">
          {stages.map((s) => (
            <Case key={s} label={`stage=${s}`}>
              <LearningPath stage={s} />
            </Case>
          ))}
        </Section>

        <Section name="Feedback note">
          {noteStates.map((s) => (
            <Case key={s} label={`state=${s}`}>
              <FeedbackNote
                state={s}
                title="Let pickup lead."
                observation="Both actions have similar weight, so the first step is harder to see."
                next={s === 'resolved' ? 'Pickup stays filled. Menu is outlined.' : 'Give “Order pickup” the strongest contrast.'}
              />
            </Case>
          ))}
        </Section>

        <Section name="Status notice">
          {noticeStates.map((s) => (
            <Case key={s} label={`state=${s}`}>
              <StatusNotice state={s} />
            </Case>
          ))}
        </Section>

        <Section name="Navigation item">
          {navStates.map((s) => (
            <Case key={s} label={`state=${s}`}>
              <NavigationItem label="My projects" state={s} />
            </Case>
          ))}
        </Section>

        <Section name="Breadcrumb">
          <Case label="depth=two">
            <Breadcrumb root="My projects" project="Campus café" depth="two" />
          </Case>
          <Case label="depth=three">
            <Breadcrumb root="My projects" project="Campus café" stage="Make" depth="three" />
          </Case>
        </Section>

        <Section name="Decision panel">
          <Case label="state=empty">
            <DecisionPanel state="empty" goal="Make the pickup action easy to find." reason="" />
          </Case>
          <Case label="state=reasonReady">
            <DecisionPanel
              state="reasonReady"
              goal="Make the pickup action easy to find."
              reason="Pickup reads first, which fits a student in a hurry."
            />
          </Case>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
