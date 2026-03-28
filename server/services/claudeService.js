import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * callClaude({ system, user })
 * Returns plain text response from Claude.
 * Throws on API error — caller handles fallback.
 */
export async function callClaude({ system, user }) {
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 256,
    system,
    messages: [
      { role: 'user', content: user },
    ],
  })

  const block = message.content.find((b) => b.type === 'text')
  if (!block) throw new Error('No text block in Claude response')
  return block.text.trim()
}