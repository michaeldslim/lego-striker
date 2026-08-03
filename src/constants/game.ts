export const BALL_RADIUS = 14;
export const CHARACTER_RADIUS = 22;

// 캐릭터: 빠르게 감속 (플릭 후 곧 멈춤)
export const CHAR_FRICTION = 0.91;
export const CHAR_MIN_SPEED = 0.5;

// 공: 킥 후 굴러가다 저속에서 빠르게 멈춤
export const BALL_FRICTION = 0.982;
/** 이 속도 이하면 즉시 정지 */
export const BALL_MIN_SPEED = 0.5;
/** 이 속도 이하부터 추가 감속 (꼬리 미끄러짐 방지) */
export const BALL_LOW_SPEED = 3.2;
export const BALL_LOW_SPEED_FRICTION = 0.86;

export const MIN_SPEED = 0.35; // legacy compat
export const MAX_POWER = 26;
/** 파워 게이지 0→1→0 왕복 주기 (ms) */
export const CHARGE_CYCLE_MS = 2200;
/** 이 시간 미만 홀드 후 떼면 슛 취소 */
export const MIN_CHARGE_MS = 80;
/** 손가락이 캐릭터 중심 이 반경 안이면 취소 모드 */
export const CANCEL_AIM_RADIUS = 36;
/** 이 거리 이상 벗어나야 손가락 방향으로 조준 (그 미만은 공 방향 기본) */
export const AIM_DIRECTION_MIN = 42;
export const SETTLE_THRESHOLD = 0.4;
/** 이 비율 이상이면 수퍼 파워 (0~1) */
export const SUPER_POWER_RATIO = 0.82;

/** 캐릭터→공 전달 계수 (1보다 크면 킥이 더 강하게 느껴짐) */
export const KICK_TRANSFER = 1.75;
/** 킥으로 인정할 최소 캐릭터 속도 */
export const MIN_KICK_SPEED = 1.2;
/** 킥 후 캐릭터 속도 잔여 비율 */
export const CHAR_STOP_ON_KICK = 0.08;

export const GOALS_TO_WIN = 3;
export const DEFAULT_SQUAD_SIZE = 2 as const;
export const LEADERBOARD_SIZE = 10;
export const GOAL_CELEBRATION_MS = 1200;
export const AI_FLICK_DELAY_MS = 600;

export const TEAM_COLORS = {
  player: { shirt: '#00b4d8', pants: '#0077b6', skin: '#f4c49c' },
  ai: { shirt: '#e63946', pants: '#9d0208', skin: '#f4c49c' },
} as const;

export const FIELD = {
  heightRatio: 0.58,
  goalHeightRatio: 0.38,
  goalWidth: 14,
  wallPadding: 0,
} as const;

/** 골키퍼 막대 */
export const GK_BAR_THICKNESS = 12;
export const GK_BAR_LENGTH_RATIO = 0.75;
/** 골키퍼 막대 왕복 주기 (양쪽 동일) */
export const GK_BAR_PERIOD_MS = 1100;
export const GK_BOUNCE = 0.65;
export const SAVE_MESSAGE_MS = 900;
