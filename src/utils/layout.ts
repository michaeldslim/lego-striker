import { FIELD } from '../constants/game';

/** 측면 뷰 축구 필드 목표 가로:세로 비율 */
const FIELD_ASPECT = 2.0;
/** 보드 영역 안쪽 여백 (px) */
const BOARD_INSET = 10;

export interface BoardLayout {
  width: number;
  height: number;
}

/** 가용 영역 안에 반드시 들어가도록 크기 계산 */
export function computeBoardLayout(availableWidth: number, availableHeight: number): BoardLayout {
  const maxW = Math.max(0, availableWidth - BOARD_INSET * 2);
  const maxH = Math.max(0, availableHeight - BOARD_INSET * 2);

  let width = maxW;
  let height = width / FIELD_ASPECT;

  if (height > maxH) {
    height = maxH;
    width = height * FIELD_ASPECT;
  }

  return {
    width: Math.max(0, Math.floor(width)),
    height: Math.max(0, Math.floor(height)),
  };
}

export function isLandscapeLayout(width: number, height: number): boolean {
  return width > height;
}

export function getGoalZone(height: number, goalHeightRatio: number = FIELD.goalHeightRatio) {
  const goalHeight = height * goalHeightRatio;
  const goalTop = (height - goalHeight) / 2;
  return {
    top: goalTop,
    bottom: goalTop + goalHeight,
    width: FIELD.goalWidth,
  };
}
