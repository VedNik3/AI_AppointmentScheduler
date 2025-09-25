import fs from 'fs';
import {getEntitiesFromAI} from '../services/aiService.js';
// import {normalizeAppointment} from '../services/normalizationService.js';

export const scheduleAppointment  = async (req,res) => {

    const textRequest = req.body.text;
    const imageFile = req.file;

    if(!textRequest && !imageFile){
        return res.status(400).json({
            status: 'error',
            message: 'Please provide either text description or an image file'
        });
    }

    try {
         
        console.log('Controller: Calling AI Service...');
        const aiResult = await getEntitiesFromAI(textRequest, imageFile);
        console.log('Controller: Received from AI Service:', aiResult);

        // console.log('Controller: Calling Normalization Service...');
        // const finalAppointment = normalizeAppointment(aiResult.entities);
        // console.log('Controller: Received from Normalization Service:', finalAppointment);

        res.status(200).json(aiResult);
        
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