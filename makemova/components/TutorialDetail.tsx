import { Linking, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/DialogFooter';
import { DialogPage } from '@/components/DialogPage';
import { GuideStep } from '@/components/GuideStep';
import { ModalHeader } from '@/components/ModalHeader';

export type Tutorial = { title: string; meta: string; lead: string; steps: string[]; url: string };

type Props = { tutorial: Tutorial | null; onClose: () => void };

/**
 * Figma: R5 · Tutorial · Make the main action stand out (11125:60346), Keep spacing with Auto Layout (60368).
 * Prototype: Open full tutorial ↗ opens the link; Back to my design closes.
 */
export function TutorialDetail({ tutorial, onClose }: Props) {
  return (
    <DialogPage visible={!!tutorial} onClose={onClose} width="w-dialogTutorial" radius="rounded-10" shadow={false} motion="tutorials">
      {tutorial && (
        <>
          <View className="gap-20 p-24">
            <ModalHeader title={tutorial.title} onClose={onClose} />
            <Text className="font-semibold text-category text-secondaryText">{tutorial.meta}</Text>
            <Text className="font-regular text-bodyUi text-secondaryText">{tutorial.lead}</Text>
            {tutorial.steps.map((s, i) => (
              <GuideStep key={s} number={String(i + 1)} title={s} />
            ))}
          </View>
          <DialogFooter>
            <Button label="Open full tutorial ↗" variant="quiet" size="md" onPress={() => void Linking.openURL(tutorial.url)} />
            <Button label="Back to my design" size="md" onPress={onClose} />
          </DialogFooter>
        </>
      )}
    </DialogPage>
  );
}
