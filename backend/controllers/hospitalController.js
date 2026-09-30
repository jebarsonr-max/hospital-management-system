const db = require('../data/db');

exports.getStats = (req, res) => {
    res.json({
        success: true,
        patientsCount: db.patients.length,
        doctorsCount: db.doctors.length,
        appointmentsCount: db.appointments.length
    });
};

exports.getPatients = (req, res) => {
    res.json({ success: true, data: db.patients });
};

exports.searchPatients = (req, res) => {
    const query = (req.query.q || '').trim().toLowerCase();
    if (!query) {
        return res.json({ success: true, data: db.patients });
    }

    const filtered = db.patients.filter(p => 
        p.id.toString() === query ||
        p.name.toLowerCase().includes(query) ||
        p.disease.toLowerCase().includes(query)
    );

    res.json({ success: true, data: filtered });
};

exports.addPatient = (req, res) => {
    const { id, name, age, gender, disease, phone } = req.body;

    if (!id || !name || !age || !gender || !disease || !phone) {
        return res.status(400).json({ success: false, message: "All patient fields are required!" });
    }

    const patientId = parseInt(id, 10);
    const existing = db.patients.find(p => p.id === patientId);
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

    db.patients.push(newPatient);
    res.status(201).json({ success: true, message: "Patient registered successfully!", data: newPatient });
};

exports.deletePatient = (req, res) => {
    const patientId = parseInt(req.params.id, 10);
    const index = db.patients.findIndex(p => p.id === patientId);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Patient not found!" });
    }

    db.patients.splice(index, 1);
    db.appointments = db.appointments.filter(a => a.patientId !== patientId);

    res.json({ success: true, message: `Patient ID ${patientId} removed successfully!` });
};

exports.getDoctors = (req, res) => {
    res.json({ success: true, data: db.doctors });
};

exports.addDoctor = (req, res) => {
    const { id, name, specialization, experience } = req.body;

    if (!id || !name || !specialization || !experience) {
        return res.status(400).json({ success: false, message: "All doctor fields are required!" });
    }

    const doctorId = parseInt(id, 10);
    const existing = db.doctors.find(d => d.id === doctorId);
    if (existing) {
        return res.status(400).json({ success: false, message: `Doctor with ID ${doctorId} already exists!` });
    }

    const newDoctor = {
        id: doctorId,
        name: name.trim(),
        specialization: specialization.trim(),
        experience: experience.trim()
    };

    db.doctors.push(newDoctor);
    res.status(201).json({ success: true, message: "Doctor added successfully!", data: newDoctor });
};

exports.deleteDoctor = (req, res) => {
    const doctorId = parseInt(req.params.id, 10);
    const index = db.doctors.findIndex(d => d.id === doctorId);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Doctor not found!" });
    }

    db.doctors.splice(index, 1);
    db.appointments = db.appointments.filter(a => a.doctorId !== doctorId);

    res.json({ success: true, message: `Doctor ID ${doctorId} removed successfully!` });
};

exports.getAppointments = (req, res) => {
    const enriched = db.appointments.map(apt => {
        const patient = db.patients.find(p => p.id === apt.patientId);
        const doctor = db.doctors.find(d => d.id === apt.doctorId);
        return {
            ...apt,
            patientName: patient ? patient.name : `ID #${apt.patientId} (Removed)`,
            doctorName: doctor ? doctor.name : `ID #${apt.doctorId} (Removed)`,
            specialization: doctor ? doctor.specialization : 'N/A'
        };
    });
    res.json({ success: true, data: enriched });
};

exports.bookAppointment = (req, res) => {
    const { id, patientId, doctorId, date, time } = req.body;

    if (!id || !patientId || !doctorId || !date || !time) {
        return res.status(400).json({ success: false, message: "All appointment fields are required!" });
    }

    const appointmentId = parseInt(id, 10);
    const pId = parseInt(patientId, 10);
    const dId = parseInt(doctorId, 10);

    const existing = db.appointments.find(a => a.id === appointmentId);
    if (existing) {
        return res.status(400).json({ success: false, message: `Appointment ID ${appointmentId} already exists!` });
    }

    const patientExists = db.patients.some(p => p.id === pId);
    if (!patientExists) {
        return res.status(400).json({ success: false, message: `Patient with ID ${pId} does not exist!` });
    }

    const doctorExists = db.doctors.some(d => d.id === dId);
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

    db.appointments.push(newAppointment);
    res.status(201).json({ success: true, message: "Appointment booked successfully!", data: newAppointment });
};

exports.cancelAppointment = (req, res) => {
    const appointmentId = parseInt(req.params.id, 10);
    const index = db.appointments.findIndex(a => a.id === appointmentId);

    if (index === -1) {
        return res.status(404).json({ success: false, message: "Appointment not found!" });
    }

    db.appointments.splice(index, 1);
    res.json({ success: true, message: `Appointment ID ${appointmentId} cancelled successfully!` });
};
