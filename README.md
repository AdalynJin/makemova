# Makemova

A guided design-learning app. A learner brings one screen, asks about one design decision, compares two directions, revises, and saves the reasoning. Four stages: Brief, Make, Revise, Reflect.

## How might we

How might we create a more connected, project-based learning experience where designers can build confidence in their decisions and learn unfamiliar tools without leaving the creative flow?

Who it serves:

- Career and major switchers who need a guided first project.
- Practicing designers who are stuck on a decision and need direction.
- Working designers expanding a skill inside real project work.

## Stack

- Expo + React Native, TypeScript, Expo Router
- NativeWind for styling, driven by `tokens.ts`
- Supabase: Auth, Postgres, Storage

Design source: Figma, Team 6, Week 8 "Makemova / Geometric crew".

## How we work

- `main` always runs. Never commit straight to it.
- One branch per feature: `feature/<short-name>`.
- Every merge goes through a pull request with one review from your teammate. Yes, even with two people.
- Pull requests use the template: what changed, why, screenshots.
- If it is not in the repo, it does not exist. Figma is for the design; the repo is for the product.
