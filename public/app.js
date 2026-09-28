// Hospital Management System - Frontend Client Logic

const viewTitles = {
    'dashboard': { title: 'Dashboard', subtitle: 'Overview of hospital activities and statistics' },
    'add-patient': { title: 'Add Patient', subtitle: 'Register a new patient into the hospital system' },
    'view-patients': { title: 'Patient Directory', subtitle: 'Comprehensive list of all registered patients' },
    'search-patient': { title: 'Search Patient', subtitle: 'Quickly find patient records by ID, Name or Disease' },
    'add-doctor': { title: 'Add Doctor', subtitle: 'Add a medical specialist to the hospital team' },
    'view-doctors': { title: 'Doctors List', subtitle: 'All available medical practitioners and specialists' },
    'book-appointment': { title: 'Book Appointment', subtitle: 'Schedule an appointment between a patient and doctor' },
    'view-appointments': { title: 'Appointments Schedule', subtitle: 'List of all active medical appointments' }
};

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupForms();
    loadDashboardStats();
    loadPatients();
    loadDoctors();
    loadAppointments();
});

// ==========================================
// NAVIGATION & VIEW SWITCHING
// ==========================================
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetView = item.getAttribute('data-view');
            switchView(targetView);
        });
    });
}

function switchView(viewId) {
    // Update active nav button
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-view') === viewId);
    });

    // Update active section
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.remove('active');
    });

    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update Header Titles
    if (viewTitles[viewId]) {
        document.getElementById('pageTitle').textContent = viewTitles[viewId].title;
        document.getElementById('pageSubtitle').textContent = viewTitles[viewId].subtitle;
    }

    // Refresh data corresponding to view
    if (viewId === 'dashboard') {
        loadDashboardStats();
    } else if (viewId === 'view-patients') {
        loadPatients();
    } else if (viewId === 'view-doctors') {
        loadDoctors();
    } else if (viewId === 'view-appointments') {
        loadAppointments();
    } else if (viewId === 'book-appointment') {
        populateAppointmentDropdowns();
    } else if (viewId === 'search-patient') {
        handleSearchPatients();
    }
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${isError ? 'toast-error' : 'toast-success'}`;

    setTimeout(() => {
        toast.className = 'toast hidden';
    }, 3500);
}

// ==========================================
// 1. DASHBOARD & STATS
// ==========================================
async function loadDashboardStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        if (data.success) {
            document.getElementById('statPatients').textContent = data.patientsCount;
            document.getElementById('statDoctors').textContent = data.doctorsCount;
            document.getElementById('statAppointments').textContent = data.appointmentsCount;
        }

        // Also refresh recent patients table in dashboard
        const pRes = await fetch('/api/patients');
        const pData = await pRes.json();
        const tbody = document.getElementById('dashboardPatientsTable');

        if (!pData.data || pData.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-cell">No patients registered yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = pData.data.slice(-5).reverse().map(p => `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td>${escapeHtml(p.name)}</td>
                <td>${p.age} yrs (${p.gender})</td>
                <td><span class="tag-disease">${escapeHtml(p.disease)}</span></td>
                <td>${escapeHtml(p.phone)}</td>
            </tr>
        `).join('');

    } catch (err) {
        console.error("Failed to load dashboard stats:", err);
    }
}

// ==========================================
// 2. PATIENT MANAGEMENT
// ==========================================
async function loadPatients() {
    try {
        const res = await fetch('/api/patients');
        const json = await res.json();
        const tbody = document.getElementById('allPatientsTable');

        if (!json.data || json.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No patients found in the record.</td></tr>`;
            return;
        }

        tbody.innerHTML = json.data.map(p => `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td><span class="tag-disease">${escapeHtml(p.disease)}</span></td>
                <td>${escapeHtml(p.phone)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deletePatient(${p.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Failed to load patients:", err);
    }
}

async function handleSearchPatients() {
    const input = document.getElementById('patientSearchInput');
    const query = input ? input.value.trim() : '';
    const tbody = document.getElementById('searchResultsTable');

    try {
        const res = await fetch(`/api/patients/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();

        if (!json.data || json.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No matching patient record found.</td></tr>`;
            return;
        }

        tbody.innerHTML = json.data.map(p => `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td><strong>${escapeHtml(p.name)}</strong></td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td><span class="tag-disease">${escapeHtml(p.disease)}</span></td>
                <td>${escapeHtml(p.phone)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deletePatient(${p.id}, true)">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Search failed:", err);
    }
}

async function deletePatient(id, fromSearch = false) {
    if (!confirm(`Are you sure you want to delete Patient ID #${id}?`)) return;

    try {
        const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
        const json = await res.json();

        if (json.success) {
            showToast(json.message);
            loadPatients();
            loadDashboardStats();
            if (fromSearch) handleSearchPatients();
        } else {
            showToast(json.message, true);
        }
    } catch (err) {
        showToast("Error deleting patient", true);
    }
}

