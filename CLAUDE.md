# CLAUDE.md

When in doubt, ask.

## Project
Makemova helps designers learning through real projects — career switchers, practicing designers and working designers — get critique on one design decision, compare directions, revise, and save the reasoning, without leaving the creative flow.

## Stack
Expo SDK 58 + React Native 0.88 (React 19.3), TypeScript 6, Expo Router 58, NativeWind 4.2 (Tailwind 3.4), Supabase (Auth, Postgres, Storage) via supabase-js 2.119. Ask before substituting anything.
- Screens: `/app` (Expo Router). Components: `/components`, one per file, named exactly as in Figma.
- Supabase client and helpers: `/lib`. Migrations: `/supabase/migrations`.

## Design
Geometric crew: neutral paper surface, one Mate orange primary action, one support accent per task.
- Tokens: `tokens.ts`, wired into NativeWind through `tailwind.config.js`.
- Figma: https://www.figma.com/design/UuEYecRg6qlABoTEfxn2Qk/AI-Studio--Team-6 (Week 8 · Hi-fi + design system).

## Rules
1. Match the Figma exactly.
2. Tokens only, never a raw hex, px value or font name outside `tokens.ts`.
3. Every screen handles empty, loading and error.
4. No query returns another member's individual answers. Code that does is a bug, not a feature.
5. `docs/state-matrix.md` is the source of truth for component states.
6. Component props mirror Figma properties: Figma `Status notice / Saved` is `<StatusNotice state="saved" />`.
7. Sentence case for all UI text.

## Don't
- No new dependencies without asking.
- No dark mode in v1.
- No renaming tokens.
- v1 cuts: mentor support, cohorts, grades, social feed.

## Don't touch
The `.env` file, production keys, token names. The Supabase secret key never appears in `/app`, `/components` or `/lib`; if you see it there, stop and tell me.
