# Auto PPT Generator

A minimal web app that generates PowerPoint slides from long-form text or markdown.  
Paste text, give optional guidance (e.g. "investor pitch deck"), upload a PPTX template, and instantly download a new presentation styled like the template.

🔗 **Demo Link (Vercel):** [Vercel link]()

---

## Features
- Paste or type large text input
- Optional one-line guidance for tone/structure
- Provide your own LLM API key (never stored)
- Upload `.pptx` or `.potx` template → app infers fonts, colors, and images
- Download generated `.pptx` styled like the template
- Works with any LLM provider supported by OpenRouter/AiPipe

---

## How It Works (200–300 words)

The application takes bulk text as input and uses a language model to analyze structure and content. The model is prompted to break the text into a logical slide outline in JSON format, including titles, bullet points, and optional speaker notes. Because this outline is generated dynamically, the number of slides adapts to the content length and guidance, rather than being fixed.

For styling, the app extracts design cues directly from an uploaded PowerPoint template file. Using `JSZip`, it parses the `.pptx/.potx` archive to locate theme XML files. From these, it retrieves the primary accent color, major Latin font, and any embedded media files. Images under `ppt/media/` are reused as decorative graphics in the generated slides, while the accent color and font are applied to titles and text. If the detected font is unavailable, the app falls back to standard safe fonts for compatibility.

Slides are generated client-side using `PptxGenJS`. A new `.pptx` is assembled in the browser and offered for download, ensuring no user data, text, or API keys leave the client. The use of client-side generation also means the tool can be hosted on static hosting providers like Vercel with no backend. This design keeps the implementation minimal, user-controlled, and secure.

---

## Setup
1. Clone repo  
2. `npm install`  
3. `npm run dev` (for local preview)  
4. Deploy to Vercel or GitHub Pages

---

## License
MIT License. See [LICENSE](./LICENSE).
