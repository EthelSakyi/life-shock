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

function shuffleAndSlice(arr, count) {
  return [...arr]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, arr.length))
}

function samplePaths(allPaths, count) {
  const ruined   = allPaths.filter(p => p[p.length - 1] === 0)
  const survived = allPaths.filter(p => p[p.length - 1] > 0)
  const ruinRatio    = ruined.length / allPaths.length
  const ruinSample   = Math.round(count * ruinRatio)
  const surviveSample = count - ruinSample
  return [
    ...shuffleAndSlice(ruined,   ruinSample).map(path   => ({ path, survived: false })),
    ...shuffleAndSlice(survived, surviveSample).map(path => ({ path, survived: true })),
  ]
}

function runSingleIteration(profile, shockParams) {
  // ── Coerce ALL profile fields to numbers ──────────────────
  // localStorage stores everything as strings — this prevents
  // string/number arithmetic bugs throughout the engine
  const income   = Number(profile.income)   || 0
  const expenses = Number(profile.expenses) || 0
  const savings  = Number(profile.savings)  || 0
  const debt     = Number(profile.debt)     || 0  // eslint-disable-line no-unused-vars

  const ruinThreshold = expenses * RUIN_THRESHOLD_MULTIPLIER

  const {
    incomeLossPercent,
    monthlyExpenseIncrease,
    lumpSumCost,
    shockDurationMonths,
    recoveryMonths,
    ongoingExpenseIncrease,
  } = shockParams

  const thisRecovery = recoveryMonths > 0
    ? randomIntBetween(RECOVERY_MIN_MONTHS, RECOVERY_MAX_MONTHS)
    : 0
  const totalShockWindow = shockDurationMonths + thisRecovery

  let currentSavings = savings - lumpSumCost
  const path = []
  let ruinMonth = null

  for (let month = 1; month <= MONTHS; month++) {
    const inShock    = month <= shockDurationMonths
    const inRecovery = month > shockDurationMonths && month <= totalShockWindow

    const effectiveIncomeLoss = inShock
      ? incomeLossPercent
      : inRecovery ? incomeLossPercent * 0.75 : 0

    const monthlyIncome   = income * (1 - effectiveIncomeLoss)
    const variance        = randomBetween(1 - EXPENSE_VARIANCE, 1 + EXPENSE_VARIANCE)
    const shockExpenseAdd = inShock ? monthlyExpenseIncrease : 0
    const monthlyExpenses = (expenses * variance) + shockExpenseAdd + ongoingExpenseIncrease

    currentSavings += monthlyIncome - monthlyExpenses
    path.push(Math.max(currentSavings, 0))

    if (currentSavings <= ruinThreshold && ruinMonth === null) {
      ruinMonth = month
    }
  }

  return { path, ruinMonth }
}

export function runSimulation(profile, scenarios = []) {
  if (!profile) {
    console.error('runSimulation: profile is required')
    return { riskPercent: 0, survivalMonths: 12, paths: [], ruinThreshold: 0 }
  }

  const shockParams = buildShockParams(scenarios, profile)
  const allPaths  = []
  const ruinMonths = []
  let ruinCount   = 0

  for (let i = 0; i < ITERATIONS; i++) {
    const { path, ruinMonth } = runSingleIteration(profile, shockParams)
    allPaths.push(path)
    if (ruinMonth !== null) {
      ruinCount++
      ruinMonths.push(ruinMonth)
    } else {
      ruinMonths.push(MONTHS + 1)
    }
  }

  const sampledPaths   = samplePaths(allPaths, PATHS_TO_SAMPLE)
  const riskPercent    = Math.round((ruinCount / ITERATIONS) * 100)
  const rawMedian      = median(ruinMonths)
  const survivalMonths = rawMedian > MONTHS ? MONTHS : Math.round(rawMedian * 10) / 10

  return {
    riskPercent,
    survivalMonths,
    paths: sampledPaths,
    ruinThreshold: Number(profile.expenses) * RUIN_THRESHOLD_MULTIPLIER,
  }
}