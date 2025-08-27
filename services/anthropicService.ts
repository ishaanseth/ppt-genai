import { Slide } from "../types";

export const generateSlidesFromTextAnthropic = async (
  rawText: string,
  guidance: string,
  apiKey: string
): Promise<Slide[]> => {
  if (!apiKey) throw new Error("Anthropic API key is required.");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `
Take the following input text and guidance, and produce slides.

Input text:
${rawText}

Guidance: ${guidance || "Create a standard professional presentation."}

Output a JSON array of slides with the structure:
[
  {
    "title": "...",
    "content": ["point 1", "point 2"],
    "speakerNotes": "..."
  }
]
          `,
        },
      ],
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.content[0].text) as Slide[];
  } catch {
    throw new Error("Failed to parse Anthropic response into slides.");
  }
};
