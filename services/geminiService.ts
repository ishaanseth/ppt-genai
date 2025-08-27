
import { GoogleGenAI, Type } from "@google/genai";
import { Slide } from '../types';

export const generateSlidesFromText = async (
  rawText: string,
  guidance: string,
  apiKey: string,
): Promise<Slide[]> => {
  if (!apiKey) {
      throw new Error("Gemini API key is required.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const slideSchema = {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "A short, impactful title for the slide."
      },
      content: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
          description: "A bullet point for the slide content. Should be a concise key point."
        },
        description: "A list of bullet points summarizing the key information for this slide."
      },
      speakerNotes: {
        type: Type.STRING,
        description: "Brief speaker notes that elaborate on the slide's content for the presenter."
      }
    },
    required: ["title", "content", "speakerNotes"],
  };

  const presentationSchema = {
    type: Type.ARRAY,
    items: slideSchema,
  };
  
  const prompt = `
    You are an expert at creating concise and compelling presentations. Your task is to take a large block of raw text and structure it into a series of presentation slides.

    **Input Text:**
    ${rawText}

    **Guidance for tone and structure:**
    ${guidance || "Create a standard, professional presentation."}

    **Instructions:**
    1.  Read the input text and the guidance carefully.
    2.  Divide the content into a logical sequence of slides. The total number of slides should be appropriate for the amount of content provided. Don't make too many or too few.
    3.  For each slide, create a short, impactful title.
    4.  For each slide's content, summarize the key points into a list of bullet points. Each bullet point should be a string.
    5.  For each slide, generate brief speaker notes that elaborate on the bullet points.
    6.  You MUST output your response as a JSON object that adheres to the provided schema. The root of the object must be an array of slide objects. Do not add any introductory text, markdown, or code block formatting around the JSON output.
    `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: presentationSchema,
        }
    });

    const jsonText = response.text.trim();
    const slides: Slide[] = JSON.parse(jsonText);
    
    if (!Array.isArray(slides)) {
        throw new Error("AI response is not a valid slide array.");
    }
    
    return slides;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided Gemini API key is not valid.");
    }
    throw new Error("Failed to process text with the Gemini API.");
  }
};
