# Lego Striker

A **2D side-view flick soccer** game built with Expo and React Native. Flick Lego minifigures to kick the ball, dodge moving goalkeeper bars, and score on the opponent's goal in a turn-based casual match against AI.

Inspired by the classic **Football Striker** flick mechanics — hold to charge power, aim your shot, and watch the physics play out until the ball stops.

## Features

- **Turn-based gameplay** — first team to **3 goals** wins
- **Football Striker–style physics** — flick characters, momentum transfer to the ball, friction-based rolling
- **Hold charging & aiming** — oscillating power gauge (0→1→0), finger drag for direction, cancel zone
- **Goalkeeper bars** — horizontal bars slide inside each goal and deflect the ball
- **Squad size** — play with **2 or 3** players per team
- **Customization**
  - Team uniform colors (shirt & pants)
  - **3 ball skins** — Legacy, PL, World Cup
  - **12 countries** — flag watermark on your side of the field
- **Local leaderboard** — match history stored on device
- **Haptic feedback** — kicks, goals, saves, and more
- **Landscape gameplay** — game and result screens lock to landscape

## How to Play

1. **Touch & hold** your minifigure to start charging.
2. **Power** oscillates on a cycle — release at the strength you want. Hit the **SUPER** zone for a golden max shot.
3. **Aim** by dragging your finger away from the character (42px+). Return to the character after aiming to **cancel**.
4. On release, your character flicks toward the ball. When they collide, momentum transfers to the ball.
5. The turn ends when the ball stops rolling. Then the AI takes its turn.
6. Score in the opponent's goal (right side). Avoid their moving goalkeeper bar.

## Screens

| Screen | Description |
|--------|-------------|
| **Home** | Squad size, uniform colors, ball skin, country picker, kick off |
| **Game** | Side-view field, HUD, power gauge, AI opponent |
| **Result** | Win / loss summary after a match |
| **Leaderboard** | Local match history |

## Getting Started

### Install & run

```bash
git clone https://github.com/michaeldslim/lego-striker.git
cd lego-striker
npm install
npm start
```

From the Expo dev server:

- Press **i** for iOS simulator
- Press **a** for Android emulator
- Scan the QR code with **Expo Go** on your phone

### Native development builds

```bash
# Generate native projects (if needed)
npm run prebuild

# Run on simulator / emulator
npm run ios
npm run android

# Run on a connected device
npm run ios:device
npm run android:device
```

### Other scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run start:clear` | Start with cleared Metro cache |
| `npm run web` | Start web bundler |
| `npm run prebuild:clean` | Regenerate native projects from scratch |

## Building with EAS

This project is configured for [EAS Build](https://docs.expo.dev/build/introduction/). Profiles are defined in `eas.json`:

| Profile | Use |
|---------|-----|
| `development` | Dev client, internal distribution |
| `preview` | Internal preview builds |
| `production` | Production builds |

```bash
eas build --platform android --profile production
eas build --platform android --profile development
eas build --platform android --profile preview
```

### EAS Update (OTA)

Ship **JavaScript / asset changes** without a new store build. Native code or `app.json` plugin changes still require a new `eas build`.

This app uses `runtimeVersion: "1.9.0"` in `app.json` — updates only apply to builds with the **same runtime version**.

| Build profile | Update channel |
|---------------|----------------|
| `development` | `development` |
| `production`  | `production`  |
| `preview`     | (no channel set — assign one in `eas.json` or pass `--channel` explicitly) |

```bash
# Publish to production channel (apps built with --profile production)
eas update --channel production --message "fix: adjust kick power tuning"

# Publish to development channel (dev client builds)
eas update --channel development --message "feat: tweak HUD layout"

# Publish to both platforms in one command
eas update --channel production --platform all --message "chore: copy updates"

# List recent updates on a channel
eas update:list --channel production

# View details for a specific update group
eas update:view <update-group-id>
```

**Typical flow**

1. Build once: `eas build --platform android --profile production`
2. Install the APK on test devices.
3. Change JS/TS only → `eas update --channel production --message "..."`.
4. Restart the app (or relaunch) — the new bundle downloads on next launch.

**When you need a new build instead of an update**

- Bump `runtimeVersion` in `app.json` (e.g. after adding a native module).
- Change native dependencies, `app.json` plugins, icons, or splash assets that require prebuild.
