import React, { useState } from 'react';
import { KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CivicNoirTheme } from '../../constants/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  error?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
};

export function NoirInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  secure,
  keyboardType,
  autoCapitalize = 'none',
  multiline,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);

  const borderColor = error
    ? CivicNoirTheme.colors.danger
    : focused
      ? CivicNoirTheme.colors.primary
      : CivicNoirTheme.colors.outline;

  return (
    <View style={styles.group}>
      <Text style={[styles.label, error ? styles.labelError : null]}>{label}</Text>
      <View style={[styles.wrapper, { borderColor }, focused && styles.wrapperFocused]}>
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={CivicNoirTheme.colors.outline}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
        />
        {secure ? (
          <Pressable
            onPress={() => setHidden(!hidden)}
            hitSlop={12}
            style={styles.icon}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            <MaterialIcons
              name={hidden ? 'visibility-off' : 'visibility'}
              size={22}
              color={focused ? CivicNoirTheme.colors.primary : CivicNoirTheme.colors.outline}
            />
          </Pressable>
        ) : (
          icon && (
            <MaterialIcons
              name={icon}
              size={22}
              color={focused ? CivicNoirTheme.colors.primary : CivicNoirTheme.colors.outline}
              style={styles.icon}
            />
          )
        )}
      </View>
      {!!error && (
        <View style={styles.errorRow}>
          <MaterialIcons name="error-outline" size={14} color={CivicNoirTheme.colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },
  label: {
    ...CivicNoirTheme.typography.labelSm,
    color: CivicNoirTheme.colors.primary,
    textTransform: 'uppercase',
  },
  labelError: {
    color: CivicNoirTheme.colors.danger,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: CivicNoirTheme.colors.surfaceContainerLowest,
  },
  wrapperFocused: {
    borderWidth: 2,
    margin: -1,
  },
  input: {
    flex: 1,
    padding: 16,
    minHeight: 54,
    ...CivicNoirTheme.typography.bodyMd,
    color: CivicNoirTheme.colors.primary,
  },
  inputMultiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  icon: {
    marginRight: 16,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {
    fontFamily: CivicNoirTheme.typography.bodyMd.fontFamily,
    fontSize: 13,
    color: CivicNoirTheme.colors.danger,
  },
});
