import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { DialogPage } from '@/components/DialogPage';
import { GuideStep } from '@/components/GuideStep';
import { GuidanceOptions, type GuidanceLevel } from '@/components/GuidanceOptions';
import { ModalHeader } from '@/components/ModalHeader';
import { Sticker } from '@/components/Sticker';
import { size } from '@/tokens';

const stages = [
  ['Brief', 'Set the goal.'],
  ['Make', 'Create, get feedback or compare versions.'],
  ['Revise', 'Apply a change and save a new version.'],
  ['Reflect', 'Keep one lesson from the project.'],
] as const;

type Props = { visible: boolean; onClose: () => void };

/**
 * Figma: Dialog page · R6 · Quick guide · Four stages (11125:59881). Mate (MOVA · Motion · guide) and
 * Opus · Here’s a guide stand on the card. "Guidance options" opens R6 · Guidance options.
 */
export function QuickGuide({ visible, onClose }: Props) {
  const [guidance, setGuidance] = useState(false);
  const [level, setLevel] = useState<GuidanceLevel>('More guidance');
  return (
    <>
      <DialogPage
        visible={visible && !guidance}
        onClose={onClose}
        radius="rounded-10"
        motion="guide"
        extra={
          <Sticker
            crew="opusGuide"
            width={size.quickGuideOpus}
            style={{ position: 'absolute', left: size.quickGuideOpusLeft, bottom: '100%' }}
          />
        }
      >
        <View className="gap-24 p-24">
          <ModalHeader title="Your project in four stages" onClose={onClose} />
          <View className="gap-20">
            {stages.map(([title, body], i) => (
              <GuideStep key={title} number={String(i + 1)} title={title} body={body} />
            ))}
          </View>
          <Text className="font-regular text-bodySmall text-secondaryText">
            Stages are the process. Versions are your saved attempts.
          </Text>
          <View className="gap-16">
            <Button label="Guidance options" variant="quiet" size="header" full onPress={() => setGuidance(true)} />
            <Button label="Back to my work" size="md" full onPress={onClose} />
          </View>
        </View>
      </DialogPage>
      <GuidanceOptions
        visible={visible && guidance}
        value={level}
        onChange={setLevel}
        onClose={() => setGuidance(false)}
      />
    </>
  );
}
