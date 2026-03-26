import { StreamChat } from 'stream-chat'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const { userId } = await request.json()
    if (!userId) {
      return Response.json({ error: 'userId is required' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
    const apiSecret = process.env.STREAM_API_SECRET

    if (!apiKey || !apiSecret) {
      return Response.json(
        { error: 'Missing Stream API credentials' },
        { status: 500 }
      )
    }

    const serverClient = StreamChat.getInstance(apiKey, apiSecret)
    const token = serverClient.createToken(userId)

    return Response.json({ token })
  } catch (err) {
    return Response.json(
      { error: err?.message || 'Failed to create token' },
      { status: 500 }
    )
  }
}
