import {GoogleGenerativeAI} from '@google/generative-ai';
import fs from 'fs';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getEntitiesFromAI = async (inputText, imageFile) => {

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash'});

    const prompt = `
    You are an expert appointment scheduling assistant. Your task is to analyze a user's request, which may come as text, an image, or both.

    Instructions:
    1.  If an image is provided, perform OCR to extract the raw text. If only text is provided, use that.
    2.  From the text, identify the following entities:
        - "date_phrase": The specific phrase indicating the date (e.g., "next Friday", "tomorrow", "Sep 26th").
        - "time_phrase": The specific phrase indicating the time (e.g., "3pm", "at noon", "15:00").
        - "department": The requested department. It must be one of: "Dentist", "Cardiology", "Neurology", or "General". If the request is ambiguous (e.g., "doctor"), default to "General".
    3.  Estimate confidence scores (from 0.0 to 1.0) for both the OCR/text extraction and the entity extraction.
    4.  Return your response ONLY as a single, minified, valid JSON object. Do not include any other text, explanations, or markdown formatting like \`\`\`json.

    JSON Structure:
    {
      "raw_text": "The extracted or provided text",
      "ocr_confidence": 0.95,
      "entities": {
        "date_phrase": "...",
        "time_phrase": "...",
        "department": "..."
      },
      "entities_confidence": 0.90
    }
  `;

  const requestParts = [prompt];

 if (inputText) {
    requestParts.push(`\n\nUser text input: "${inputText}"`);
  }

  if (imageFile) {
    requestParts.push(fileToGenerativePart(imageFile.path, imageFile.mimetype));
  }

  console.log('array is :', requestParts);


const result = await model.generateContent(requestParts);
const responseText = result.response.text();

  console.log('AI Service: Raw response from Gemini:', responseText);

  const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

   return JSON.parse(cleanedJsonString);

}

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
}