import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../src/i18n';
import { BackgroundMusic } from '../src/components/BackgroundMusic';
import { ScreenBackground } from '../src/components/ScreenBackground';
import { SettingsProvider } from '../src/contexts/SettingsContext';
import { useLandscapeLock } from '../src/hooks/useLandscapeLock';
import { colors } from '../src/constants/theme';

export default function RootLayout() {
  const ready = useLandscapeLock();

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <GestureHandlerRootView style={styles.root}>
          <BackgroundMusic />
          {!ready ? (
            <ScreenBackground>
              <View style={styles.loader}>
                <ActivityIndicator size="large" color={colors.neonCyan} />
              </View>
            </ScreenBackground>
          ) : (
            <>
              <StatusBar style="light" hidden />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.background },
                  animation: 'fade',
                }}
              />
            </>
          )}
        </GestureHandlerRootView>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
