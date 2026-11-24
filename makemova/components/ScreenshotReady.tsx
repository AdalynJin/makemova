import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';
import { VersionPreview } from '@/components/VersionPreview';
import type { Work } from '@/lib/work';
import { size } from '@/tokens';

type Props = {
  work: Work | null;
  /** "v2" — the label the screenshot gets when it is added. */
  next: string;
  description?: string;
  action?: string;
  busy?: boolean;
  error?: string | null;
  onAdd: () => void;
  onChooseAnother: () => void;
  onClose: () => void;
};

/**
 * Figma: Own project · Screenshot ready (11125:61011) — "Review screenshot".
 * Prototype: Add screenshot → fills the comparison slot (Pair ready) and closes.
 */
export function ScreenshotReady({
  work,
  next,
  description = 'Add this screenshot to the comparison.',
  action = 'Add screenshot',
  busy,
  error,
  onAdd,
  onChooseAnother,
  onClose,
}: Props) {
  const close = busy ? () => {} : onClose;
  return (
    <DialogPage visible={!!work} onClose={close} width="w-dialogSmall" motion={null}>
      {work && (
        <View className="gap-16 p-24">
          <ModalHeader title="Review screenshot" onClose={close} />
          <Text className="font-regular text-bodySmall text-secondaryText">{description}</Text>
          <View className="items-center rounded-10 bg-paper p-12">
            <VersionPreview
              source={{ uri: work.uri }}
              label={work.name}
              maxWidth={size.dialogSmall - size.controlLarge * 2}
              maxHeight={size.reviewPreviewHeight}
            />
          </View>
          <View className="flex-row items-center gap-8 rounded-10 bg-paper px-12 py-12">
            <Text numberOfLines={1} className="flex-1 font-medium text-labelUi text-ink">
              {work.name}
            </Text>
            <Text className="font-regular text-bodySmall text-secondaryText">{next}</Text>
          </View>
          {error && (
            <View className="rounded-12 bg-selected px-14 py-10">
              <Text className="font-medium text-labelUi text-ink">{error}</Text>
            </View>
          )}
          <Button label={action} size="md" full busy={busy} onPress={onAdd} />
          <Button label="Choose another" variant="quiet" size="sm" full disabled={busy} onPress={onChooseAnother} />
        </View>
      )}
    </DialogPage>
  );
}
