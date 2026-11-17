import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';

export type Stage = 'brief' | 'make' | 'revise' | 'reflect';

const stages: { id: Stage; label: string }[] = [
  { id: 'brief', label: 'Brief' },
  { id: 'make', label: 'Make' },
  { id: 'revise', label: 'Revise' },
  { id: 'reflect', label: 'Reflect' },
];

type Props = { current: Stage; onChange: (s: Stage) => void };

/** Figma: Project stages · Click to switch (done = check, current = ink pill, next = outlined number). */
export function StageNav({ current, onChange }: Props) {
  const at = stages.findIndex((s) => s.id === current);
  return (
    <View className="flex-row items-center gap-8">
      {stages.map((s, i) => {
        const done = i < at;
        const active = i === at;
        return (
          <View key={s.id} className="flex-row items-center gap-8">
            {i > 0 && <View className="w-connector16 border-t border-secondaryText" />}
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(s.id)}
              className={`h-stageButton flex-row items-center gap-8 rounded-10 px-10 ${active ? 'bg-ink' : ''}`}
            >
              <View
                className={`h-stageMarker w-stageMarker items-center justify-center rounded-pill ${
                  active ? 'bg-white' : done ? 'bg-stageDone' : 'border border-secondaryText'
                }`}
              >
                {done ? (
                  <Icon name="checkSmall" />
                ) : (
                  <Text className={`font-medium text-meta ${active ? 'text-ink' : 'text-secondaryText'}`}>{i + 1}</Text>
                )}
              </View>
              <Text className={`font-medium text-labelSmall ${active ? 'text-white' : 'text-secondaryText'}`}>
                {s.label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}