// ==========================================
// 3. DOCTOR MANAGEMENT
// ==========================================
async function loadDoctors() {
    try {
        const res = await fetch('/api/doctors');
        const json = await res.json();
        const tbody = document.getElementById('allDoctorsTable');

        if (!json.data || json.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-cell">No doctors added yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = json.data.map(d => `
            <tr>
                <td><strong>#${d.id}</strong></td>
                <td><strong>${escapeHtml(d.name)}</strong></td>
                <td>${escapeHtml(d.specialization)}</td>
                <td>${escapeHtml(d.experience)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteDoctor(${d.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Failed to load doctors:", err);
    }
}

async function deleteDoctor(id) {
    if (!confirm(`Are you sure you want to delete Doctor ID #${id}?`)) return;

    try {
        const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
        const json = await res.json();

        if (json.success) {
            showToast(json.message);
            loadDoctors();
            loadDashboardStats();
        } else {
            showToast(json.message, true);
        }
    } catch (err) {
        showToast("Error deleting doctor", true);
    }
}

// ==========================================
// 4. APPOINTMENT MANAGEMENT
// ==========================================
async function populateAppointmentDropdowns() {
    try {
        const [patientsRes, doctorsRes] = await Promise.all([
            fetch('/api/patients'),
            fetch('/api/doctors')
        ]);
        const patientsData = await patientsRes.json();
        const doctorsData = await doctorsRes.json();

        const pSelect = document.getElementById('appointmentPatientId');
        const dSelect = document.getElementById('appointmentDoctorId');

        pSelect.innerHTML = '<option value="">-- Choose Patient --</option>' +
            patientsData.data.map(p => `<option value="${p.id}">#${p.id} - ${escapeHtml(p.name)} (${p.disease})</option>`).join('');

        dSelect.innerHTML = '<option value="">-- Choose Doctor --</option>' +
            doctorsData.data.map(d => `<option value="${d.id}">#${d.id} - ${escapeHtml(d.name)} (${escapeHtml(d.specialization)})</option>`).join('');

        // Set default appointment ID
        document.getElementById('appointmentId').value = Math.floor(500 + Math.random() * 499);
    } catch (err) {
        console.error("Failed to populate dropdowns:", err);
    }
}

async function loadAppointments() {
    try {
        const res = await fetch('/api/appointments');
        const json = await res.json();
        const tbody = document.getElementById('allAppointmentsTable');

        if (!json.data || json.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-cell">No scheduled appointments.</td></tr>`;
            return;
        }

        tbody.innerHTML = json.data.map(a => `
            <tr>
                <td><strong>#${a.id}</strong></td>
                <td>${escapeHtml(a.patientName)} <small>(#${a.patientId})</small></td>
                <td>${escapeHtml(a.doctorName)} <small>(#${a.doctorId})</small></td>
                <td>${escapeHtml(a.specialization)}</td>
                <td><strong>${a.date}</strong></td>
                <td>${escapeHtml(a.time)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteAppointment(${a.id})">Cancel</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Failed to load appointments:", err);
    }
}

async function deleteAppointment(id) {
    if (!confirm(`Are you sure you want to cancel Appointment ID #${id}?`)) return;

    try {
        const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
        const json = await res.json();

        if (json.success) {
            showToast(json.message);
            loadAppointments();
            loadDashboardStats();
        } else {
            showToast(json.message, true);
        }
    } catch (err) {
        showToast("Error cancelling appointment", true);
    }
}

// ==========================================
// FORM SUBMISSIONS
// ==========================================
function setupForms() {
    // 1. Add Patient Form
    const formAddPatient = document.getElementById('formAddPatient');
    if (formAddPatient) {
        formAddPatient.addEventListener('submit', async (e) => {
            e.preventDefault();
            const patientData = {
                id: document.getElementById('patientId').value,
                name: document.getElementById('patientName').value,
                age: document.getElementById('patientAge').value,
                gender: document.getElementById('patientGender').value,
                disease: document.getElementById('patientDisease').value,
                phone: document.getElementById('patientPhone').value
            };

            try {
                const res = await fetch('/api/patients', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(patientData)
                });
                const json = await res.json();

                if (json.success) {
                    showToast(json.message);
                    formAddPatient.reset();
                    loadDashboardStats();
                    switchView('view-patients');
                } else {
                    showToast(json.message, true);
                }
            } catch (err) {
                showToast("Failed to register patient", true);
            }
        });
    }

    // 2. Add Doctor Form
    const formAddDoctor = document.getElementById('formAddDoctor');
    if (formAddDoctor) {
        formAddDoctor.addEventListener('submit', async (e) => {
            e.preventDefault();
            const doctorData = {
                id: document.getElementById('doctorId').value,
                name: document.getElementById('doctorName').value,
                specialization: document.getElementById('doctorSpecialization').value,
                experience: document.getElementById('doctorExperience').value
            };

            try {
                const res = await fetch('/api/doctors', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(doctorData)
                });
                const json = await res.json();

                if (json.success) {
                    showToast(json.message);
                    formAddDoctor.reset();
                    loadDashboardStats();
                    switchView('view-doctors');
                } else {
                    showToast(json.message, true);
                }
            } catch (err) {
                showToast("Failed to add doctor", true);
            }
        });
    }

    // 3. Book Appointment Form
    const formBookAppointment = document.getElementById('formBookAppointment');
    if (formBookAppointment) {
        formBookAppointment.addEventListener('submit', async (e) => {
            e.preventDefault();
            const appointmentData = {
                id: document.getElementById('appointmentId').value,
                patientId: document.getElementById('appointmentPatientId').value,
                doctorId: document.getElementById('appointmentDoctorId').value,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value
            };

            try {
                const res = await fetch('/api/appointments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointmentData)
                });
                const json = await res.json();

                if (json.success) {
                    showToast(json.message);
                    formBookAppointment.reset();
                    loadDashboardStats();
                    switchView('view-appointments');
                } else {
                    showToast(json.message, true);
                }
            } catch (err) {
                showToast("Failed to book appointment", true);
            }
        });
    }
}

// Utility: Escape HTML to avoid XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
