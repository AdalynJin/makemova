import { Text, View } from 'react-native';

import { PillAction } from './PillAction';

export type StatusNoticeState = 'saved' | 'running' | 'error' | 'insufficientCredits';

type Props = {
  state: StatusNoticeState;
  title?: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Credits the request needs, shown as the mark for insufficientCredits. */
  creditsNeeded?: number;
};

const preset: Record<StatusNoticeState, { mark: string; markClass: string; title: string; body: string; action: string }> = {
  saved: {
    mark: '✓',
    markClass: 'bg-mateOrange text-ink',
    title: 'Decision saved',
    body: 'Your reason stays with v2. Reopening this record is free.',
    action: 'View decision',
  },
  running: {
    mark: '…',
    markClass: 'bg-artiBlue text-white',
    title: 'Looking at your work',
    body: 'Only a completed new response uses 5 credits.',
    action: 'Cancel',
  },
  error: {
    mark: '!',
    markClass: 'bg-mateOrange text-ink',
    title: 'The request did not finish',
    body: '0 credits used. Your work and earlier versions are safe.',
    action: 'Try again',
  },
  insufficientCredits: {
    mark: '5',
    markClass: 'bg-versaPink text-ink',
    title: 'You need 2 more credits',
    body: 'Your balance is 3. This critique needs 5. Nothing was charged.',
    action: 'View plans',
  },
};

/** Figma: Status notice — what happened, what it cost, what to do next. */
export function StatusNotice({ state, title, body, actionLabel, onAction, creditsNeeded }: Props) {
  const p = preset[state];
  const mark = state === 'insufficientCredits' && creditsNeeded ? String(creditsNeeded) : p.mark;
  return (
    <View className="gap-16 rounded-16 border border-borderDefault bg-white p-16" accessibilityLiveRegion="polite">
      <View className="flex-row gap-12">
        <Text
          className={`h-statusMark w-statusMark overflow-hidden rounded-12 pt-4 text-center font-bold text-label ${p.markClass}`}
        >
          {mark}
        </Text>
        <View className="flex-1 gap-4">
          <Text className="font-bold text-action text-ink">{title ?? p.title}</Text>
          <Text className="font-regular text-caption text-secondaryText">{body ?? p.body}</Text>
        </View>
      </View>
      <View className="flex-row">
        <PillAction label={actionLabel ?? p.action} type="secondary" onPress={onAction} />
      </View>
    </View>
  );
}
