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

/** 커브 슛 — 높은 파워 + 손가락 수직 오프셋 (조준 각도와 분리) */
export const CURVE_MIN_POWER_RATIO = 0.68;
/** 캐릭터 중심에서 손가락 y 오프셋이 이 값 이상이면 커브 가능 */
export const CURVE_AIM_MIN_DY = 8;
/** 이 오프셋에서 커브 강도 최대 */
export const CURVE_AIM_MAX_DY = 40;
/** |dx| > |dy| × 이 값일 때만 손가락 방향으로 조준 (그 외 공 방향 유지) */
export const FLICK_HORIZONTAL_BIAS = 0.85;
/** 수평 조준 시 손가락 수직 성분이 플릭 각도에 미치는 비율 (커브는 별도) */
export const FLICK_VERTICAL_DAMP = 0.2;
/** 킥 직후 공에 더하는 초기 수직 속도 (방향 × 강도 × 값) */
export const CURVE_INITIAL_VY = 7;
/** 커브 지속 시간 (ms) */
export const CURVE_DURATION_MS = 600;
/** 커브 중 수직 가속 — deltaMs로 스케일 */
export const CURVE_FORCE = 0.72;
/** 비행 궤적 점 개수 */
export const CURVE_TRAIL_LENGTH = 10;

/** AI 커브 — 난이도별 확률 (강한 슛일 때만) */
export const AI_CURVE_CHANCE = {
  easy: 0,
  normal: 0.22,
  hard: 0.45,
} as const;
/** 이 파워 이상일 때 AI 커브 후보 */
export const AI_CURVE_MIN_POWER = 13;

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
