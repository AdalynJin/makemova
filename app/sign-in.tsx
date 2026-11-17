import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { color } from '@/tokens';

export default function SignIn() {
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (session) return <Redirect href="/" />;

  async function submit() {
    setError(null);
    setNotice(null);
    if (!email.trim() || password.length < 8) {
      setError('Enter your email and a password of at least 8 characters.');
      return;
    }
    setBusy(true);
    const { data, error: authError } =
      mode === 'sign-in'
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({ email: email.trim(), password });
    setBusy(false);
    if (authError) setError(authError.message);
    else if (mode === 'sign-up' && !data.session) setNotice('Check your email to confirm, then sign in.');
  }

  return (
    <SafeAreaView className="flex-1 bg-surfaceCanvas">
      <View className="flex-1 justify-center px-24 gap-24">
        <View className="gap-8">
          <Text className="font-bold text-title text-textPrimary">Makemova</Text>
          <Text className="font-regular text-body text-textSecondary">
            Bring one screen. Make one better decision.
          </Text>
        </View>

        {!isSupabaseConfigured && (
          <View className="rounded-16 bg-guidanceSurface p-16">
            <Text className="font-bold text-action text-textPrimary">Supabase is not connected yet</Text>
            <Text className="font-regular text-caption text-textPrimary">
              Copy .env.example to .env and add the project URL and publishable key.
            </Text>
          </View>
        )}

        <View className="gap-16">
          <View className="gap-8">
            <Text className="font-bold text-action text-textPrimary">Email</Text>
            <TextInput
              className="rounded-16 border border-borderDefault bg-surfaceCard px-16 py-12 font-regular text-body text-textPrimary"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />
          </View>
          <View className="gap-8">
            <Text className="font-bold text-action text-textPrimary">Password</Text>
            <TextInput
              className="rounded-16 border border-borderDefault bg-surfaceCard px-16 py-12 font-regular text-body text-textPrimary"
              secureTextEntry
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
            />
          </View>
        </View>

        {error && <Text className="font-regular text-caption text-textPrimary">! {error}</Text>}
        {notice && <Text className="font-regular text-caption text-textPrimary">{notice}</Text>}

        <View className="gap-12">
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={submit}
            className="items-center rounded-pill bg-mateOrange px-20 py-12"
          >
            {busy ? (
              <ActivityIndicator color={color.ink} />
            ) : (
              <Text className="font-bold text-action text-textPrimary">
                {mode === 'sign-in' ? 'Sign in' : 'Create account'}
              </Text>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
            className="items-center px-20 py-12"
          >
            <Text className="font-bold text-action text-textPrimary">
              {mode === 'sign-in' ? 'New here? Create an account' : 'Have an account? Sign in'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
