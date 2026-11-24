import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { ModalHeader } from '@/components/ModalHeader';

export type Record = { version: string; reason: string; evidence: string; tradeOff: string; takeaway: string | null };

type Props = { visible: boolean; record: Record; onSummary: () => void; onClose: () => void };

/**
 * Figma: R6 · Saved record (11125:60310), from Reflect → Open crit notes.
 * Prototype: Preview project summary → R4 · Dialog · Project summary.
 */
export function SavedRecord({ visible, record, onSummary, onClose }: Props) {
  const rows: [string, string][] = [
    ['Reason', record.reason],
    ['Evidence', record.evidence],
    ['Trade-off', record.tradeOff],
    ['Takeaway', record.takeaway ?? 'Ready to save'],
  ];
  const quote = `“I chose ${record.version} because ${lower(record.reason)} You can tell: ${lower(record.evidence)} The trade-off is that ${lower(record.tradeOff)}”`;
  return (
    <DialogPage visible={visible} onClose={onClose} width="w-dialogRecord" radius="rounded-10" motion="guide">
      <View className="gap-16 p-24">
        <ModalHeader title={`Crit notes · ${record.version}`} description="Your reasons, ready for crit" onClose={onClose} />
        {rows.map(([label, body]) => (
          <View key={label} className="gap-4">
            <Text className="font-semibold text-meta text-secondaryText">{label.toUpperCase()}</Text>
            <Text className="font-regular text-bodySmall text-ink">{body}</Text>
          </View>
        ))}
        <View className="gap-6 rounded-10 bg-guidance px-12 py-10">
          <Text className="font-semibold text-meta text-secondaryText">SAY IT AT CRIT</Text>
          <Text className="font-regular text-bodySmall text-ink">{quote}</Text>
        </View>
        <Button label="Preview project summary (PDF)" variant="secondary" size="sm" full onPress={onSummary} />
      </View>
    </DialogPage>
  );
}

function lower(s: string) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}
