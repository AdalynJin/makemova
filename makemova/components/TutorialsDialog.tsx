import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DialogPage } from '@/components/DialogPage';
import { Icon, type IconName } from '@/components/Icon';
import { ModalHeader } from '@/components/ModalHeader';
import { TutorialDetail, type Tutorial } from '@/components/TutorialDetail';

const guides: { category: string; title: string; body: string; icon: IconName; detail: Tutorial }[] = [
  {
    category: 'DESIGN',
    title: 'Make the main action stand out',
    body: 'Use size, contrast and space.',
    icon: 'bulb',
    detail: {
      title: 'Make the main action stand out',
      meta: 'DESIGN · 3 STEPS · FREE',
      lead: 'Use size, contrast and space.',
      steps: ['Choose one action to lead.', 'Give it more contrast than other actions.', 'Check that secondary actions stay visible.'],
      url: 'https://www.nngroup.com/articles/visual-hierarchy-ux-definition/',
    },
  },
  {
    category: 'TOOL · FIGMA',
    title: 'Keep spacing with Auto Layout',
    body: 'Build a layout that adapts.',
    icon: 'book',
    detail: {
      title: 'Keep spacing with Auto Layout',
      meta: 'TOOL · FIGMA · 3 STEPS · FREE',
      lead: 'Build a layout that adapts.',
      steps: ['Select related elements and add Auto Layout.', 'Set padding and the gap between items.', 'Resize the frame and check the result.'],
      url: 'https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout-in-Figma',
    },
  },
];

type Props = { visible: boolean; onClose: () => void };

/**
 * Figma: R5 · Tutorials · Tool & design (11125:60129), from the Tutorials tool card.
 * Prototype: DESIGN → swap to R5 · Tutorial · Make the main action stand out; TOOL · FIGMA → Keep spacing with Auto Layout.
 */
export function TutorialsDialog({ visible, onClose }: Props) {
  const [open, setOpen] = useState<Tutorial | null>(null);
  return (
    <>
    <TutorialDetail tutorial={visible ? open : null} onClose={() => { setOpen(null); onClose(); }} />
    <DialogPage visible={visible && !open} onClose={onClose} radius="rounded-10" shadow={false} motion="tutorials">
      <View className="gap-20 p-24">
        <ModalHeader title="Learn, then try it here" onClose={onClose} />
        <Text className="font-regular text-bodySmall text-secondaryText">
          Short guides for this project. No credits needed.
        </Text>
        {guides.map((g) => (
          <Pressable
            key={g.title}
            accessibilityRole="button"
            onPress={() => setOpen(g.detail)}
            className="flex-row items-center gap-16 rounded-10 border border-border bg-white p-16 hover:border-secondaryText"
          >
            <View className="h-tutorialThumb w-tutorialThumb items-center justify-center rounded-10 bg-paper">
              <Icon name={g.icon} />
            </View>
            <View className="flex-1 gap-4">
              <Text className="font-semibold text-category text-secondaryText">{g.category}</Text>
              <Text className="font-medium text-labelUi text-ink">{g.title}</Text>
              <Text className="font-regular text-bodySmall text-secondaryText">{g.body}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </DialogPage>
    </>
  );
}
