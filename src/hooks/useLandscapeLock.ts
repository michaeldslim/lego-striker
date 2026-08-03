import { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

/** 앱 전체 가로 고정 (가로 게임 전용) */
export function useLandscapeLock(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      if (mounted) setReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return ready;
}
