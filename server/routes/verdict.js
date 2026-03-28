import express from 'express'
import { callClaude } from '../services/claudeService.js'
import { buildVerdictPrompt } from '../utils/buildVerdictPrompt.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { profile, activeScenarios, riskPercent, survivalMonths } = req.body

    // Basic validation
    if (!profile || riskPercent === undefined || survivalMonths === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const prompt = buildVerdictPrompt({ profile, activeScenarios: activeScenarios || [], riskPercent, survivalMonths })
    const verdict = await callClaude(prompt)

    res.json({ verdict })
  } catch (err) {
    console.error('[/api/verdict]', err.message)
    // Return null verdict — client will show fallback, never expose error
    res.json({ verdict: null })
  }
})

export default router