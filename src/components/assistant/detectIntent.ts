import { AI_INTENTS, type AiIntentKey } from "./aiIntents";

export function detectIntent(message: string): AiIntentKey | null {
  const lower = message.toLowerCase().trim();

  for (const [key, intent] of Object.entries(AI_INTENTS)) {
    const matched = intent.keywords.some((keyword) =>
      lower.includes(keyword.toLowerCase())
    );

    if (matched) {
      return key as AiIntentKey;
    }
  }

  return null;
}