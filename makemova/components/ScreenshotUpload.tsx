import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { size } from '@/tokens';

import { PillAction } from './PillAction';

export type ScreenshotUploadState = 'empty' | 'dragOver' | 'uploading' | 'attached' | 'error';

type Props = {
  state: ScreenshotUploadState;
  filename?: string;
  /** File details for the attached state, e.g. "PNG · 1.2 MB". */
  fileMeta?: string;
  /** 0–100, for the uploading state. */
  progress?: number;
  onChoose?: () => void;
  onReplace?: () => void;
  onRemove?: () => void;
};

const mate = require('@/assets/images/crew/mate-upload-guide.png');

const frame: Record<ScreenshotUploadState, string> = {
  empty: 'border-dash border-dashed border-secondaryText bg-white',
  dragOver: 'border-focus border-dashed border-mateOrange bg-selected',
  uploading: 'border border-borderDefault bg-white',
  attached: 'border border-borderDefault bg-white',
  error: 'border-focus border-mateOrange bg-white',
};

/** Figma: Screenshot upload — file, progress, next step. */
export function ScreenshotUpload({
  state,
  filename = 'cafe-revision.png',
  fileMeta = 'PNG · 1.2 MB',
  progress = 60,
  onChoose,
  onReplace,
  onRemove,
}: Props) {
  return (
    <View className={`gap-12 rounded-16 p-20 ${frame[state]}`}>
      {(state === 'empty' || state === 'dragOver') && (
        <>
          <View className="flex-row items-start justify-between gap-8">
            <Text className="font-bold text-label text-ink">
              {state === 'empty' ? 'Bring your work.' : 'Ready when you are.'}
            </Text>
            <Image source={mate} style={{ width: size.sticker, height: size.stickerHeight }} contentFit="contain" />
          </View>
          <Text className="font-regular text-caption text-secondaryText">PNG or JPG · Up to 5 MB per file</Text>
          <View className="flex-row">
            <PillAction
              label="Choose file"
              type={state === 'dragOver' ? 'primary' : 'secondary'}
              state={state === 'dragOver' ? 'hover' : undefined}
              onPress={onChoose}
            />
          </View>
        </>
      )}

      {state === 'uploading' && (
        <>
          <Text className="font-bold text-action text-ink">{filename}</Text>
          <Text className="font-regular text-caption text-secondaryText">Uploading… {progress}%</Text>
          <View className="h-progress overflow-hidden rounded-pill bg-paper">
            <View className="h-progress rounded-pill bg-artiBlue" style={{ width: `${progress}%` }} />
          </View>
          <Text className="font-regular text-caption text-secondaryText">Keep this window open. Nothing is charged.</Text>
        </>
      )}

      {state === 'attached' && (
        <>
          <Text className="font-bold text-action text-ink">{filename}</Text>
          <Text className="font-regular text-caption text-secondaryText">{fileMeta} · Ready to save</Text>
          <View className="flex-row gap-12">
            <View className="flex-1">
              <PillAction label="Replace" type="secondary" onPress={onReplace} />
            </View>
            <View className="flex-1">
              <PillAction label="Remove" type="secondary" onPress={onRemove} />
            </View>
          </View>
        </>
      )}

      {state === 'error' && (
        <>
          <Text className="font-bold text-label text-ink">! File could not be added</Text>
          <Text className="font-regular text-body text-ink">
            Choose a PNG or JPG under 5 MB, then try again. Your earlier version is safe.
          </Text>
          <View className="flex-row">
            <PillAction label="Choose another file" type="secondary" onPress={onChoose} />
          </View>
        </>
      )}
    </View>
  );
}
