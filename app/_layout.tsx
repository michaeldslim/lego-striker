import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScreenBackground } from '../src/components/ScreenBackground';
import { useLandscapeLock } from '../src/hooks/useLandscapeLock';
import { colors } from '../src/constants/theme';

export default function RootLayout() {
  const ready = useLandscapeLock();

  if (!ready) {
    return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <ScreenBackground>
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={colors.neonCyan} />
            </View>
          </ScreenBackground>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" hidden />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
          }}
        />
      </GestureHandlerRootView>
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
