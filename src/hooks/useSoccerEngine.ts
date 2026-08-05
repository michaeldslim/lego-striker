import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AI_FLICK_DELAY_MS,
  AIM_DIRECTION_MIN,
  GOAL_CELEBRATION_MS,
  GOALS_TO_WIN,
  MIN_CHARGE_MS,
  SAVE_MESSAGE_MS,
  SETTLE_THRESHOLD,
} from '../constants/game';
import { DEFAULT_PLAYER_COLORS, pickAiTeamColors } from '../constants/skins';
import { useGameFeedback } from './useGameFeedback';
import { gameMessages } from '../i18n/gameMessages';
import { TeamColors } from '../types/customize';
import {
  Ball,
  Character,
  FieldBounds,
  GamePhase,
  GameResult,
  GoalkeeperBar,
  SquadSize,
  Turn,
} from '../types/game';
import {
  computeAiFlick,
  createGkBars,
  createInitialBall,
  createInitialCharacters,
  findCharacterAt,
  getBoardSize,
  getFieldBounds,
  pickAiCharacter,
  resetAfterGoal,
} from '../utils/field';
import { getGkBarCenterY } from '../utils/gk';
import { allSettled, stepPhysics } from '../utils/physics';
import { computeAimPower, isAimCancelZone } from '../utils/power';

function clearAimState(s: SoccerState, message?: string | null): SoccerState {
  return {
    ...s,
    aimStart: null,
    aimCurrent: null,
    aimStartTime: null,
    aimDraggedOut: false,
    activeCharacterId: null,
    selectedId: null,
    message: message !== undefined ? message : s.message,
  };
}

export interface SoccerState {
  ball: Ball;
  characters: Character[];
  gkBars: GoalkeeperBar[];
  gkBarYs: Record<Turn, number>;
  playerGoals: number;
  aiGoals: number;
  turn: Turn;
  phase: GamePhase;
  isPlaying: boolean;
  isFinished: boolean;
  winner: Turn | null;
  selectedId: string | null;
  activeCharacterId: string | null;
  aimStart: { x: number; y: number } | null;
  aimCurrent: { x: number; y: number } | null;
  aimStartTime: number | null;
  aimDraggedOut: boolean;
  field: FieldBounds;
  boardSize: { width: number; height: number };
  squadSize: SquadSize;
  playerColors: TeamColors;
  aiColors: TeamColors;
  message: string | null;
  lastGoalScorer: 'player' | 'ai' | null;
}

function buildInitialState(
  viewWidth: number,
  viewHeight: number,
  squadSize: SquadSize,
  playerColors: TeamColors = DEFAULT_PLAYER_COLORS
): SoccerState {
  const boardSize = getBoardSize(viewWidth, viewHeight);
  const field = getFieldBounds(boardSize.width, boardSize.height);
  const gkBars = createGkBars(field);
  const aiColors = pickAiTeamColors(playerColors);
  return {
    ball: createInitialBall(field),
    characters: createInitialCharacters(field, squadSize, playerColors, aiColors),
    gkBars,
    gkBarYs: {
      player: getGkBarCenterY('player', field.goalZone, 0),
      ai: getGkBarCenterY('ai', field.goalZone, 0),
    },
    playerGoals: 0,
    aiGoals: 0,
    turn: 'player',
    phase: 'aiming',
    isPlaying: true,
    isFinished: false,
    winner: null,
    selectedId: null,
    activeCharacterId: null,
    aimStart: null,
    aimCurrent: null,
    aimStartTime: null,
    aimDraggedOut: false,
    field,
    boardSize,
    squadSize,
    playerColors,
    aiColors,
    message: null,
    lastGoalScorer: null,
  };
}

