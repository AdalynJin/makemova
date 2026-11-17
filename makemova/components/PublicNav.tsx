import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Wordmark } from '@/components/Wordmark';
import { useAuth } from '@/lib/auth';

type Props = {
  /** home: 81 tall, 16px links with Plans. account: 64 tall, used on sign in and create account. */
  variant?: 'home' | 'account';
  onSection?: (id: 'how' | 'example' | 'plans') => void;
};

/** Figma: R4/Nav · Public */
export function PublicNav({ variant = 'account', onSection }: Props) {
  const { session } = useAuth();
  const home = variant === 'home';
  const link = home ? 'font-medium text-nav text-ink' : 'font-medium text-labelUi text-secondaryText';
  const go = (id: 'how' | 'example' | 'plans') => (onSection ? onSection(id) : router.push(`/#${id}` as never));
  return (
    <View
      className={`flex-row items-center justify-between border-b border-border bg-white px-64 ${
        home ? 'h-homeNavHeight' : 'h-navHeight'
      }`}
    >
      <View className={`flex-row items-center ${home ? 'gap-40' : 'gap-24'}`}>
        <Wordmark />
        <View className={`flex-row items-center ${home ? 'gap-32' : 'gap-18'}`}>
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
      <View className={`flex-row items-center ${home ? 'gap-24' : 'gap-20'}`}>
        <Pressable accessibilityRole="button" className="flex-row items-center gap-6">
          <Icon name="help" />
          <Text className={home ? 'font-medium text-nav text-ink' : 'font-medium text-labelUi text-secondaryText'}>
            Quick guide
          </Text>
        </Pressable>
        {session ? (
          <Button
            label="My projects"
            size={home ? 'lg' : 'sm'}
            arrow={home}
            onPress={() => router.push('/projects')}
          />
        ) : (
          <>
            <Pressable accessibilityRole="link" onPress={() => router.push('/sign-in')}>
              <Text className={`font-semibold text-ink ${home ? 'text-nav' : 'text-labelUi'}`}>Sign in</Text>
            </Pressable>
            <Button
              label="Create account"
              size={home ? 'lg' : 'sm'}
              arrow={home}
              onPress={() => router.push('/create-account')}
            />
          </>
        )}
      </View>
    </View>
  );
}
