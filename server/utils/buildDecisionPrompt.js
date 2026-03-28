/**
 * Builds prompts for Decision Mode.
 * "Can I Afford This?" and "Make Me Safer"
 */

const SYSTEM = `You are a financial wellness assistant helping everyday people understand their financial resilience.
Write in plain English. No jargon. Keep it to 2–3 sentences. End with one concrete actionable recommendation.
Be empathetic but direct. Never say "I" or "As an AI".`

export function buildAffordPrompt({ profile, cost, riskBefore, riskAfter, runwayBefore, runwayAfter }) {
  return {
    system: SYSTEM,
    user: `Name: ${profile.name}
Profile: $${Number(profile.income).toLocaleString()}/month income, $${Number(profile.expenses).toLocaleString()}/month expenses, $${Number(profile.savings).toLocaleString()} savings
Considering a purchase of: $${Number(cost).toLocaleString()}
Risk before purchase: ${riskBefore}%
Risk after purchase: ${riskAfter}%
Runway before: ${Number(runwayBefore).toFixed(1)} months
Runway after: ${Number(runwayAfter).toFixed(1)} months

Can they afford this? Write a 2–3 sentence verdict with a recommendation.`,
  }
}

export function buildSaferPrompt({ profile, riskPercent, survivalMonths, targetRisk }) {
  return {
    system: SYSTEM,
    user: `Name: ${profile.name}
Profile: $${Number(profile.income).toLocaleString()}/month income, $${Number(profile.expenses).toLocaleString()}/month expenses, $${Number(profile.savings).toLocaleString()} savings
Current risk: ${riskPercent}%
Current survival time: ${Number(survivalMonths).toFixed(1)} months
Target risk: below ${targetRisk}%

What specific steps should ${profile.name} take to reach the target risk level? Write 2–3 sentences with a concrete savings or spending recommendation.`,
  }
}