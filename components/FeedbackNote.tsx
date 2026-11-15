import { Pressable, Text, View } from 'react-native';

export type FeedbackNoteState = 'default' | 'selected' | 'resolved';

type Props = {
  title: string;
  observation: string;
  /** "Try next" suggestion, or "Your change" once resolved. */
  next: string;
  version?: string;
  resolvedIn?: string;
  state?: FeedbackNoteState;
  onPress?: () => void;
};

const surface: Record<FeedbackNoteState, string> = {
  default: 'border border-borderDefault bg-white',
  selected: 'bg-critique',
  resolved: 'bg-paper',
};

/** Figma: Feedback note — one critique observation and the next step. */
export function FeedbackNote({ title, observation, next, version = 'v1', resolvedIn = 'v3', state = 'default', onPress }: Props) {
  const status =
    state === 'resolved' ? `✓ Addressed in ${resolvedIn}` : `${state === 'selected' ? 'Selected' : 'Critique'} note · ${version}`;
  return (
    <Pressable onPress={onPress} className={`gap-16 rounded-16 p-20 ${surface[state]}`}>
      <View className="flex-row items-center gap-12">
        <View className="h-noteMark w-noteMark items-center justify-center rounded-pill bg-versaPink">
          <View className="h-dot w-dot rounded-pill bg-ink" />
        </View>
        <View className="flex-1 gap-4">
          <Text className="font-bold text-label text-ink">{title}</Text>
          <Text className="font-regular text-caption text-secondaryText">{status}</Text>
        </View>
      </View>
      <Text className="font-regular text-body text-ink">{observation}</Text>
      <View className={`gap-8 rounded-12 p-16 ${state === 'default' ? 'bg-critique' : 'bg-white'}`}>
        <Text className="font-bold text-small uppercase text-ink">{state === 'resolved' ? 'Your change' : 'Try next'}</Text>
        <Text className="font-regular text-body text-ink">{next}</Text>
      </View>
    </Pressable>
  );
}
