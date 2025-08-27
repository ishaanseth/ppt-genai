import { Slide } from "../types";

export const generateSlidesFromTextOpenAI = async (
  rawText: string,
  guidance: string,
  apiKey: string
): Promise<Slide[]> => {
  if (!apiKey) throw new Error("OpenAI API key is required.");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // can make configurable
      messages: [
        {
          role: "system",
          content:
            "You are an expert at creating concise, compelling presentation slides. Output JSON only.",
        },
        {
          role: "user",
          content: `
Input text:
${rawText}

Guidance: ${guidance || "Create a standard professional presentation."}

Output format: JSON array of slides. Each slide must have:
- title: string
- content: string[] (bullet points)
- speakerNotes: string
          `,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content) as Slide[];
  } catch {
    throw new Error("Failed to parse OpenAI response into slides.");
  }
};
