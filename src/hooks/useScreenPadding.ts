import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../constants/theme';

/** 갤럭시 등 Android 곡면·제스처 영역 최소 여백 */
const ANDROID_MIN_INSET = 12;

export function useScreenPadding() {
  const insets = useSafeAreaInsets();
  const minInset = Platform.OS === 'android' ? ANDROID_MIN_INSET : 8;

  return {
    paddingTop: Math.max(insets.top, minInset) + spacing.xs,
    paddingBottom: Math.max(insets.bottom, minInset) + spacing.xs,
    paddingLeft: Math.max(insets.left, minInset) + spacing.sm,
    paddingRight: Math.max(insets.right, minInset) + spacing.sm,
  };
}
