import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import { AccountNote, AccountScreen } from '@/components/AccountScreen';
import { AuthField } from '@/components/AuthField';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { size } from '@/tokens';

/** Where the email link lands. On web it is this site's /update-password. */
function recoveryUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') return `${window.location.origin}/update-password`;
  return Linking.createURL('/update-password');
}

/**
 * Figma: CH00b · Reset password (11125:39997) → CH00b · Email sent (11125:40206).
 * "Send reset link" asks Supabase to email a recovery link; "Resend link" sends it again.
 */
export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function send() {
    setError(null);
    setNotice(null);
    if (!email.trim()) {
      setError('Enter the email address you signed up with.');
      return false;
    }
    setBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: recoveryUrl() });
    setBusy(false);
    if (resetError) {
      setError(resetError.message);
      return false;
    }
    return true;
  }

  const back = (
    <Pressable accessibilityRole="link" onPress={() => router.push('/sign-in')}>
      <Text className="font-medium text-labelSmall text-ink">Back to sign in</Text>
    </Pressable>
  );

  if (sent) {
    return (
      <AccountScreen
        title="Check your email"
        subtitle={`Check ${email.trim()} for a reset link.`}
        icon="message"
        art={{ crew: 'mateSetTheGoal', width: size.peekSetTheGoal, left: size.peekSetTheGoalLeft }}
        footer={
          <>
            <Text className="font-regular text-bodySmall text-secondaryText">Didn’t get it?</Text>
            <Pressable
              accessibilityRole="link"
              onPress={async () => {
                if (await send()) setNotice('We sent another link.');
              }}
            >
              <Text className="font-medium text-labelSmall text-ink">Resend link</Text>
            </Pressable>
            <Text className="font-regular text-bodySmall text-secondaryText">·</Text>
            {back}
          </>
        }
      >
        {error && <AccountNote tone="error">{error}</AccountNote>}
        {notice && <AccountNote tone="notice">{notice}</AccountNote>}
        {/* Figma's "Open email app" leads to Set new password; here it opens the mail app (mailto:). */}
        <Button label="Open email app" full onPress={() => Linking.openURL('mailto:')} />
      </AccountScreen>
    );
  }

  return (
    <AccountScreen
      title="Reset your password"
      subtitle="We’ll email you a reset link."
      icon="help"
      art={{ motion: 'brief', width: size.resetMotion, left: size.resetMotionLeft, top: size.resetMotionTop }}
      footer={back}
    >
      <AuthField
        label="Account email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={async () => (await send()) && setSent(true)}
        placeholder="you@example.com"
      />
      {error && <AccountNote tone="error">{error}</AccountNote>}
      <Button label="Send reset link" full busy={busy} onPress={async () => (await send()) && setSent(true)} />
    </AccountScreen>
  );
}
