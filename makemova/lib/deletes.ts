import AsyncStorage from '@react-native-async-storage/async-storage';

import { deleteRowOnLeave, supabase } from './supabase';

/**
 * Project deletes that have been decided but not finished. Closing the tab can cut a delete short,
 * so it is written down first and finished the next time My projects opens.
 */
const KEY = 'makemova.pendingDeletes';
type Entry = { userId: string; projectId: string };

async function readAll(): Promise<Entry[]> {
  try {
    const value: unknown = JSON.parse((await AsyncStorage.getItem(KEY)) ?? '[]');
    return Array.isArray(value) ? (value as Entry[]) : [];
  } catch {
    return [];
  }
}

async function forget(projectId: string) {
  const rest = (await readAll()).filter((e) => e.projectId !== projectId);
  await AsyncStorage.setItem(KEY, JSON.stringify(rest)).catch(() => undefined);
}

/** Removes a project's stored screens, then its row (versions and feedback cascade). True when it is gone. */
export async function deleteProject(userId: string, projectId: string): Promise<boolean> {
  const folder = `${userId}/${projectId}`;
  const bucket = supabase.storage.from('artifacts');
  const { data: files, error: listError } = await bucket.list(folder);
  if (listError) return false;
  if (files.length) {
    const { error: removeError } = await bucket.remove(files.map((f) => `${folder}/${f.name}`));
    if (removeError) return false;
  }
  const { error } = await supabase.from('projects').delete().eq('id', projectId).eq('owner_id', userId);
  return !error;
}

/**
 * The tab is closing: nothing async survives, so note the delete and send the row's delete in one
 * request the browser finishes by itself. Stored screens are cleared by finishDeletes.
 */
export function deleteOnLeave(userId: string, projectId: string, accessToken: string) {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    const entries = Array.isArray(saved) ? (saved as Entry[]) : [];
    window.localStorage.setItem(KEY, JSON.stringify([...entries, { userId, projectId }]));
  } catch {
    // Storage is blocked: the request below is still sent.
  }
  deleteRowOnLeave('projects', projectId, accessToken);
}

/** Finishes this designer's noted deletes. Returns the ids still waiting, so they stay hidden. */
export async function finishDeletes(userId: string): Promise<string[]> {
  const waiting: string[] = [];
  for (const entry of await readAll()) {
    if (entry.userId !== userId) continue;
    const done = await deleteProject(userId, entry.projectId).catch(() => false);
    if (done) await forget(entry.projectId);
    else waiting.push(entry.projectId);
  }
  return waiting;
}
