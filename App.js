import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { ItemsProvider } from './src/context/ItemsContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

// Disable native screen container hiding on Web to prevent blank screens
if (Platform.OS === 'web') {
  enableScreens(false);
}

// Inject strict viewport height CSS for React Native Web browser preview
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.setAttribute('id', 'rn-web-root-styles');
  styleEl.textContent = `
    html, body, #root, #root > div {
      height: 100% !important;
      min-height: 100vh !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      background-color: #F8FAFC !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
    }
  `;
  if (!document.getElementById('rn-web-root-styles')) {
    document.head.appendChild(styleEl);
  }
}

export default function App() {
  return (
    <View style={styles.outerContainer}>
      <SafeAreaProvider style={styles.container}>
        <ItemsProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </ItemsProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
  },
});
