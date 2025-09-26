import fs from 'fs';
// import {getEntitiesFromAI} from '../services/aiService.js';
// import {normalizeAppointment} from '../services/normalizationService.js';
import {extractTextFromInput} from '../services/ocrService.js';
import {entityExtraction} from '../services/entityExtractionService.js';
import {normalize} from '../services/normalizationAiService.js'
import { ok } from 'assert';

export const scheduleAppointment  = async (req,res) => {

  console.log('Controller: Initiating Architecture A pipeline...');
    const textRequest = req.body.text;
    const imageFile = req.file;

    if(!textRequest && !imageFile){
        return res.status(400).json({
            status: 'error',
            message: 'Please provide either text description or an image file'
        });
    }

    try {

        console.log('Pipeline > Calling Step 1: OCR Service...');
        const step1_result = await extractTextFromInput(textRequest, imageFile);

        if(!step1_result || !step1_result.raw_text){
          return res.status(400).json({
            status : "needs_clarification",
            message : "No clear text in image"
          })
        }
        console.log('Controller: Received from OCR Service:', step1_result);

        console.log('Pipeline > Calling Step 2: Entity Extraction Service...');
        const step2_result = await entityExtraction(step1_result.raw_text);

        if(!step2_result || !step2_result.entities){
          return res.status(400).json({
            status : "needs_clarification",
            message : "Ambiguous date/time or department for medical purpose"
          })
        }
        console.log('Controller: Received from Entity Extraction Service:', step2_result);

        console.log('Pipeline > Calling Step 3: Normalization Service...');
        const step3_result = await normalize(step2_result.entities);

        if(!step3_result || !step3_result.normalized){
          return res.status(400).json({
            status : "need_clarification",
            message : "please provide vaild date and time"
          })
        }

        console.log('Controller: Received from Normalization Service:', step3_result);

        const finalAppointment = {
          "appointment" : {
            "department" : step2_result.entities.department,
            "date" : step3_result.normalized.date,
            "time" : step3_result.normalized.time,
            "tz" : step3_result.normalized.tz
          },
          "Status" : "OK"
        }

        res.status(200).json({
          'OCR/Text Extraction' : step1_result,
          'Entity Extraction' : step2_result,
          'Normalization' : step3_result,
          'Final Appointment' : finalAppointment
        });
        
        
    } catch (error) {
        
         console.error('An error occurred in the appointment controller:', error);

        res.status(500).json({
            status : 'error',
            message : ' An internet server error occurred.'
        })
        
    } finally {
        if (imageFile && imageFile.path) {
      fs.unlink(imageFile.path, (err) => {
        if (err) {
          console.error('Error deleting temporary file:', err);
        } else {
          console.log('Successfully deleted temporary file:', imageFile.path);
        }
      });
     }
    }

};