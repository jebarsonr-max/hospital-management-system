const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

router.get('/stats', hospitalController.getStats);

router.get('/patients/search', hospitalController.searchPatients);
router.get('/patients', hospitalController.getPatients);
router.post('/patients', hospitalController.addPatient);
router.delete('/patients/:id', hospitalController.deletePatient);

router.get('/doctors', hospitalController.getDoctors);
router.post('/doctors', hospitalController.addDoctor);
router.delete('/doctors/:id', hospitalController.deleteDoctor);

router.get('/appointments', hospitalController.getAppointments);
router.post('/appointments', hospitalController.bookAppointment);
router.delete('/appointments/:id', hospitalController.cancelAppointment);

module.exports = router;
