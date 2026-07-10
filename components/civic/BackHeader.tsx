import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CivicNoirTheme } from '../../constants/theme';
import { pressFeedback } from './haptics';

type Props = {
  title: string;
  /** Right-side slot, e.g. a step indicator. */
  right?: React.ReactNode;
};

export function BackHeader({ title, right }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.left}>
        <Pressable
          onPress={() => {
            pressFeedback();
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
        >
          <MaterialIcons name="arrow-back" size={22} color={CivicNoirTheme.colors.primary} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: CivicNoirTheme.colors.outlineSoft,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  backButton: {
    width: CivicNoirTheme.hitTarget,
    height: CivicNoirTheme.hitTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.outlineSoft,
  },
  backPressed: {
    backgroundColor: CivicNoirTheme.colors.pressedWash,
  },
  title: {
    ...CivicNoirTheme.typography.headlineMd,
    fontSize: 20,
    color: CivicNoirTheme.colors.primary,
    flexShrink: 1,
  },
});
