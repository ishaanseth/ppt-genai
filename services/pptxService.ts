import { Slide } from '../types';

// These libraries are loaded from CDNs in index.html
declare var PptxGenJS: any;
declare var JSZip: any;

interface TemplateInfo {
  primaryColor: string | null;
  fontName: string | null;
}

// Parses a .pptx file to extract theme information (color, font) by unzipping it.
async function parseTemplateFile(file: File): Promise<TemplateInfo> {
    if (typeof JSZip === 'undefined') {
        throw new Error('JSZip library is not loaded.');
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    let primaryColor: string | null = null;
    let fontName: string | null = null;

    const themeEntry = Object.keys(zip.files).find(
      (name) => name.startsWith("ppt/theme/") && name.endsWith(".xml")
    );

    if (themeEntry) {
      const themeXml = await zip.file(themeEntry)!.async("text");
      
      // Try to find the accent1 color
      const colorMatch = themeXml.match(
        /<a:accent1[\s\S]*?<a:srgbClr\s+val="([0-9A-Fa-f]{6})"/i
      );
      if (colorMatch) primaryColor = colorMatch[1].toUpperCase();

      // Try to find the major font for headings
      let fontMatch = themeXml.match(
        /<a:majorFont[\s\S]*?<a:latin\s+typeface="([^"]+)"/i
      );
      if (fontMatch) {
          fontName = fontMatch[1];
      } else {
        // Fallback to finding any latin typeface in the font scheme
        fontMatch = themeXml.match(
          /<a:fontScheme[\s\S]*?<a:latin\s+typeface="([^"]+)"/i
        );
        if (fontMatch) fontName = fontMatch[1];
      }
    }

    return { primaryColor, fontName };
}

export const createPresentation = async (slides: Slide[], templateFile: File | null): Promise<void> => {
  if (typeof PptxGenJS === 'undefined') {
    const errorMsg = 'Error: The presentation generator library (pptxgenjs) is not available.';
    console.error(errorMsg);
    alert(errorMsg);
    return;
  }

  const pres = new PptxGenJS();
  let templateInfo: TemplateInfo | null = null;
  
  if (templateFile) {
      try {
          templateInfo = await parseTemplateFile(templateFile);
      } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
          console.error("Failed to parse template file:", err);
          alert(`Could not parse the template file: ${errorMessage}. A blank presentation will be created instead.`);
      }
  }

  // Use extracted theme info or fall back to defaults
  const titleColor = templateInfo?.primaryColor ?? '000000';
  const contentColor = '363636'; // A dark grey for body text is generally safe and readable
  const fontFace = templateInfo?.fontName ?? 'Arial';

  slides.forEach((slideData) => {
    const slide = pres.addSlide();

    // Title
    slide.addText(slideData.title, { 
      x: 0.5, 
      y: 0.25, 
      w: '90%', 
      h: 1, 
      fontSize: 32, 
      bold: true,
      fontFace: fontFace,
      color: titleColor,
      align: 'left'
    });

    // Content (Bullet Points)
    slide.addText(slideData.content.join('\n'), {
      x: 0.5,
      y: 1.5,
      w: '90%',
      h: 3.8,
      fontSize: 18,
      fontFace: fontFace,
      color: contentColor,
      bullet: true,
      lineSpacing: 28
    });
    
    // Speaker Notes
    slide.addNotes(slideData.speakerNotes);
  });

  pres.writeFile({ fileName: 'Generated-Presentation.pptx' });
};