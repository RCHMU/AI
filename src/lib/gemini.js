import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * @param {object} opts
 * @param {string} opts.apiKey
 * @param {string} opts.model
 * @param {{ role: 'user' | 'assistant', content: string }[]} opts.priorMessages
 * @param {string} opts.userMessage
 * @param {AbortSignal} [opts.signal]
 * @returns {AsyncGenerator<string>}
 */
export async function* streamGeminiReply({
  apiKey,
  model,
  priorMessages,
  userMessage,
  signal,
}) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const m = genAI.getGenerativeModel({ model })
  const history = priorMessages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }))
  const chat = m.startChat({ history })
  const streamResult = await chat.sendMessageStream(userMessage, { signal })
  for await (const chunk of streamResult.stream) {
    const t = chunk.text()
    if (t) yield t
  }
}
