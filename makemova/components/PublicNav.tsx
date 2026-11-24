import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import { QuickGuide } from '@/components/QuickGuide';
import { useAuth } from '@/lib/auth';

type Props = {
  /** home: 81 tall, 15px links with Plans. account: 64 tall, used on sign in and create account. */
  variant?: 'home' | 'account';
  onSection?: (id: 'how' | 'example' | 'plans') => void;
  /** On the homepage: the logo goes back to the top. */
  onHome?: () => void;
};

/** Figma: R4/Nav · Public */
export function PublicNav({ variant = 'account', onSection, onHome }: Props) {
  const { session } = useAuth();
  const home = variant === 'home';
  const [guide, setGuide] = useState(false);
  const link = home ? 'font-medium text-action text-ink' : 'font-medium text-labelUi text-secondaryText';
  const go = (id: 'how' | 'example' | 'plans') => (onSection ? onSection(id) : router.push(`/#${id}` as never));
  return (
    <View
      className={`flex-row items-center justify-between border-b border-border bg-white px-64 ${
        home ? 'h-homeNavHeight' : 'h-navHeight'
      }`}
    >
      <View className={`flex-row items-center ${home ? 'gap-56' : 'gap-20'}`}>
        <Logo home={home} onHome={onHome} />
        <View className={`flex-row items-center ${home ? 'gap-36' : 'gap-18'}`}>
          <Pressable accessibilityRole="link" onPress={() => go('how')}>
            <Text className={link}>How it works</Text>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => go('example')}>
            <Text className={link}>Example project</Text>
          </Pressable>
          {home && (
            <Pressable accessibilityRole="link" onPress={() => go('plans')}>
              <Text className={link}>Plans</Text>
            </Pressable>
          )}
        </View>
      </View>
      <View className={`flex-row items-center ${home ? 'gap-36' : 'gap-20'}`}>
        <Pressable accessibilityRole="button" onPress={() => setGuide(true)} className="flex-row items-center gap-6">
          <Icon name="help" />
          <Text className={link}>
            Quick guide
          </Text>
        </Pressable>
        {session ? (
          <Button
            label="My projects"
            size={home ? 'nav' : 'sm'}
            arrow={home}
            onPress={() => router.push('/projects')}
          />
        ) : (
          <>
            <Pressable accessibilityRole="link" onPress={() => router.push('/sign-in')}>
              <Text className={`text-ink ${home ? 'pr-8 font-bold text-action' : 'font-semibold text-labelUi'}`}>Sign in</Text>
            </Pressable>
            <Button
              label="Create account"
              size={home ? 'nav' : 'sm'}
              arrow={home}
              onPress={() => router.push('/create-account')}
            />
          </>
        )}
      </View>
      <QuickGuide visible={guide} onClose={() => setGuide(false)} />
    </View>
  );
}
