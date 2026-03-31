import { StreamClient } from "@stream-io/node-sdk";

export async function POST(req: Request) {
  const { userId } = await req.json();

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const secretKey = process.env.STREAM_SECRET;

  const client = new StreamClient(apiKey, secretKey);

  const token = client.createToken(userId);

  return Response.json({ token });
}
