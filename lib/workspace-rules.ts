export type WorkspaceStage = 'brief' | 'make' | 'revise' | 'reflect';

const followingStage: Record<WorkspaceStage, WorkspaceStage | null> = {
  brief: 'make',
  make: 'revise',
  revise: 'reflect',
  reflect: null,
};

export function nextStage(stage: WorkspaceStage) {
  return followingStage[stage];
}

export function exampleDestination(project: unknown) {
  return project === 'example' ? '/projects/example' : '/projects';
}

export function pickComparisonVersion(other: number | null, candidate: number) {
  return candidate === other ? null : candidate;
}

export function screenshotError(file: { type: string; size: number }) {
  if (file.type !== 'image/png' && file.type !== 'image/jpeg') return 'Choose a PNG or JPG.';
  if (file.size <= 0) return 'This file is empty. Choose another screenshot.';
  if (file.size > 5 * 1024 * 1024) return 'Choose a screenshot up to 5 MB.';
  return null;
}
