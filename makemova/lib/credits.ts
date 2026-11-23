/**
 * Credit balance shown in the app nav, Credits & usage and Plans.
 * Static for now: the Week 8 Refined frames show a Studio member with 368 of 400 credits left.
 * There is no credits table or billing yet; replace this with the member's own balance when there is.
 */
export const credits = {
  plan: 'Studio',
  allowance: 400,
  remaining: 368,
  requests: 6,
  resets: '1 Nov',
} as const;
