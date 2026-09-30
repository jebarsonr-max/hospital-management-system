const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const hospitalRoutes = require('./routes/hospitalRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api', hospitalRoutes);

// Fallback to index.html for single-page style navigation
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  Hospital Management System Server Running!        `);
    console.log(`  Local URL: http://localhost:${PORT}               `);
    console.log(`====================================================`);
});
