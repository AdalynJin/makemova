import { Platform } from 'react-native';

/**
 * "Bring your own work": pick, check and describe the one image a designer starts with.
 * Figma: Flow B · CH01 · Bring existing work (11125:41492) — "PNG or JPG · up to 10 MB".
 */

export const WORK_TYPES = ['image/png', 'image/jpeg'] as const;
export const WORK_MAX_BYTES = 10 * 1024 * 1024;

export type Work = {
  file: Blob;
  name: string;
  type: (typeof WORK_TYPES)[number];
  bytes: number;
  /** Object URL for the preview. Call releaseWork when it is no longer shown. */
  uri: string;
};

export const WORK_ERROR = 'Choose a PNG or JPG under 10 MB, then try again.';
export const WORK_UNAVAILABLE = 'Uploading works in the web app for now.';

/** Turns a browser File into Work, or returns the sentence to show. */
export function checkWork(file: File): Work | string {
  const type = WORK_TYPES.find((t) => t === file.type);
  if (!type || file.size > WORK_MAX_BYTES || file.size === 0) return WORK_ERROR;
  return { file, name: file.name, type, bytes: file.size, uri: URL.createObjectURL(file) };
}

export function releaseWork(work: Work | null) {
  if (work && Platform.OS === 'web') URL.revokeObjectURL(work.uri);
}

/** Opens the system file picker (web). Resolves null if the designer cancels. */
export function pickWorkFile(): Promise<File | null> {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = WORK_TYPES.join(',');
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.oncancel = () => resolve(null);
    input.click();
  });
}

/** "PNG · 1.1 MB · one screen", as on R4/File chip. */
export function describeWork(work: Work) {
  const kind = work.type === 'image/png' ? 'PNG' : 'JPG';
  const mb = work.bytes / (1024 * 1024);
  const sizeLabel = mb >= 0.1 ? `${mb.toFixed(1)} MB` : `${Math.max(1, Math.round(work.bytes / 1024))} KB`;
  return `${kind} · ${sizeLabel} · one screen`;
}

/** Storage path: <user id>/<project id>/<file name>, as the artifacts bucket policy expects. */
export function workPath(userId: string, projectId: string, work: Work) {
  const ext = work.type === 'image/png' ? 'png' : 'jpg';
  const base =
    work.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'work';
  return `${userId}/${projectId}/${base}.${ext}`;
}
