import { supabase } from '@/lib/supabase';

/**
 * Real critique for the designer's own project, run by the `critique` Edge Function
 * (supabase/functions/critique). The Anthropic key lives only there; the app sends the
 * signed-in session token and gets back feedback pins.
 */

/** One note Claude pinned on the screen. x and y are a share (0–1) of the drawn screen's width and height. */
export type CritiquePin = { title: string; body: string; x: number; y: number };
export type Critique = { summary: string; pins: CritiquePin[] };

type Row = { version_id: string; result: Critique | null; created_at: string };

/** Asks Claude for a critique of one saved version. Throws an Error with a sentence to show. */
export async function requestCritique(projectId: string, version: number, focus: string): Promise<Critique> {
  const { data, error } = await supabase.functions.invoke<Critique & { error?: string }>('critique', {
    body: { projectId, version, focus },
  });
  if (error) {
    // FunctionsHttpError carries the function's own { error } sentence in its response.
    const context = (error as { context?: Response }).context;
    const sentence = await context
      ?.json()
      .then((b: { error?: string }) => b.error)
      .catch(() => undefined);
    throw new Error(sentence ?? 'Critique is not reachable right now. Check your connection and try again.');
  }
  if (!data?.pins) throw new Error(data?.error ?? 'The critique came back empty. Try again.');
  return { summary: data.summary, pins: data.pins };
}

/** The latest saved critique per version id. Versions without one are left out. */
export async function loadCritiques(projectId: string): Promise<Record<string, Critique>> {
  const { data, error } = await supabase
    .from('critique_sessions')
    .select('version_id, result, created_at')
    .eq('project_id', projectId)
    .eq('status', 'done')
    .not('result', 'is', null)
    .order('created_at', { ascending: false });
  if (error || !data) return {};
  const latest: Record<string, Critique> = {};
  for (const row of data as Row[]) {
    if (row.result && !latest[row.version_id]) latest[row.version_id] = row.result;
  }
  return latest;
}
