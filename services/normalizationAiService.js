import {GoogleGenerativeAI} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const normalize = async (entity) => {


    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash'});


const today = new Date().toISOString().slice(0, 10);

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
     const prompt = `
        
                You are an expert in normalization using entities. Your task is to normalise the input entities.
                
               --- CURRENT CONTEXT ---
                Current Date: ${today}
                Current TimeZone: ${currentTimeZone}
              

                Instructions:
                1.Carefully read the entire "INPUT TEXT" provided below.
                2.When normalizing the "date", you MUST use the **Current Date** provided above to calculate relative dates (like "next Sunday").
                3.When normalizing the "tz", you MUST use the **Current TimeZone** provided above.
                2. from entities, identify the following:
                 -"date" : you will have date_phrase from it have to give proper format of date like this - "YYYY-MM-DD".If it is given as next monday ,just check what is current date and what date next monday will fall. Always check curent date and give date according to it . If date_phrase is like next week or next month , etc where we can't predict the exact date , so stop here and return empty json object.
                 -"time" : in time_phrase we will get time of appointment , convert it in a 24-hr format like 3pm as - "15:00". If you find invalid time , then so stop here and return empty json object.
                3.Estimate a confidence score for your normalization (0.0 to 1.0).
                4.Return your response as single json object
                5.if you get null date and time , return empty json object.
               
                

                for example -

                JSON Structure should like this:
                {
                "normalized": {
                    "date": "2025-09-26",
                    "time": "15:00",
                    "tz": "Asia/Kolkata"
                 },
                 "normalization_confidence": 0.90
                 }  
       
                ---Input TEXT---
                "date_phrase : ${entity.date_phrase}, time_phrase : ${entity.time_phrase}, department : ${entity.department}"

  `;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  console.log('Normalization Service: Raw response from Gemini:', responseText);

  const cleanedJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

   return JSON.parse(cleanedJsonString);
}