import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CivicNoirTheme } from '../../constants/theme';
import { pressFeedback } from './haptics';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  icon?: keyof typeof MaterialIcons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function NoirButton({ label, onPress, variant = 'primary', icon, loading, disabled, style }: Props) {
  const isPrimary = variant === 'primary';
  const inactive = disabled || loading;
  const contentColor = isPrimary ? CivicNoirTheme.colors.onPrimary : CivicNoirTheme.colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => {
        pressFeedback();
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        pressed && (isPrimary ? styles.primaryPressed : styles.ghostPressed),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={contentColor} />
      ) : (
        <View style={styles.row}>
          <Text style={[styles.label, { color: contentColor }]}>{label}</Text>
          {icon && <MaterialIcons name={icon} size={20} color={contentColor} />}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: CivicNoirTheme.colors.primary,
  },
  primaryPressed: {
    backgroundColor: CivicNoirTheme.colors.onSurface,
    transform: [{ scale: 0.99 }],
  },
  ghost: {
    borderWidth: 1,
    borderColor: CivicNoirTheme.colors.primary,
    backgroundColor: 'transparent',
  },
  ghostPressed: {
    backgroundColor: CivicNoirTheme.colors.pressedWash,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  label: {
    ...CivicNoirTheme.typography.labelSm,
    textTransform: 'uppercase',
  },
});