export function useSoccerEngine() {
  const { play: playFeedback } = useGameFeedback();
  const feedbackRef = useRef(playFeedback);
  feedbackRef.current = playFeedback;

  const [state, setState] = useState<SoccerState | null>(null);
  const rafRef = useRef<number | null>(null);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef(0);
  const lastTickRef = useRef<number | null>(null);
  const saveMessageRef = useRef(false);

  const startGame = useCallback(
    (
      viewWidth: number,
      viewHeight: number,
      squadSize: SquadSize = 2,
      playerColors: TeamColors = DEFAULT_PLAYER_COLORS
    ) => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    if (goalTimerRef.current) clearTimeout(goalTimerRef.current);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    elapsedRef.current = 0;
    lastTickRef.current = null;
    saveMessageRef.current = false;
    setState(buildInitialState(viewWidth, viewHeight, squadSize, playerColors));
  }, []);

  const runAiTurn = useCallback(() => {
    setState((s) => {
      if (!s || s.turn !== 'ai' || s.phase !== 'aiming' || !s.isPlaying || s.isFinished) return s;

      const aiChar =
        s.activeCharacterId != null
          ? s.characters.find((ch) => ch.id === s.activeCharacterId) ?? pickAiCharacter(s.characters, s.ball)
          : pickAiCharacter(s.characters, s.ball);
      const flick = computeAiFlick(aiChar, s.ball);
      const characters = s.characters.map((ch) =>
        ch.id === aiChar.id ? { ...ch, vx: flick.vx, vy: flick.vy } : ch
      );

      return {
        ...s,
        characters,
        phase: 'simulating',
        activeCharacterId: aiChar.id,
        selectedId: aiChar.id,
        message: gameMessages.aiTurnEllipsis(),
      };
    });
  }, []);

  // AI turn — wind-up 후 플릭
  useEffect(() => {
    if (!state || state.turn !== 'ai' || state.phase !== 'aiming' || !state.isPlaying || state.isFinished) {
      return;
    }

    const aiChar = pickAiCharacter(state.characters, state.ball);
    setState((s) => {
      if (!s || s.turn !== 'ai' || s.phase !== 'aiming') return s;
      return {
        ...s,
        activeCharacterId: aiChar.id,
        selectedId: aiChar.id,
        message: gameMessages.aiTurnEllipsis(),
      };
    });

    aiTimerRef.current = setTimeout(runAiTurn, AI_FLICK_DELAY_MS);
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [state?.turn, state?.phase, state?.isPlaying, state?.isFinished, runAiTurn]);

  // Physics + GK animation loop — phase 변경 시 루프가 끊기지 않도록 단일 루프 유지
  useEffect(() => {
    if (!state) return;

    let running = true;

    const tick = (now: number) => {
      if (!running) return;

      if (lastTickRef.current !== null) {
        elapsedRef.current += now - lastTickRef.current;
      }
      lastTickRef.current = now;
      const elapsed = elapsedRef.current;

      setState((s) => {
        if (!s || !s.isPlaying) return s;
        if (s.phase !== 'simulating' && s.phase !== 'aiming') return s;

        const gkBarYs = {
          player: getGkBarCenterY('player', s.field.goalZone, elapsed),
          ai: getGkBarCenterY('ai', s.field.goalZone, elapsed),
        };

        if (s.phase !== 'simulating') {
          return { ...s, gkBarYs };
        }

        const { ball, characters, goal, events } = stepPhysics(
          s.ball,
          s.characters,
          s.field,
          s.gkBars,
          elapsed
        );

        if (events.kicked) {
          feedbackRef.current('kick', { kickPower: events.kickPower });
        }
        if (events.wallBounce) {
          feedbackRef.current('wall');
        }
        if (events.charBump) {
          feedbackRef.current('char_bump');
        }

        if (events.saved) {
          feedbackRef.current('save');
          if (!saveMessageRef.current) {
            saveMessageRef.current = true;
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(() => {
              saveMessageRef.current = false;
              setState((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  message: prev.turn === 'player' ? gameMessages.yourTurn() : gameMessages.aiTurn(),
                };
              });
            }, SAVE_MESSAGE_MS);
          }
        }

        if (goal) {
          const playerGoals = goal === 'player' ? s.playerGoals + 1 : s.playerGoals;
          const aiGoals = goal === 'ai' ? s.aiGoals + 1 : s.aiGoals;
          const won = playerGoals >= GOALS_TO_WIN || aiGoals >= GOALS_TO_WIN;
          const winner = playerGoals >= GOALS_TO_WIN ? 'player' : aiGoals >= GOALS_TO_WIN ? 'ai' : null;

          feedbackRef.current(goal === 'player' ? 'goal' : 'goal_against');

          return {
            ...s,
            ball,
            characters,
            gkBarYs,
            playerGoals,
            aiGoals,
            phase: 'goalCelebration',
            isFinished: won,
            winner,
            message: goal === 'player' ? gameMessages.goal() : gameMessages.goalAgainst(),
            lastGoalScorer: goal,
            aimStart: null,
            aimCurrent: null,
            aimStartTime: null,
            aimDraggedOut: false,
            activeCharacterId: null,
            selectedId: null,
          };
        }

        if (allSettled(ball, characters)) {
          const nextTurn = s.turn === 'player' ? 'ai' : 'player';
          feedbackRef.current('turn');
          return {
            ...s,
            ball,
            characters,
            gkBarYs,
            phase: 'aiming',
            turn: nextTurn,
            message: events.saved
              ? gameMessages.save()
              : s.turn === 'player'
                ? gameMessages.aiTurn()
                : gameMessages.yourTurn(),
            aimStart: null,
            aimCurrent: null,
            aimStartTime: null,
            aimDraggedOut: false,
            activeCharacterId: null,
            selectedId: null,
          };
        }

        return {
          ...s,
          ball,
          characters,
          gkBarYs,
          message: events.saved ? gameMessages.save() : s.message,
        };
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = null;
    };
  }, [!!state]);

  // After goal celebration, reset positions
  useEffect(() => {
    if (!state || state.phase !== 'goalCelebration') return;

    goalTimerRef.current = setTimeout(() => {
      setState((s) => {
        if (!s) return s;
        if (s.isFinished) {
          return { ...s, phase: 'aiming', message: s.winner === 'player' ? gameMessages.victory() : gameMessages.defeat() };
        }
        const reset = resetAfterGoal(s.field, s.squadSize, s.playerColors, s.aiColors);
        const kickoffTeam = s.lastGoalScorer === 'player' ? 'ai' : 'player';
        return {
          ...s,
          ...reset,
          phase: 'aiming',
          turn: kickoffTeam,
          message: gameMessages.kickoff(),
          lastGoalScorer: null,
          aimStart: null,
          aimCurrent: null,
          aimStartTime: null,
          aimDraggedOut: false,
          activeCharacterId: null,
          selectedId: null,
        };
      });
    }, GOAL_CELEBRATION_MS);

    return () => {
      if (goalTimerRef.current) clearTimeout(goalTimerRef.current);
    };
  }, [state?.phase]);

  const onAimStart = useCallback((x: number, y: number) => {
    setState((s) => {
      if (!s || !s.isPlaying || s.isFinished || s.phase !== 'aiming' || s.turn !== 'player') return s;

      const ch = findCharacterAt(s.characters, x, y, 'player');
      if (!ch) return s;

      feedbackRef.current('select');

      return {
        ...s,
        selectedId: ch.id,
        activeCharacterId: ch.id,
        aimStart: { x, y },
        aimCurrent: { x, y },
        aimStartTime: Date.now(),
        aimDraggedOut: false,
        message: null,
      };
    });
  }, []);

  const onAimMove = useCallback((x: number, y: number) => {
    setState((s) => {
      if (!s || !s.aimStart || s.phase !== 'aiming') return s;

      const activeChar = s.characters.find((ch) => ch.id === s.activeCharacterId);
      let aimDraggedOut = s.aimDraggedOut;
      if (activeChar && !aimDraggedOut) {
        const dx = x - activeChar.x;
        const dy = y - activeChar.y;
        if (dx * dx + dy * dy >= AIM_DIRECTION_MIN * AIM_DIRECTION_MIN) {
          aimDraggedOut = true;
        }
      }

      return { ...s, aimCurrent: { x, y }, aimDraggedOut };
    });
  }, []);

  const onAimCancel = useCallback(() => {
    setState((s) => {
      if (!s || !s.aimStart || s.phase !== 'aiming') return s;
      feedbackRef.current('cancel');
      return clearAimState(s, gameMessages.yourTurn());
    });
  }, []);

  const onAimEnd = useCallback(() => {
    setState((s) => {
      if (!s || !s.aimStart || !s.aimCurrent || !s.activeCharacterId || !s.aimStartTime || s.phase !== 'aiming') {
        return s;
      }

      const activeChar = s.characters.find((ch) => ch.id === s.activeCharacterId);
      if (!activeChar) return s;

      if (isAimCancelZone(activeChar, s.aimCurrent, s.aimDraggedOut)) {
        feedbackRef.current('cancel');
        return clearAimState(s, gameMessages.yourTurn());
      }

      const elapsedMs = Date.now() - s.aimStartTime;
      if (elapsedMs < MIN_CHARGE_MS) {
        return clearAimState(s);
      }

      const { power, isSuper, angle } = computeAimPower(
        activeChar,
        s.aimCurrent,
        elapsedMs,
        s.ball,
        s.aimDraggedOut
      );

      if (power < SETTLE_THRESHOLD) {
        return clearAimState(s);
      }

      const vx = Math.cos(angle) * power;
      const vy = Math.sin(angle) * power;

      if (isSuper) {
        feedbackRef.current('super');
      } else {
        feedbackRef.current('flick');
      }

      const characters = s.characters.map((ch) =>
        ch.id === s.activeCharacterId ? { ...ch, vx, vy } : ch
      );

      return {
        ...s,
        characters,
        phase: 'simulating',
        aimStart: null,
        aimCurrent: null,
        aimStartTime: null,
        aimDraggedOut: false,
        message: null,
      };
    });
  }, []);

  const getResult = useCallback((): GameResult => ({
    playerGoals: state?.playerGoals ?? 0,
    aiGoals: state?.aiGoals ?? 0,
    won: state?.winner === 'player',
  }), [state?.playerGoals, state?.aiGoals, state?.winner]);

  return {
    state,
    startGame,
    onAimStart,
    onAimMove,
    onAimEnd,
    onAimCancel,
    getResult,
  };
}
