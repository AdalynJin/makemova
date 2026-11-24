import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { QuickGuide } from '@/components/QuickGuide';
import { useAuth } from '@/lib/auth';
import { credits } from '@/lib/credits';
import { supabase } from '@/lib/supabase';
import { size } from '@/tokens';

type Props = {
  /** projects: "My projects" is the active link. workspace: a back pill to My projects. */
  variant?: 'projects' | 'workspace';
  /** The balance after this session's critiques (the prototype's creditDisplay). */
  balance?: number;
};

function initials(name?: string | null, email?: string | null) {
  const src = (name || email || '').trim();
  if (!src) return '··';
  const parts = src.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || src[0].toUpperCase();
}

/** Figma: R4/Nav · App */
export function AppNav({ variant = 'projects', balance = credits.remaining }: Props) {
  const { session } = useAuth();
  const meta = session?.user.user_metadata as { display_name?: string } | undefined;
  const [guide, setGuide] = useState(false);
  return (
    <View className="h-navHeight flex-row items-center justify-between border-b border-border bg-white px-64">
      <View className="flex-row items-center gap-20">
        <Logo />
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push('/projects')}
          className="h-controlSmall flex-row items-center gap-4 rounded-pill bg-paper px-12"
        >
          {variant === 'workspace' && <Icon name="arrowLeft" size={size.iconXs} />}
          <Text className="font-medium text-labelUi text-ink">My projects</Text>
        </Pressable>
      </View>
      <View className="flex-row items-center gap-20">
        <Pressable accessibilityRole="button" onPress={() => setGuide(true)} className="flex-row items-center gap-6">
          <Icon name="help" />
          <Text className="font-medium text-labelUi text-secondaryText">Quick guide</Text>
        </Pressable>
        <Pressable
          accessibilityRole="link"
          onPress={() => router.push('/account/credits')}
          className="h-controlSmall flex-row items-center gap-6 rounded-10 border border-border bg-white px-12"
        >
          <Icon name="zap" />
          <Text className="font-semibold text-labelUi text-ink">{`${balance} credits`}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Account · sign out"
          onPress={async () => {
            await supabase.auth.signOut();
            router.replace('/');
          }}
          className="h-avatar w-avatar items-center justify-center rounded-pill bg-border"
        >
          <Text className="font-semibold text-labelSmall text-ink">
            {initials(meta?.display_name, session?.user.email)}
          </Text>
        </Pressable>
      </View>
      <QuickGuide visible={guide} onClose={() => setGuide(false)} />
    </View>
  );
}
