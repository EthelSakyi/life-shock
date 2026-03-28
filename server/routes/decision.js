import express from 'express'
import { callClaude } from '../services/claudeService.js'
import { buildAffordPrompt, buildSaferPrompt } from '../utils/buildDecisionPrompt.js'

const router = express.Router()

// POST /api/decision/afford
router.post('/afford', async (req, res) => {
  try {
    const { profile, cost, riskBefore, riskAfter, runwayBefore, runwayAfter } = req.body

    if (!profile || cost === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const prompt = buildAffordPrompt({ profile, cost, riskBefore, riskAfter, runwayBefore, runwayAfter })
    const verdict = await callClaude(prompt)
    res.json({ verdict })
  } catch (err) {
    console.error('[/api/decision/afford]', err.message)
    res.json({ verdict: null })
  }
})

// POST /api/decision/safer
router.post('/safer', async (req, res) => {
  try {
    const { profile, riskPercent, survivalMonths, targetRisk } = req.body

    if (!profile || riskPercent === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const prompt = buildSaferPrompt({ profile, riskPercent, survivalMonths, targetRisk: targetRisk || 20 })
    const verdict = await callClaude(prompt)
    res.json({ verdict })
  } catch (err) {
    console.error('[/api/decision/safer]', err.message)
    res.json({ verdict: null })
  }
})

export default router