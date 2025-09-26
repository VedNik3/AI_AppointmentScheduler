import {GoogleGenerativeAI} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const entityExtraction = async (input_text_string) => {
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash'});

    const prompt = `
        
                You are an expert entity extraction system. Your task is to find and extract appointment details from a piece of text. The text might be a messy user message or a structured note from an OCR scan containing labels.
              

                Instructions:
                1.  Carefully read the entire "INPUT TEXT" provided below.
                2.  From the text, identify the following entities:
                  - "date_phrase": The specific phrase indicating the date (e.g., "next Friday", "tomorrow", "Sep 26th"). This will be date of appointment.
                  - "time_phrase": The specific phrase indicating the time (e.g., "3pm", "at noon", "15:00").This will be time of appointment.
                  - "department": The requested department, if department is not there then you can estimate it on problem patient is facing. Still if it is not clear then leave it empty.
                3. if appointment is not related to medical field , so stop and return empty json object.  
                4.Estimate a confidence score for your extraction (0.0 to 1.0).
                5.Return your response as single json object
                6.you have to check that you have extracted all three things date, time and department, if anyone thing is missing then return empty json object.
                

                for example -

                JSON Structure should like this:
                {
                  "entities": {
                  "date_phrase": "next Friday",
                  "time_phrase": "3pm",
                  "department": "dentist"
                },
                 "entities_confidence": 0.85
                } 
       
                ---Input TEXT---
               ${input_text_string}

  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  console.log('Entity Extraction Service: Raw response from Gemini:', responseText);

  const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

   return JSON.parse(cleanedJsonString);
}