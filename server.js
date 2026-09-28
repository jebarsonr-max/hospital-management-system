const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// In-Memory Data Storage (Similar to C Arrays)
// ==========================================

let patients = [
    {
        id: 101,
        name: "Rahul Sharma",
        age: 29,
        gender: "Male",
        disease: "Viral Fever",
        phone: "9876543210"
    },
    {
        id: 102,
        name: "Ananya Singh",
        age: 34,
        gender: "Female",
        disease: "Migraine",
        phone: "9812345678"
    },
    {
        id: 103,
        name: "Rohan Verma",
        age: 52,
        gender: "Male",
        disease: "Type 2 Diabetes",
        phone: "9123456780"
    }
];

let doctors = [
    {
        id: 201,
        name: "Dr. Rajesh Mehta",
        specialization: "General Physician",
        experience: "12 Years"
    },
    {
        id: 202,
        name: "Dr. Priya Verma",
        specialization: "Neurologist",
        experience: "9 Years"
    },
    {
        id: 203,
        name: "Dr. Arvind Rao",
        specialization: "Cardiologist",
        experience: "15 Years"
    }
];

let appointments = [
    {
        id: 501,
        patientId: 101,
        doctorId: 201,
        date: "2026-10-02",
        time: "10:30 AM"
    },
    {
        id: 502,
        patientId: 102,
        doctorId: 202,
        date: "2026-10-03",
        time: "02:00 PM"
    }
];

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Dashboard Statistics
app.get('/api/stats', (req, res) => {
    res.json({
        success: true,
        patientsCount: patients.length,
        doctorsCount: doctors.length,
        appointmentsCount: appointments.length
    });
});

// --- PATIENT ENDPOINTS ---

// Get all patients
app.get('/api/patients', (req, res) => {
    res.json({ success: true, data: patients });
});

// Search patients by ID or Name
app.get('/api/patients/search', (req, res) => {
    const query = (req.query.q || '').trim().toLowerCase();
    if (!query) {
        return res.json({ success: true, data: patients });
    }

    const filtered = patients.filter(p => 
        p.id.toString() === query ||
        p.name.toLowerCase().includes(query) ||
        p.disease.toLowerCase().includes(query)
    );

    res.json({ success: true, data: filtered });
});

// Add a new patient
app.post('/api/patients', (req, res) => {
    const { id, name, age, gender, disease, phone } = req.body;

    if (!id || !name || !age || !gender || !disease || !phone) {
        return res.status(400).json({ success: false, message: "All patient fields are required!" });
    }

    const patientId = parseInt(id, 10);
    const existing = patients.find(p => p.id === patientId);
    if (existing) {
        return res.status(400).json({ success: false, message: `Patient with ID ${patientId} already exists!` });
    }

    const newPatient = {
        id: patientId,
        name: name.trim(),
        age: parseInt(age, 10),
        gender: gender.trim(),
        disease: disease.trim(),
        phone: phone.trim()
    };

    patients.push(newPatient);
    res.status(201).json({ success: true, message: "Patient registered successfully!", data: newPatient });
});

// Delete patient
app.delete('/api/patients/:id', (req, res) => {
    const patientId = parseInt(req.params.id, 10);
    const index = patients.findIndex(p => p.id === patientId);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Patient not found!" });
    }

    patients.splice(index, 1);
    // Also remove any related appointments
    appointments = appointments.filter(a => a.patientId !== patientId);

    res.json({ success: true, message: `Patient ID ${patientId} removed successfully!` });
});

// --- DOCTOR ENDPOINTS ---

// Get all doctors
app.get('/api/doctors', (req, res) => {
    res.json({ success: true, data: doctors });
});

// Add a new doctor
app.post('/api/doctors', (req, res) => {
    const { id, name, specialization, experience } = req.body;

    if (!id || !name || !specialization || !experience) {
        return res.status(400).json({ success: false, message: "All doctor fields are required!" });
    }

    const doctorId = parseInt(id, 10);
    const existing = doctors.find(d => d.id === doctorId);
    if (existing) {
        return res.status(400).json({ success: false, message: `Doctor with ID ${doctorId} already exists!` });
    }

    const newDoctor = {
        id: doctorId,
        name: name.trim(),
        specialization: specialization.trim(),
        experience: experience.trim()
    };

    doctors.push(newDoctor);
    res.status(201).json({ success: true, message: "Doctor added successfully!", data: newDoctor });
});

// Delete doctor
app.delete('/api/doctors/:id', (req, res) => {
    const doctorId = parseInt(req.params.id, 10);
    const index = doctors.findIndex(d => d.id === doctorId);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Doctor not found!" });
    }

    doctors.splice(index, 1);
    // Also remove any related appointments
    appointments = appointments.filter(a => a.doctorId !== doctorId);

    res.json({ success: true, message: `Doctor ID ${doctorId} removed successfully!` });
});

// --- APPOINTMENT ENDPOINTS ---

// Get all appointments with patient and doctor details
app.get('/api/appointments', (req, res) => {
    const enriched = appointments.map(apt => {
        const patient = patients.find(p => p.id === apt.patientId);
        const doctor = doctors.find(d => d.id === apt.doctorId);
        return {
            ...apt,
            patientName: patient ? patient.name : `ID #${apt.patientId} (Removed)`,
            doctorName: doctor ? doctor.name : `ID #${apt.doctorId} (Removed)`,
            specialization: doctor ? doctor.specialization : 'N/A'
        };
    });
    res.json({ success: true, data: enriched });
});

// Book appointment
app.post('/api/appointments', (req, res) => {
    const { id, patientId, doctorId, date, time } = req.body;

    if (!id || !patientId || !doctorId || !date || !time) {
        return res.status(400).json({ success: false, message: "All appointment fields are required!" });
    }

    const appointmentId = parseInt(id, 10);
    const pId = parseInt(patientId, 10);
    const dId = parseInt(doctorId, 10);

    const existing = appointments.find(a => a.id === appointmentId);
    if (existing) {
        return res.status(400).json({ success: false, message: `Appointment ID ${appointmentId} already exists!` });
    }

    const patientExists = patients.some(p => p.id === pId);
    if (!patientExists) {
        return res.status(400).json({ success: false, message: `Patient with ID ${pId} does not exist!` });
    }

    const doctorExists = doctors.some(d => d.id === dId);
    if (!doctorExists) {
        return res.status(400).json({ success: false, message: `Doctor with ID ${dId} does not exist!` });
    }

    const newAppointment = {
        id: appointmentId,
        patientId: pId,
        doctorId: dId,
        date: date.trim(),
        time: time.trim()
    };

    appointments.push(newAppointment);
    res.status(201).json({ success: true, message: "Appointment booked successfully!", data: newAppointment });
});

// Cancel appointment
app.delete('/api/appointments/:id', (req, res) => {
    const appointmentId = parseInt(req.params.id, 10);
    const index = appointments.findIndex(a => a.id === appointmentId);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Appointment not found!" });
    }

    appointments.splice(index, 1);
    res.json({ success: true, message: `Appointment ID ${appointmentId} cancelled successfully!` });
});

// Fallback to index.html for single-page style navigation
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  Hospital Management System Server Running!        `);
    console.log(`  Local URL: http://localhost:${PORT}               `);
    console.log(`====================================================`);
});
