import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AccountNote, AccountScreen } from '@/components/AccountScreen';
import { AuthField } from '@/components/AuthField';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { exampleDestination } from '@/lib/workspace-rules';
import { size } from '@/tokens';

/** Figma: CH00d · Create account (Refined 11125:40864), with the Confirm password field from the audit pass. */
export default function CreateAccount() {
  const { session } = useAuth();
  const { project } = useLocalSearchParams<{ project?: string }>();
  const destination = exampleDestination(project);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (session) return <Redirect href={destination} />;

  async function submit() {
    setError(null);
    setNotice(null);
    setTried(true);
    if (!name.trim() || !email.trim() || password.length < 8) {
      setError('Add your name, email address and a password of at least 8 characters.');
      return;
    }
    if (confirm !== password) {
      setError('The two passwords do not match.');
      return;
    }
    setBusy(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      // The profile trigger copies display_name into public.profiles.
      options: { data: { display_name: name.trim() } },
    });
    setBusy(false);
    if (authError) setError(authError.message);
    else if (!data.session) setNotice('Check your email to confirm, then sign in.');
    else router.replace(destination);
  }

  return (
    <AccountScreen
      title="Create your account"
      subtitle="Save your projects and pick up where you left off."
      art={{ crew: 'mateShowTheWay', width: size.peekShowTheWay, left: size.peekShowTheWayLeft }}
      help
      footer={
        <>
          <Text className="font-regular text-bodySmall text-secondaryText">Already have an account?</Text>
          <Pressable accessibilityRole="link" onPress={() => router.push(destination === '/projects/example'
            ? { pathname: '/sign-in', params: { project: 'example' } }
            : '/sign-in')}>
            <Text className="font-medium text-labelSmall text-ink">Sign in</Text>
          </Pressable>
        </>
      }
    >
      <View className="gap-16">
        <AuthField label="Name" autoComplete="name" value={name} onChangeText={setName} placeholder="Your name" />
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
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 8 characters"
        />
        <AuthField
          label="Confirm password"
          secureTextEntry
          autoComplete="new-password"
          value={confirm}
          onChangeText={setConfirm}
          onSubmitEditing={submit}
          placeholder="Re-enter your password"
          error={tried && confirm && confirm !== password ? 'Passwords do not match.' : null}
        />
      </View>
      {error && <AccountNote tone="error">{error}</AccountNote>}
      {notice && <AccountNote tone="notice">{notice}</AccountNote>}
      <Button label="Create account" full busy={busy} onPress={submit} />
    </AccountScreen>
  );
}
