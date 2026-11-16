import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AccountScreen } from '@/components/AccountScreen';
import { AuthField } from '@/components/AuthField';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

/** Figma: Create account (10993:19541) */
export default function CreateAccount() {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (session) return <Redirect href="/projects" />;

  async function submit() {
    setError(null);
    setNotice(null);
    if (!name.trim() || !email.trim() || password.length < 8) {
      setError('Add your name, email address and a password of at least 8 characters.');
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
    else router.replace('/projects');
  }

  return (
    <AccountScreen
      title="Create your account"
      subtitle="Save your projects and pick up where you left off."
      footer={
        <>
          <Text className="font-regular text-bodySmall text-secondaryText">Already have an account?</Text>
          <Pressable accessibilityRole="link" onPress={() => router.push('/sign-in')}>
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
          onSubmitEditing={submit}
          placeholder="At least 8 characters"
        />
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
      <Button label="Create account" full busy={busy} onPress={submit} />
    </AccountScreen>
  );
}
