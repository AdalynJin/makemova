import { Text, View } from 'react-native';

import { Button } from '@/components/Button';

type Props = {
  /** Figma property State. */
  state: 'addDirection' | 'savedCritique' | 'compare';
  onPress: () => void;
};

const COPY = {
  addDirection: { text: 'Add another direction when you are ready.', action: 'Add another direction' },
  savedCritique: { text: 'Saved critique · Free to reopen. Try one change as a new version.', action: 'Try another direction' },
  compare: { text: 'You have two versions. Compare them side by side, then pick one to revise.', action: 'Compare versions' },
} as const;

/**
 * Figma: Next action · Fixed footer (Flow B · CH03 · Make · Tools 11125:43628 and CH04 · Make · Critique 11125:43900).
 * One line under the workspace header that says what to do next in Make: add a second version, or compare.
 */
export function NextAction({ state, onPress }: Props) {
  const copy = COPY[state];
  return (
    <View className="w-full flex-row items-center justify-center gap-16 border-b border-border bg-white px-64 py-8">
      <Text className="font-regular text-bodySmall text-ink">{copy.text}</Text>
      <Button label={copy.action} variant="secondary" size="sm" onPress={onPress} />
    </View>
  );
}
