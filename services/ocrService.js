import {GoogleGenerativeAI} from '@google/generative-ai';
import fs from 'fs';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractTextFromInput = async (inputText, imageFile) => {

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash'});

    const prompt = `
                you are highly accurate Optical Character Recognization (OCR) engine
                your task is to extract text from image, text or both provided to you

                Instructions:
                1.Transcribe the text accurately.
                2.Estimate a confidence score for your transcribe (0.0 to 1.0).
                3.Return your response as single json object
                4.you have to check if the image is having text or not, if the text is not there or not clear then return empty json object
                

                for example -

                JSON Structure:
                {
                 "raw_text": "the text you have transcribe",
                 "confidence": estimated confidence score
                }   
  `;

  const requestParts = [prompt];

 if (inputText) {
    requestParts.push(`\n\nUser text input: "${inputText}"`);
  }

  if (imageFile) {
    requestParts.push(fileToGenerativePart(imageFile.path, imageFile.mimetype));
  }


const result = await model.generateContent(requestParts);
const responseText = result.response.text();

  console.log('OCR Service: Raw response from Gemini:', responseText);

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