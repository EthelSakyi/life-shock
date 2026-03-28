/**
 * Builds the prompt sent to Claude for the Verdict Card.
 * Uses anonymized summary â€” no raw PII beyond first name.
 */
export function buildVerdictPrompt({ profile, activeScenarios, riskPercent, survivalMonths }) {
  const scenarioLines = activeScenarios.length
    ? activeScenarios.map((s) => {
        if (s.id === 'job_loss')          return `Job Loss (${s.durationMonths ?? '?'} months)`
        if (s.id === 'medical_emergency') return `Medical Emergency ($${Number(s.cost ?? 0).toLocaleString()})`
        if (s.id === 'car_breakdown')     return `Auto Emergency ($${Number(s.cost ?? 0).toLocaleString()})`
        if (s.id === 'rate_increase')     return `Monthly Bill Increase (+$${Number(s.increaseAmount ?? 0).toLocaleString()}/mo)`
        if (s.id === 'new_baby')          return `Expecting a Child`
        return s.id
      }).join(', ')
    : 'None'

  const trajectory = riskPercent > 60 ? 'declining rapidly'
    : riskPercent > 30 ? 'under pressure'
    : 'stable'

  return {
    system: `You are a financial wellness assistant helping everyday people understand their financial resilience. 
Write in plain English. No jargon. No percentages in your response â€” translate numbers into plain language. 
Keep it to 2â€“3 sentences. End with one concrete, specific, actionable recommendation.
Be empathetic but direct. Never say "I" or "As an AI".`,

    user: `Name: ${profile.name}
Profile: $${Number(profile.income).toLocaleString()}/month income, $${Number(profile.expenses).toLocaleString()}/month expenses, $${Number(profile.savings).toLocaleString()} savings, $${Number(profile.debt || 0).toLocaleString()}/month debt, ${profile.employment}
Active scenarios: ${scenarioLines}
Risk: ${riskPercent}%
Survival time: ${Number(survivalMonths).toFixed(1)} months
Trajectory: ${trajectory}

Write the verdict card.`,
  }
}