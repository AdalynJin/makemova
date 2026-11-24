import { Platform, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/DialogFooter';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';
import type { Record } from '@/components/SavedRecord';

type Props = {
  visible: boolean;
  title: string;
  goal: string;
  before: string;
  after: string;
  decision: string;
  record: Record;
  onClose: () => void;
};

/**
 * Figma: R4 · Dialog · Project summary (11125:60402), from R6 · Saved record.
 * Prototype: Back to reflection and Download PDF close. On web, Download PDF opens the print dialog.
 */
export function ProjectSummary({ visible, title, goal, before, after, decision, record, onClose }: Props) {
  const rows: [string, string][] = [
    ['Decision', decision],
    ['Reason', record.reason],
    ['Evidence', record.evidence],
    ['Trade-off', record.tradeOff],
    ['Takeaway', record.takeaway ?? 'Not chosen yet.'],
  ];
  return (
    <DialogPage visible={visible} onClose={onClose} width="w-dialogSummary" motion={null}>
      <View className="gap-16 p-24">
        <ModalHeader title={title} description={`Goal: ${goal} · Brief → Make → Revise → Reflect`} onClose={onClose} />
        <View className="flex-row gap-12">
          {[`Before · ${before}`, `After · ${after}`].map((l) => (
            <View key={l} className="flex-1 rounded-10 bg-paper px-12 py-10">
              <Text className="font-medium text-labelSmall text-ink">{l}</Text>
            </View>
          ))}
        </View>
        {rows.map(([label, body]) => (
          <View key={label} className="gap-4 border-t border-border pt-12">
            <Text className="font-semibold text-meta text-secondaryText">{label.toUpperCase()}</Text>
            <Text className="font-regular text-bodySmall text-ink">{body}</Text>
          </View>
        ))}
      </View>
      <DialogFooter>
        <Button label="Back to reflection" variant="quiet" size="md" onPress={onClose} />
        <Button
          label="Download PDF"
          size="md"
          onPress={() => {
            if (Platform.OS === 'web' && typeof window !== 'undefined') window.print();
            onClose();
          }}
        />
      </DialogFooter>
    </DialogPage>
  );
}
