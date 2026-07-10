import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/** Light tap feedback for presses. No-op on web. */
export function pressFeedback() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
}

/** Success notification feedback. No-op on web. */
export function successFeedback() {
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }
}
