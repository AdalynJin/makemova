import { Fragment } from 'react';
import { Text, View } from 'react-native';

export type LearningPathStage = 'brief' | 'make' | 'revise' | 'reflect';

const stages: { key: LearningPathStage; label: string }[] = [
  { key: 'brief', label: 'Brief' },
  { key: 'make', label: 'Make' },
  { key: 'revise', label: 'Revise' },
  { key: 'reflect', label: 'Reflect' },
];

/** Figma: Learning path — the four project stages, current one in Mate orange. */
export function LearningPath({ stage }: { stage: LearningPathStage }) {
  const current = stages.findIndex((s) => s.key === stage);
  return (
    <View className="flex-row flex-wrap items-center gap-8">
      {stages.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <Fragment key={s.key}>
            {i > 0 && (
              <View className={`h-connectorThickness w-connector ${i <= current ? 'bg-ink' : 'bg-border'}`} />
            )}
            <View
              className={`flex-row items-center gap-8 rounded-16 ${active ? 'bg-mateOrange py-4 pl-4 pr-12' : ''}`}
            >
              <View
                className={`h-stepNumber w-stepNumber items-center justify-center rounded-12 ${
                  active ? 'bg-white' : done ? 'bg-ink' : 'border border-borderDefault'
                }`}
              >
                <Text className={`font-bold text-small ${done ? 'text-white' : active ? 'text-ink' : 'text-secondaryText'}`}>
                  {done ? '✓' : i + 1}
                </Text>
              </View>
              <Text
                className={`text-step ${active ? 'font-bold text-ink' : done ? 'font-medium text-ink' : 'font-medium text-secondaryText'}`}
              >
                {s.label}
              </Text>
            </View>
          </Fragment>
        );
      })}
    </View>
  );
}
