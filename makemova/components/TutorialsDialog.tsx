import { Text, View } from 'react-native';

import { DialogPage } from '@/components/DialogPage';
import { Icon, type IconName } from '@/components/Icon';
import { ModalHeader } from '@/components/ModalHeader';

const guides: { category: string; title: string; body: string; icon: IconName }[] = [
  { category: 'DESIGN', title: 'Make the main action stand out', body: 'Use size, contrast and space.', icon: 'bulb' },
  { category: 'TOOL · FIGMA', title: 'Keep spacing with Auto Layout', body: 'Build a layout that adapts.', icon: 'book' },
];

type Props = { visible: boolean; onClose: () => void };

/** Figma: R5 · Tutorials · Tool & design (11125:60129), from the Tutorials tool card. */
export function TutorialsDialog({ visible, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} radius="rounded-10" shadow={false} motion="tutorials">
      <View className="gap-20 p-24">
        <ModalHeader title="Learn, then try it here" onClose={onClose} />
        <Text className="font-regular text-bodySmall text-secondaryText">
          Short guides for this project. No credits needed.
        </Text>
        {guides.map((g) => (
          <View key={g.title} className="flex-row items-center gap-16 rounded-10 border border-border bg-white p-16">
            <View className="h-tutorialThumb w-tutorialThumb items-center justify-center rounded-10 bg-paper">
              <Icon name={g.icon} />
            </View>
            <View className="flex-1 gap-4">
              <Text className="font-semibold text-category text-secondaryText">{g.category}</Text>
              <Text className="font-medium text-labelUi text-ink">{g.title}</Text>
              <Text className="font-regular text-bodySmall text-secondaryText">{g.body}</Text>
            </View>
          </View>
        ))}
      </View>
    </DialogPage>
  );
}
