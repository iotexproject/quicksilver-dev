import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
  experimental_createMCPClient,
} from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 30;

const mcpClient = await experimental_createMCPClient({
  transport: {
    type: "sse",
    url: "https://quicksilver-alpha-preview.onrender.com/api/mcp/sse",
    headers: {
      Authorization: "Bearer your-api-key",
      "X-Source-ID": "31385caa-1b00-4729-bac1-65a65753d634",
    },
  },
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const prompt = convertToModelMessages(messages);

  const quicksilverTools = await mcpClient.tools();

  const result = streamText({
    model: openrouter("openai/gpt-4.1"),
    prompt,
    tools: quicksilverTools,
    abortSignal: req.signal,
    maxRetries: 10,
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("Aborted");
      }
    },
    consumeSseStream: consumeStream,
  });
}
