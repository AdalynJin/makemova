import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage, type DialogMotion } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

export type GuidanceSection = { label?: string; body: string; tone?: 'paper' | 'guidance' };

type Props = {
  visible: boolean;
  title: string;
  description?: string;
  sections?: GuidanceSection[];
  action?: string;
  motion?: DialogMotion | null;
  onClose: () => void;
};

/**
 * Figma: the R6 guidance family, all "read, then go back" overlays:
 * Guidelines · On demand (11125:61115, 60771), R6 · Decision guidance (60237), R6 · Revision guidance (60274),
 * B / C · Edit source guidance (60547), Flow B · Version history (60559), R6 · Saved decision (60284).
 */
export function GuidanceDialog({ visible, title, description, sections = [], action = 'Back to work', motion = null, onClose }: Props) {
  return (
    <DialogPage visible={visible} onClose={onClose} width="w-dialogSmall" radius="rounded-10" motion={motion}>
      <View className="gap-16 p-24">
        <ModalHeader title={title} description={description} onClose={onClose} />
        {sections.map((s, i) => (
          <View key={i} className={`gap-4 rounded-10 px-12 py-10 ${s.tone === 'guidance' ? 'bg-guidance' : 'bg-paper'}`}>
            {s.label ? <Text className="font-semibold text-meta text-secondaryText">{s.label}</Text> : null}
            <Text className="font-regular text-bodySmall text-ink">{s.body}</Text>
          </View>
        ))}
        <View className="items-end">
          <Button label={action} variant="secondary" size="sm" onPress={onClose} />
        </View>
      </View>
    </DialogPage>
  );
}
