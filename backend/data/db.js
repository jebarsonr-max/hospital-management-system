module.exports = {
    patients: [
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
    ],
    doctors: [
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
    ],
    appointments: [
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
    ]
};
