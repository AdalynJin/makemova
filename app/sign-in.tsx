import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AccountScreen } from '@/components/AccountScreen';
import { AuthField } from '@/components/AuthField';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

/** Figma: Flow A · Sign in (10551:5196) */
export default function SignIn() {
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (session) return <Redirect href="/projects" />;

  async function submit() {
    setError(null);
    setNotice(null);
    if (!email.trim() || !password) {
      setError('Enter your email address and password.');
      return;
    }
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (authError) setError(authError.message);
    else router.replace('/projects');
  }

  async function forgot() {
    setError(null);
    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());
    if (resetError) setError(resetError.message);
    else setNotice('Check your email for a reset link.');
  }

  return (
    <AccountScreen
      title="Welcome back"
      subtitle="Sign in to return to your saved projects."
      footer={
        <>
          <Text className="font-regular text-bodySmall text-secondaryText">New here?</Text>
          <Pressable accessibilityRole="link" onPress={() => router.push('/create-account')}>
            <Text className="font-medium text-labelSmall text-ink">Create an account</Text>
          </Pressable>
        </>
      }
    >
      {!isSupabaseConfigured && (
        <View className="rounded-12 bg-guidance p-16">
          <Text className="font-semibold text-labelUi text-ink">Supabase is not connected yet</Text>
        </View>
      )}
      <View className="gap-16">
        <AuthField
          label="Email address"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />
        <AuthField
          label="Password"
          secureTextEntry
          autoComplete="current-password"
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={submit}
          placeholder="Your password"
        />
        <Pressable accessibilityRole="link" onPress={forgot} className="self-end">
          <Text className="font-medium text-labelSmall text-secondaryText">Forgot password?</Text>
        </Pressable>
      </View>
      {error && (
        <View className="rounded-12 bg-selected px-14 py-10">
          <Text className="font-medium text-labelUi text-ink">{error}</Text>
        </View>
      )}
      {notice && (
        <View className="rounded-12 bg-compare px-14 py-10">
          <Text className="font-medium text-labelUi text-ink">{notice}</Text>
        </View>
      )}
      <Button label="Sign in" full busy={busy} onPress={submit} />
    </AccountScreen>
  );
}
