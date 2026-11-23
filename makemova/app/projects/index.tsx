import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, View } from 'react-native';

import { AppNav } from '@/components/AppNav';
import { CrewMosaic } from '@/components/CrewMosaic';
import { Button } from '@/components/Button';
import { ChooseStart } from '@/components/ChooseStart';
import { DeletedProjectToast } from '@/components/DeletedProjectToast';
import { DeleteProjectConfirmation } from '@/components/DeleteProjectConfirmation';
import { ProjectActions } from '@/components/ProjectActions';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { softShadow } from '@/lib/ui';
import { color, opacity, size } from '@/tokens';

type Load = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; projects: Project[] };

function edited(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'edited today';
  if (days === 1) return 'edited yesterday';
  return `edited ${days} days ago`;
}

/** Figma: R5 · My projects · Compact cards (11125:41069) and CH01b · My projects · First visit (11125:41239) */
export default function Projects() {
  const { session, loading } = useAuth();
  const userId = session?.user.id;
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [query, setQuery] = useState('');
  const [attempt, setAttempt] = useState(0);
  // ⋯ → R5 · Project actions → R5 · Delete project confirmation → "Project deleted." with Undo.
  const [actionsFor, setActionsFor] = useState<Project | null>(null);
  const [confirmFor, setConfirmFor] = useState<Project | null>(null);
  const [pending, setPending] = useState<Project | null>(null);
  const [deletedAny, setDeletedAny] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const pendingRef = useRef<Project | null>(null);
  pendingRef.current = pending;

  /** Removes the project for real: its stored screens, then the row (versions and feedback cascade). */
  const commitDelete = useCallback(
    async (project: Project) => {
      if (!userId) return;
      const folder = `${userId}/${project.id}`;
      const { data: files } = await supabase.storage.from('artifacts').list(folder);
      if (files?.length) await supabase.storage.from('artifacts').remove(files.map((f) => `${folder}/${f.name}`));
      const { error } = await supabase.from('projects').delete().eq('id', project.id).eq('owner_id', userId);
      if (error) {
        setDeleteError('This project could not be deleted. Try again.');
        return;
      }
      setLoad((prev) =>
        prev.status === 'ready' ? { ...prev, projects: prev.projects.filter((p) => p.id !== project.id) } : prev,
      );
    },
    [userId],
  );

  /** Makes the waiting delete for real. Undo is gone once this runs. */
  const flush = useCallback(() => {
    const project = pendingRef.current;
    if (!project) return;
    pendingRef.current = null;
    setPending(null);
    void commitDelete(project);
  }, [commitDelete]);

  // Undo stays available while the toast shows; the delete is made when the designer leaves this page
  // (another screen, closing the tab, or unmount).
  useFocusEffect(useCallback(() => flush, [flush]));
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return flush;
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [flush]);

  function confirmDelete() {
    const project = confirmFor;
    if (!project) return;
    flush();
    setConfirmFor(null);
    setDeleteError(null);
    pendingRef.current = project;
    setPending(project);
    setDeletedAny(true);
  }

  function undoDelete() {
    pendingRef.current = null;
    setPending(null);
  }

  useEffect(() => {
    if (!userId) return;
    let active = true;
    // RLS returns only the signed-in designer's own projects.
    void supabase
      .from('projects')
      .select('id, owner_id, title, status, skill_focus, created_at')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setLoad({ status: 'error', message: error.message });
        else setLoad({ status: 'ready', projects: data ?? [] });
      });
    return () => { active = false; };
  }, [attempt, userId]);

  const remaining = useMemo(
    () => (load.status === 'ready' ? load.projects.filter((p) => p.id !== pending?.id) : []),
    [load, pending],
  );
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? remaining.filter((p) => p.title.toLowerCase().includes(q)) : remaining;
  }, [remaining, query]);

  if (loading) return null;
  if (!session) return <Redirect href="/sign-in" />;

  const firstVisit = load.status === 'ready' && load.projects.length === 0 && !deletedAny;
  const allDeleted = load.status === 'ready' && deletedAny && remaining.length === 0;

  return (
    <View className="flex-1 bg-paper">
      <AppNav />
      <View className="flex-1">
        {/* Figma: MOVA · Decorative background / Projects. Crew mosaic at 6.2%, repeat from the body top-left. */}
        <CrewMosaic opacity={opacity.patternProjects} />
        <ScrollView className="flex-1" contentContainerClassName="px-64 pt-64 pb-96">
          {load.status === 'loading' && (
            <View className="items-center py-96">
              <ActivityIndicator color={color.ink} />
            </View>
          )}

          {load.status === 'error' && (
            <View className="w-column gap-12 rounded-12 border border-border bg-white p-20" style={softShadow}>
              <Text className="font-semibold text-cardTitle text-ink">Projects could not load</Text>
              <Text className="font-regular text-bodyUi text-secondaryText">{load.message}</Text>
              <Button label="Try again" variant="white" size="sm" onPress={() => {
                setLoad({ status: 'loading' });
                setAttempt((value) => value + 1);
              }} />
            </View>
          )}

          {firstVisit && (
            <View className="gap-24">
              <View className="gap-28 pb-12">
                <Text className="font-bold text-pageTitle text-ink">My projects</Text>
                <Text className="font-regular text-leadSmall text-secondaryText">
                  Bring your work or start from a template.
                </Text>
              </View>
              <ChooseStart />
              <View className="gap-8 rounded-12 border border-border bg-white p-20" style={softShadow}>
                <Text className="font-semibold text-nav text-ink">Upload, manual comparison and saved notes are free.</Text>
                <Text className="font-regular text-bodyUi text-secondaryText">
                  A quick critique costs 5 credits per version. You confirm before it runs.
                </Text>
                <Text accessibilityRole="link" onPress={() => router.push('/account/credits')} className="font-semibold text-labelUi text-ink">
                  See every AI credit rate →
                </Text>
              </View>
            </View>
          )}

          {load.status === 'ready' && !firstVisit && (
            <View className="gap-24">
              <View className="flex-row items-start justify-between">
                <View className="gap-8">
                  <Text className="font-bold text-pageTitle text-ink">My projects</Text>
                  <Text className="font-regular text-bodySmall text-secondaryText">
                    {remaining.length} {remaining.length === 1 ? 'project' : 'projects'}
                  </Text>
                </View>
                <Button label="Start a project" width={size.startButton} onPress={() => router.push('/projects/new')} />
              </View>

              <View className="flex-row items-center gap-16">
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search projects"
                  placeholderTextColor={color.ink}
                  className="h-control w-column rounded-pill border border-ink bg-white px-20 text-center font-semibold text-labelUi text-ink"
                  style={{ outlineStyle: 'none' } as never}
                />
                <Text className="font-regular text-bodySmall text-secondaryText">Recently edited</Text>
              </View>

              <View className="flex-row flex-wrap gap-24">
                {shown.map((p) => (
                  <View
                    key={p.id}
                    className="w-column gap-12 rounded-10 border border-border bg-white p-16"
                    style={softShadow}
                  >
                    <View className="h-thumbHeight items-center justify-center overflow-hidden rounded-6 bg-paper">
                      <Text className="font-bold text-sectionUi text-border">{p.title.slice(0, 1).toUpperCase()}</Text>
                    </View>
                    <View className="flex-row items-center justify-between pt-6">
                      <Text numberOfLines={1} className="flex-1 font-semibold text-cardTitle text-ink">
                        {p.title}
                      </Text>
                      <Button
                        label="⋯"
                        variant="quiet"
                        size="sm"
                        width={size.controlSmall}
                        onPress={() => setActionsFor(p)}
                      />
                    </View>
                    <Text className="font-regular text-bodySmall text-secondaryText">
                      Brief · v1 · {edited(p.created_at)}
                    </Text>
                    <Button
                      label="Open project →"
                      variant="white"
                      size="sm"
                      full
                      onPress={() => router.push(`/projects/${p.id}`)}
                    />
                  </View>
                ))}
                {shown.length === 0 && !allDeleted && (
                  <Text className="font-regular text-bodyUi text-secondaryText">No projects match “{query}”.</Text>
                )}
              </View>

              {/* Figma: No projects yet — shown once the last project is deleted. */}
              {allDeleted && (
                <View className="gap-12 bg-paper p-32">
                  <Text className="font-bold text-heading text-ink">Start your first project.</Text>
                  <Text className="font-regular text-bodyUi text-secondaryText">
                    Choose the café brief or bring a screen you want to improve.
                  </Text>
                  <Button label="Start a project" width={size.startButton} onPress={() => router.push('/projects/new')} />
                </View>
              )}
              {pending && <DeletedProjectToast onUndo={undoDelete} />}
              {deleteError && <DeletedProjectToast message={deleteError} />}

              <View className="mt-12 border-t border-border" />
              <View className="gap-4 pb-28">
                <Text className="font-semibold text-sectionUi text-ink">Choose how to start</Text>
                <Text className="font-regular text-bodySmall text-secondaryText">
                  Bring your work or start from a template.
                </Text>
              </View>
              <ChooseStart />
            </View>
          )}
        </ScrollView>
      </View>

      <ProjectActions
        visible={!!actionsFor}
        onClose={() => setActionsFor(null)}
        onDelete={() => {
          setConfirmFor(actionsFor);
          setActionsFor(null);
        }}
      />
      <DeleteProjectConfirmation
        project={confirmFor?.title ?? null}
        onConfirm={confirmDelete}
        onClose={() => setConfirmFor(null)}
      />
    </View>
  );
}
