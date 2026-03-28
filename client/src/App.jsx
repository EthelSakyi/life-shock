// client/src/App.jsx

import { runSimulation } from './engine/monteCarlo.js'
import { canIAffordThis, howMuchToSave } from './engine/decisionMode.js'

const alex = {
  income: 4300,
  expenses: 3200,
  savings: 18000,
  debt: 250,
  employment: 'employed',
}

console.log('--- LIFESHOCK ENGINE TESTS ---')
console.log('TEST 1 — No scenarios:', runSimulation(alex, []))
console.log('TEST 2 — Job loss:', runSimulation(alex, [
  { id: 'job_loss', durationMonths: 3 }
]))
console.log('TEST 3 — Stacked:', runSimulation(alex, [
  { id: 'job_loss', durationMonths: 3 },
  { id: 'medical_emergency', cost: 7500 }
]))
console.log('TEST 4 — Afford trip:', canIAffordThis(alex, [
  { id: 'job_loss', durationMonths: 3 }
], 2000))
console.log('TEST 5 — Save target:', howMuchToSave(alex, [
  { id: 'job_loss', durationMonths: 3 },
  { id: 'medical_emergency', cost: 10000 }
]))
console.log('--- END TESTS ---')

// ← This is what was missing — App needs a default export
export default function App() {
  return <div>LifeShock Engine Test — check console</div>
}