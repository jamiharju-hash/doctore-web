export const DECISION_STATES = ['PLAY', 'AVOID', 'WAIT'] as const

export type DecisionState = (typeof DECISION_STATES)[number]

export type RiskRating = 'Low' | 'Medium' | 'Elevated' | 'High' | 'Unclear'

export type ConfidenceLabel = 'Low' | 'Moderate' | 'Strong' | 'Very Strong' | 'Insufficient'
