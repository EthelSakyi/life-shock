// client/src/hooks/useScenarios.js

import { useState, useCallback } from 'react'
import { SCENARIOS } from '../data/scenarioConfig'

function buildDefaultParams(scenario) {
  const ctrl = scenario.control
  if (ctrl.type === 'toggle') return {}
  return { [ctrl.field]: ctrl.default }
}

export function useScenarios() {
  const [activeScenarios, setActiveScenarios] = useState([])

  const toggleScenario = useCallback((scenarioId) => {
    setActiveScenarios((prev) => {
      const exists = prev.find((s) => s.id === scenarioId)
      if (exists) {
        return prev.filter((s) => s.id !== scenarioId)
      }
      const config = SCENARIOS.find((s) => s.id === scenarioId)
      return [...prev, { id: scenarioId, ...buildDefaultParams(config) }]
    })
  }, [])

  const updateScenarioParam = useCallback((scenarioId, field, value) => {
    setActiveScenarios((prev) =>
      prev.map((s) =>
        s.id === scenarioId ? { ...s, [field]: value } : s
      )
    )
  }, [])

  const removeScenario = useCallback((scenarioId) => {
    setActiveScenarios((prev) => prev.filter((s) => s.id !== scenarioId))
  }, [])

  const isActive = useCallback(
    (scenarioId) => activeScenarios.some((s) => s.id === scenarioId),
    [activeScenarios]
  )

  const clearAll = useCallback(() => setActiveScenarios([]), [])

  return {
    activeScenarios,
    toggleScenario,
    updateScenarioParam,
    removeScenario,
    isActive,
    clearAll,
  }
}