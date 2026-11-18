import { useEffect, useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';

type Props = {
  /** Figma property "Title". */
  title?: string;
  hint?: string;
  onChoose: () => void;
  /** Web: a file dropped onto the zone. */
  onDropFile?: (file: File) => void;
};

/** Figma: R4/Dropzone (8708:3705). Paper fill, dashed secondary border, upload mark, title, hint, Choose file. */
export function Dropzone({ title = 'Drop your work here', hint = 'PNG or JPG · up to 10 MB', onChoose, onDropFile }: Props) {
  const ref = useRef<unknown>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !onDropFile) return;
    const el = ref.current as unknown as HTMLElement | null;
    if (!el?.addEventListener) return;
    const over = (e: DragEvent) => e.preventDefault();
    const drop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file) onDropFile(file);
    };
    el.addEventListener('dragover', over);
    el.addEventListener('drop', drop);
    return () => {
      el.removeEventListener('dragover', over);
      el.removeEventListener('drop', drop);
    };
  }, [onDropFile]);

  return (
    <Pressable
      ref={ref as never}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${hint}`}
      onPress={onChoose}
      className="items-center gap-12 rounded-14 border border-dashed border-secondaryText bg-paper px-24 py-32"
    >
      <View className="h-iconBox w-iconBox items-center justify-center rounded-pill border border-border bg-white">
        <Icon name="upload" />
      </View>
      <Text className="font-medium text-labelUi text-ink">{title}</Text>
      <Text className="font-regular text-bodySmall text-secondaryText">{hint}</Text>
      <Button label="Choose file" variant="white" size="sm" onPress={onChoose} />
    </Pressable>
  );
}
