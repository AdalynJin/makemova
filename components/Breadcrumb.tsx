import { Fragment } from 'react';
import { Text, View } from 'react-native';

export type BreadcrumbDepth = 'two' | 'three';

type Props = { root: string; project: string; stage?: string; depth?: BreadcrumbDepth };

/** Figma: Breadcrumb — the last item is the current place. */
export function Breadcrumb({ root, project, stage = 'Make', depth = 'two' }: Props) {
  const items = depth === 'three' ? [root, project, stage] : [root, project];
  return (
    <View className="flex-row flex-wrap items-center gap-8" accessibilityRole="header">
      {items.map((item, i) => (
        <Fragment key={item + i}>
          {i > 0 && <Text className="font-regular text-caption text-secondaryText">/</Text>}
          <Text className={`font-regular text-caption ${i === items.length - 1 ? 'text-ink' : 'text-secondaryText'}`}>
            {item}
          </Text>
        </Fragment>
      ))}
    </View>
  );
}
