const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Fetches the verdict card text from Claude via Express.
 * Returns null on any failure — UI shows fallback.
 */
export async function fetchVerdict({ profile, activeScenarios, riskPercent, survivalMonths }) {
  try {
    const res = await fetch(`${BASE}/api/verdict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, activeScenarios, riskPercent, survivalMonths }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.verdict ?? null
  } catch {
    return null
  }
}

/**
 * "Can I Afford This?" decision mode
 */
export async function fetchAffordVerdict({ profile, cost, riskBefore, riskAfter, runwayBefore, runwayAfter }) {
  try {
    const res = await fetch(`${BASE}/api/decision/afford`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, cost, riskBefore, riskAfter, runwayBefore, runwayAfter }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.verdict ?? null
  } catch {
    return null
  }
}

/**
 * "Make Me Safer" decision mode
 */
export async function fetchSaferVerdict({ profile, riskPercent, survivalMonths, targetRisk }) {
  try {
    const res = await fetch(`${BASE}/api/decision/safer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, riskPercent, survivalMonths, targetRisk }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.verdict ?? null
  } catch {
    return null
  }
}