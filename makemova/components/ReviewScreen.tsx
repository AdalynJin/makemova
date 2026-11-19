import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { FileChip } from '@/components/FileChip';
import { ModalHeader } from '@/components/ModalHeader';
import { describeWork, type Work } from '@/lib/work';

type Props = {
  work: Work | null;
  title?: string;
  description?: string;
  busy?: boolean;
  error?: string | null;
  onClose: () => void;
  onReplace: () => void;
  onChooseAnother: () => void;
  onAdd: () => void;
};

/**
 * Figma: R4 · Dialog · Review screen (11125:60453).
 * Prototype: Choose another → back to Flow B · CH01; Add to project → Flow B · CH02 · Brief.
 */
export function ReviewScreen({
  work,
  title = 'Review your first screen',
  description = 'This becomes your first saved attempt.',
  busy, error, onClose, onReplace, onChooseAnother, onAdd }: Props) {
  return (
    <DialogPage visible={!!work} onClose={busy ? () => {} : onClose}>
      {work && (
        <>
          <View className="px-24 pb-16 pt-24">
            <ModalHeader
              title={title}
              description={description}
              onClose={busy ? () => {} : onClose}
            />
          </View>
          <View className="gap-16 px-24 pb-24 pt-8">
            <View className="h-reviewPreviewHeight rounded-10 bg-paper p-12">
              <Image
                source={{ uri: work.uri }}
                style={{ flex: 1 }}
                contentFit="contain"
                accessibilityLabel={work.name}
              />
            </View>
            <FileChip fileName={work.name} meta={describeWork(work)} onAction={busy ? undefined : onReplace} />
            {error && (
              <View className="rounded-12 bg-selected px-14 py-10">
                <Text className="font-medium text-labelUi text-ink">{error}</Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center justify-end gap-12 border-t border-border bg-paper px-24 py-16">
            <Button label="Choose another" variant="quiet" size="md" disabled={busy} onPress={onChooseAnother} />
            <Button label="Add to project" size="md" busy={busy} onPress={onAdd} />
          </View>
        </>
      )}
    </DialogPage>
  );
}
