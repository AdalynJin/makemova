import { Redirect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { color } from '@/tokens';

type Load = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; projects: Project[] };

export default function Projects() {
  const { session, loading } = useAuth();
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoad({ status: 'loading' });
    // RLS returns only the signed-in designer's own projects.
    const { data, error } = await supabase
      .from('projects')
      .select('id, owner_id, title, status, skill_focus, created_at')
      .order('created_at', { ascending: false });
    if (error) setLoad({ status: 'error', message: error.message });
    else setLoad({ status: 'ready', projects: data ?? [] });
  }, []);

  useEffect(() => {
    if (session) fetchProjects();
  }, [session, fetchProjects]);

  if (loading) return null;
  if (!session) return <Redirect href="/sign-in" />;

  async function startProject() {
    if (!title.trim() || !session) return;
    setSaving(true);
    setSaveError(null);
    const { error } = await supabase
      .from('projects')
      .insert({ title: title.trim(), owner_id: session.user.id, status: 'active' });
    setSaving(false);
    if (error) setSaveError(error.message);
    else {
      setTitle('');
      fetchProjects();
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surfaceCanvas">
      <View className="flex-1 px-24 pt-24 gap-24">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-panel text-textPrimary">My projects</Text>
          <Pressable accessibilityRole="button" onPress={() => supabase.auth.signOut()} className="px-12 py-8">
            <Text className="font-bold text-action text-textSecondary">Sign out</Text>
          </Pressable>
        </View>

        <View className="gap-12 rounded-24 bg-surfaceCard p-24">
          <Text className="font-bold text-label text-textPrimary">Start a project</Text>
          <TextInput
            className="rounded-16 border border-borderDefault bg-surfaceCard px-16 py-12 font-regular text-body text-textPrimary"
            value={title}
            onChangeText={setTitle}
            placeholder="Kiln studio website"
          />
          {saveError && <Text className="font-regular text-caption text-textPrimary">! {saveError}</Text>}
          <Pressable
            accessibilityRole="button"
            disabled={saving || !title.trim()}
            onPress={startProject}
            className={`items-center rounded-pill bg-mateOrange px-20 py-12 ${!title.trim() ? 'opacity-40' : ''}`}
          >
            {saving ? (
              <ActivityIndicator color={color.ink} />
            ) : (
              <Text className="font-bold text-action text-textPrimary">Start making</Text>
            )}
          </Pressable>
        </View>

        {load.status === 'loading' && <ActivityIndicator color={color.ink} />}

        {load.status === 'error' && (
          <View className="gap-12 rounded-16 bg-critiqueSurface p-16">
            <Text className="font-bold text-action text-textPrimary">Projects could not load</Text>
            <Text className="font-regular text-caption text-textPrimary">{load.message}</Text>
            <Pressable accessibilityRole="button" onPress={fetchProjects}>
              <Text className="font-bold text-action text-textPrimary">Try again</Text>
            </Pressable>
          </View>
        )}

        {load.status === 'ready' && (
          <FlatList
            data={load.projects}
            keyExtractor={(p) => p.id}
            contentContainerClassName="gap-12 pb-32"
            ListEmptyComponent={
              <View className="items-center gap-8 rounded-16 border border-dashed border-borderDefault p-24">
                <Text className="font-bold text-label text-textPrimary">No projects yet</Text>
                <Text className="font-regular text-body text-textSecondary">Name one above to start.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View className="gap-4 rounded-16 bg-surfaceCard p-16">
                <Text className="font-bold text-label text-textPrimary">{item.title}</Text>
                <Text className="font-regular text-caption text-textSecondary">
                  {item.status} · {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
