import { Alert, Platform } from 'react-native';

export const customAlert = (title, message, buttons) => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    if (!buttons || buttons.length === 0) {
      window.alert(`${title}${message ? '\n\n' + message : ''}`);
      return;
    }

    const hasCancel = buttons.some((b) => b.style === 'cancel');
    const confirmButton = buttons.find((b) => b.style !== 'cancel') || buttons[0];
    const cancelButton = buttons.find((b) => b.style === 'cancel');

    if (hasCancel) {
      const confirmed = window.confirm(`${title}${message ? '\n\n' + message : ''}`);
      if (confirmed && confirmButton && confirmButton.onPress) {
        confirmButton.onPress();
      } else if (!confirmed && cancelButton && cancelButton.onPress) {
        cancelButton.onPress();
      }
    } else {
      window.alert(`${title}${message ? '\n\n' + message : ''}`);
      if (confirmButton && confirmButton.onPress) {
        confirmButton.onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};
