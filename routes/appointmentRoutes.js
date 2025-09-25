import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {scheduleAppointment} from '../controllers/appointmentController.js'

const router = express.Router();

router.post('/schedule', upload.single('appointmentImage'), scheduleAppointment);

// module.exports=router;
export default router;