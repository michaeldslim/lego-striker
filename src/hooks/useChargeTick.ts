import { useEffect, useState } from 'react';

/** 홀드 차징 중 매 프레임 리렌더 (게이지 애니메이션) */
export function useChargeTick(active: boolean): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;

    let raf: number;
    const tick = () => {
      setNow(Date.now());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [active]);

  return now;
}
