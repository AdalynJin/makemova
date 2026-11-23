import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { AccountNote, AccountScreen } from '@/components/AccountScreen';
import { AuthField } from '@/components/AuthField';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { color, size } from '@/tokens';

/**
 * Figma: CH00c · Set new password (11125:40457) → CH00c · Password saved (11125:40601).
 * The recovery link from the reset email signs the person in for this one step (Supabase reads the
 * link on web), then updateUser sets the new password. Without that session the link has expired.
 */
export default function UpdatePassword() {
  const { session, loading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const back = (
    <Pressable accessibilityRole="link" onPress={() => router.replace('/sign-in')}>
      <Text className="font-medium text-labelSmall text-ink">Back to sign in</Text>
    </Pressable>
  );

  async function save() {
    setTried(true);
    setError(null);
    if (password.length < 8) return setError('Use at least 8 characters.');
    if (confirm !== password) return setError('The two passwords do not match.');
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setBusy(false);
      return setError(updateError.message);
    }
    // Sign out so "Back to sign in" really asks for the new password.
    await supabase.auth.signOut();
    setBusy(false);
    setSaved(true);
  }

  if (saved) {
    return (
      <AccountScreen
        title="Password updated"
        subtitle="Sign in with your new password."
        icon="check"
        art={{ crew: 'mateReflectDone', width: size.peekReflectDone, left: size.peekReflectDoneLeft }}
      >
        <Button label="Back to sign in" full onPress={() => router.replace('/sign-in')} />
      </AccountScreen>
    );
  }

  const art = { motion: 'revise', width: size.newPasswordMotion, left: size.newPasswordMotionLeft, top: size.newPasswordMotionTop } as const;

  if (loading) {
    return (
      <AccountScreen title="Choose a new password" subtitle="Checking your reset link…" icon="edit" art={art}>
        <View className="items-center py-16">
          <ActivityIndicator color={color.ink} />
        </View>
      </AccountScreen>
    );
  }

  if (!session) {
    return (
      <AccountScreen
        title="This link has expired"
        subtitle="Reset links work once and for a short time. Ask for a new one."
        icon="edit"
        art={art}
        footer={back}
      >
        <Button label="Send a new link" full onPress={() => router.replace('/reset-password')} />
      </AccountScreen>
    );
  }

  return (
    <AccountScreen title="Choose a new password" subtitle="Use at least 8 characters." icon="edit" art={art} footer={back}>
      <View className="gap-16">
        <View className="gap-6">
          <AuthField
            label="New password"
            secureTextEntry
            autoComplete="new-password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
          />
          <Text className="font-regular text-labelSmall text-secondaryText">At least 8 characters</Text>
        </View>
        <AuthField
          label="Confirm new password"
          secureTextEntry
          autoComplete="new-password"
          value={confirm}
          onChangeText={setConfirm}
          onSubmitEditing={save}
          placeholder="Re-enter your password"
          error={tried && confirm && confirm !== password ? 'Passwords do not match.' : null}
        />
      </View>
      {error && <AccountNote tone="error">{error}</AccountNote>}
      <Button label="Save new password" full busy={busy} onPress={save} />
    </AccountScreen>
  );
}
