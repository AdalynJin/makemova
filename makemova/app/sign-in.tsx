import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AccountNote, AccountScreen } from '@/components/AccountScreen';
import { AuthField } from '@/components/AuthField';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { exampleDestination } from '@/lib/workspace-rules';
import { size } from '@/tokens';

/** Figma: CH00a · Sign in (Refined 11125:39791) */
export default function SignIn() {
  const { session } = useAuth();
  const { project } = useLocalSearchParams<{ project?: string }>();
  const destination = exampleDestination(project);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (session) return <Redirect href={destination} />;

  async function submit() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter your email address and password.');
      return;
    }
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (authError) setError(authError.message);
    else router.replace(destination);
  }

  return (
    <AccountScreen
      title="Welcome back"
      subtitle="Sign in to return to your saved projects."
      art={{ crew: 'mateShowTheWay', width: size.peekShowTheWay, left: size.peekShowTheWayLeft }}
      help
      footer={
        <>
          <Text className="font-regular text-bodySmall text-secondaryText">New here?</Text>
          <Pressable accessibilityRole="link" onPress={() => router.push(destination === '/projects/example'
            ? { pathname: '/create-account', params: { project: 'example' } }
            : '/create-account')}>
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
        <Pressable accessibilityRole="link" onPress={() => router.push('/reset-password')} className="self-end">
          <Text className="font-medium text-labelSmall text-secondaryText">Forgot password?</Text>
        </Pressable>
      </View>
      {error && <AccountNote tone="error">{error}</AccountNote>}
      <Button label="Sign in" full busy={busy} onPress={submit} />
    </AccountScreen>
  );
}
