// client/src/engine/decisionMode.js

import { runSimulation } from './monteCarlo.js'
import { SAFE_RISK_THRESHOLD } from './thresholds.js'

// ─── Can I Afford This? ────────────────────────────────────
// Returns before/after comparison when a one-time cost is applied

export function canIAffordThis(profile, scenarios = [], oneTimeCost = 0) {
  if (!profile) return null
  if (oneTimeCost <= 0) return null

  // run baseline simulation
  const before = runSimulation(profile, scenarios)

  // deduct one-time cost from savings and rerun
  const adjustedProfile = {
    ...profile,
    savings: Math.max(profile.savings - oneTimeCost, 0),
  }
  const after = runSimulation(adjustedProfile, scenarios)

  return {
    before: {
      riskPercent: before.riskPercent,
      survivalMonths: before.survivalMonths,
    },
    after: {
      riskPercent: after.riskPercent,
      survivalMonths: after.survivalMonths,
    },
    riskDelta: after.riskPercent - before.riskPercent,
    survivalDelta:
      Math.round((after.survivalMonths - before.survivalMonths) * 10) / 10,
  }
}

// ─── How Much Should I Save? ───────────────────────────────
// Reverse-calculates the savings target needed to drop
// risk below SAFE_RISK_THRESHOLD (20%)

export function howMuchToSave(profile, scenarios = []) {
  if (!profile) return null

  // run once and cache — do not run again for currentRisk
  const initialResult = runSimulation(profile, scenarios)

  if (initialResult.riskPercent <= SAFE_RISK_THRESHOLD) {
    return {
      currentRisk: initialResult.riskPercent,
      targetRisk: initialResult.riskPercent,
      alreadySafe: true,
      targetSavings: profile.savings,
      additionalSavingsNeeded: 0,
    }
  }

  // increment savings by $500 per step until risk drops below threshold
  // capped at 100 iterations ($50,000 search range) to prevent freeze
  let testSavings = profile.savings
  let result = initialResult
  const MAX_STEPS = 100
  let steps = 0

  while (
    result.riskPercent > SAFE_RISK_THRESHOLD &&
    steps < MAX_STEPS
  ) {
    testSavings += 500
    result = runSimulation(
      { ...profile, savings: testSavings },
      scenarios
    )
    steps++
  }

  return {
    currentRisk: initialResult.riskPercent,   // from cached run
    targetRisk: result.riskPercent,
    alreadySafe: false,
    targetSavings: testSavings,
    additionalSavingsNeeded: testSavings - profile.savings,
    monthsToSaveAt400: Math.ceil(
      (testSavings - profile.savings) / 400
    ),
    monthsToSaveAt200: Math.ceil(
      (testSavings - profile.savings) / 200
    ),
  }
}