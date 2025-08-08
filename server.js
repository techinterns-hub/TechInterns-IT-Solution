const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Default data structure
const defaultData = {
    courses: [
        { id: 1, title: 'Full Stack Development', category: 'Development', description: 'Complete web development course covering frontend and backend technologies.', duration: '12 weeks', level: 'Intermediate', price: 'Free' },
        { id: 2, title: 'Frontend Development', category: 'Development', description: 'Master modern frontend technologies including React, Vue, and Angular.', duration: '8 weeks', level: 'Beginner', price: 'Free' },
        { id: 3, title: 'Backend Development', category: 'Development', description: 'Learn server-side development with Node.js, Python, and databases.', duration: '10 weeks', level: 'Intermediate', price: 'Free' },
        { id: 4, title: 'App Development', category: 'Mobile', description: 'Build mobile applications for iOS and Android platforms.', duration: '6 weeks', level: 'Beginner', price: 'Free' },
        { id: 5, title: 'Data Science & Analytics', category: 'Data Science', description: 'Analyze data and build machine learning models.', duration: '10 weeks', level: 'Advanced', price: 'Free' },
        { id: 6, title: 'Responsive Web Design', category: 'Design', description: 'Create beautiful, responsive websites that work on all devices.', duration: '4 weeks', level: 'Beginner', price: 'Free' }
    ],
    pricing: [
        { id: 1, plan: 'Basic', price: 'Free', features: ['Access to all courses', 'Community support', 'Basic certificates'] },
        { id: 2, plan: 'Premium', price: '$49/month', features: ['All Basic features', '1-on-1 mentorship', 'Priority support', 'Advanced projects'] },
        { id: 3, plan: 'Enterprise', price: '$199/month', features: ['All Premium features', 'Custom curriculum', 'Team management', 'Analytics dashboard'] }
    ],
    internships: [
        { id: 1, title: 'Full Stack Development', duration: '1 months', type: 'Remote', spots: 15, description: 'Master both frontend and backend technologies while working on real client projects. Build scalable web applications using modern frameworks.' },
        { id: 2, title: 'Frontend Development', duration: '1 months', type: 'Remote', spots: 20, description: 'Create stunning user interfaces and exceptional user experiences using modern frontend technologies and design principles.' },
        { id: 3, title: 'Backend Development', duration: '1 months', type: 'Remote', spots: 12, description: 'Build robust server-side applications, APIs, and database systems that power modern web applications at scale.' },
        { id: 4, title: 'Mobile App Development', duration: '1 months', type: 'Remote', spots: 10, description: 'Develop cross-platform mobile applications using React Native and Flutter, from concept to app store deployment.' }
    ]
};

// Initialize data file if it doesn't exist
async function initializeData() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    }
}

// Read data from file
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return defaultData;
    }
}

// Write data to file
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// API Routes

// Get all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// Update courses
app.put('/api/courses', async (req, res) => {
    try {
        const data = await readData();
        data.courses = req.body;
        await writeData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update courses' });
    }
});

// Update pricing
app.put('/api/pricing', async (req, res) => {
    try {
        const data = await readData();
        data.pricing = req.body;
        await writeData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update pricing' });
    }
});

// Update internships
app.put('/api/internships', async (req, res) => {
    try {
        const data = await readData();
        data.internships = req.body;
        await writeData(data);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update internships' });
    }
});

// Start server
async function startServer() {
    await initializeData();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();