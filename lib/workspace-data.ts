import { supabase } from '@/lib/supabase';
import { screenshotError, type WorkspaceStage } from '@/lib/workspace-rules';

export type Version = {
  id?: string;
  number: number;
  label: string | null;
  source?: number | { uri: string };
};

export type WorkspaceProgress = {
  stage?: WorkspaceStage;
  decision_version?: number;
  goal_fit?: string;
  evidence?: string;
  trade_off?: string;
  revision_note?: string;
  lesson?: string;
};

export async function loadVersions(projectId: string): Promise<Version[]> {
  const { data, error } = await supabase.from('artifact_versions')
    .select('id, version_number, label, file_ref').eq('project_id', projectId).order('version_number');
  if (error) throw error;
  if (!data.length) return [];

  const signed = await supabase.storage.from('artifacts').createSignedUrls(data.map((row) => row.file_ref), 3600);
  const urls = new Map(signed.data?.filter((item) => item.path && item.signedUrl).map((item) => [item.path, item.signedUrl]));
  return data.map((row) => {
    const uri = urls.get(row.file_ref);
    return { id: row.id, number: row.version_number, label: row.label, source: uri ? { uri } : undefined };
  });
}

export async function uploadVersion(projectId: string, userId: string, file: File) {
  const invalid = screenshotError(file);
  if (invalid) throw new Error(invalid);
  const extension = file.type === 'image/png' ? 'png' : 'jpg';
  const path = `${userId}/${projectId}/${crypto.randomUUID()}.${extension}`;
  const bucket = supabase.storage.from('artifacts');
  const upload = await bucket.upload(path, file, { contentType: file.type });
  if (upload.error) throw new Error('The screenshot could not be uploaded. Try again.');

  const { data, error } = await supabase.rpc('append_artifact_version', {
    target_project: projectId,
    object_path: path,
    version_label: file.name,
  });
  if (error) {
    // A transport failure can happen after the write. Keep the object until the outcome is known.
    if (error.code) await bucket.remove([path]);
    throw new Error('The new version could not be confirmed. Reopen the project before retrying.');
  }
  return data as number;
}

export async function saveWorkspaceProgress(projectId: string, patch: WorkspaceProgress) {
  const { error } = await supabase.from('workspace_progress')
    .upsert({ project_id: projectId, ...patch }, { onConflict: 'project_id', defaultToNull: false });
  if (error) throw error;
}
