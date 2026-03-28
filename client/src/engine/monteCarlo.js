// client/src/engine/monteCarlo.js

import {
  ITERATIONS,
  MONTHS,
  PATHS_TO_SAMPLE,
  EXPENSE_VARIANCE,
  RUIN_THRESHOLD_MULTIPLIER,
  RECOVERY_MIN_MONTHS,
  RECOVERY_MAX_MONTHS,
} from './thresholds.js'

import { buildShockParams } from './scenarioTransforms.js'

// ─── Helpers ───────────────────────────────────────────────

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

function randomIntBetween(min, max) {
  return Math.floor(randomBetween(min, max + 1))
}

function median(arr) {
  if (!arr || arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

// ─── Path Sampling ─────────────────────────────────────────
// Defined BEFORE runSimulation and runSingleIteration to avoid
// any reference errors

function shuffleAndSlice(arr, count) {
  return [...arr]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, arr.length))
}

function samplePaths(allPaths, count) {
  const ruined = allPaths.filter(
    p => p[p.length - 1] === 0
  )
  const survived = allPaths.filter(
    p => p[p.length - 1] > 0
  )

  // proportional sample — preserve red/green ratio in chart
  const ruinRatio = ruined.length / allPaths.length
  const ruinSample = Math.round(count * ruinRatio)
  const surviveSample = count - ruinSample

  const sampledRuined = shuffleAndSlice(ruined, ruinSample)
  const sampledSurvived = shuffleAndSlice(survived, surviveSample)

  return [
    ...sampledRuined.map(path => ({ path, survived: false })),
    ...sampledSurvived.map(path => ({ path, survived: true })),
  ]
}

// ─── Single Simulation Run ─────────────────────────────────

function runSingleIteration(profile, shockParams) {
  const { income, expenses, savings, debt = 0 } = profile
  const ruinThreshold = expenses * RUIN_THRESHOLD_MULTIPLIER

  const {
    incomeLossPercent,
    monthlyExpenseIncrease,
    lumpSumCost,
    shockDurationMonths,
    recoveryMonths,
    ongoingExpenseIncrease,
  } = shockParams

  // randomize recovery duration for this iteration
  const thisRecovery = recoveryMonths > 0
    ? randomIntBetween(RECOVERY_MIN_MONTHS, RECOVERY_MAX_MONTHS)
    : 0

  const totalShockWindow = shockDurationMonths + thisRecovery

  // lump sum costs hit savings immediately on month 0
  let currentSavings = savings - lumpSumCost
  const path = []
  let ruinMonth = null

  for (let month = 1; month <= MONTHS; month++) {
    const inShock = month <= shockDurationMonths
    const inRecovery = (
      month > shockDurationMonths &&
      month <= totalShockWindow
    )

    // income this month
    const effectiveIncomeLoss = inShock
      ? incomeLossPercent
      : inRecovery
        ? incomeLossPercent * 0.75   // partial income during recovery
        : 0

    const monthlyIncome = income * (1 - effectiveIncomeLoss)

    // expenses with randomized variance
    const variance = randomBetween(
      1 - EXPENSE_VARIANCE,
      1 + EXPENSE_VARIANCE
    )
    const shockExpenseAdd = inShock ? monthlyExpenseIncrease : 0
    const monthlyExpenses =
      (expenses * variance) +
      shockExpenseAdd +
      ongoingExpenseIncrease 

    // update savings
    const netFlow = monthlyIncome - monthlyExpenses
    currentSavings += netFlow

    // record path value floored at 0 for chart display
    // note: currentSavings itself continues below 0
    // so ruin detection on the real value still works correctly
    path.push(Math.max(currentSavings, 0))

    // record first month ruin occurs
    if (currentSavings <= ruinThreshold && ruinMonth === null) {
      ruinMonth = month
    }
  }

  return { path, ruinMonth }
}

// ─── Main Export ───────────────────────────────────────────

export function runSimulation(profile, scenarios = []) {
  if (!profile) {
    console.error('runSimulation: profile is required')
    return {
      riskPercent: 0,
      survivalMonths: 12,
      paths: [],
      ruinThreshold: 0,
    }
  }

  const shockParams = buildShockParams(scenarios, profile)

  const allPaths = []
  const ruinMonths = []
  let ruinCount = 0

  for (let i = 0; i < ITERATIONS; i++) {
    const { path, ruinMonth } = runSingleIteration(profile, shockParams)
    allPaths.push(path)

    if (ruinMonth !== null) {
      ruinCount++
      ruinMonths.push(ruinMonth)
    } else {
      // survived full window — push beyond range for median calc
      ruinMonths.push(MONTHS + 1)
    }
  }

  const sampledPaths = samplePaths(allPaths, PATHS_TO_SAMPLE)
  const riskPercent = Math.round((ruinCount / ITERATIONS) * 100)

  const rawMedian = median(ruinMonths)
  const survivalMonths = rawMedian > MONTHS
    ? MONTHS
    : Math.round(rawMedian * 10) / 10

  return {
    riskPercent,
    survivalMonths,
    paths: sampledPaths,
    ruinThreshold: profile.expenses * RUIN_THRESHOLD_MULTIPLIER,
  }
}