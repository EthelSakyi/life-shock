// client/src/engine/scenarioTransforms.js

export function buildShockParams(scenarios = [], profile) {
  const params = {
    incomeLossPercent: 0,
    monthlyExpenseIncrease: 0,
    lumpSumCost: 0,
    shockDurationMonths: 0,
    recoveryMonths: 0,
    ongoingExpenseIncrease: 0,
  }

  if (!scenarios || scenarios.length === 0) {
    return params
  }

  for (const scenario of scenarios) {
    switch (scenario.id) {

      case 'job_loss':
        params.incomeLossPercent += 1.0
        params.monthlyExpenseIncrease += profile.expenses * 0.10
        params.shockDurationMonths = Math.max(
          params.shockDurationMonths,
          scenario.durationMonths ?? 3
        )
        params.recoveryMonths = Math.max(params.recoveryMonths, 2)
        break

      case 'medical_emergency':
        params.lumpSumCost += scenario.cost ?? 10000
        params.incomeLossPercent += 0.30
        params.shockDurationMonths = Math.max(
          params.shockDurationMonths,
          2
        )
        break

      case 'car_breakdown':
        params.lumpSumCost += scenario.cost ?? 2000
        break

      case 'rate_increase':
        params.ongoingExpenseIncrease +=
          profile.expenses * ((scenario.increasePercent ?? 20) / 100)
        break

      case 'new_baby':
        params.ongoingExpenseIncrease += 1200
        params.incomeLossPercent += 0.20
        params.shockDurationMonths = Math.max(
          params.shockDurationMonths,
          3
        )
        break

      default:
        break
    }
  }

  return params
}