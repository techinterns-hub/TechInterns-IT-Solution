// Shared data for courses and internships
let courses = [
    { id: 1, title: 'Full Stack Development', category: 'Development', description: 'Complete web development course covering frontend and backend technologies.', duration: '12 weeks', level: 'Intermediate', price: 'Free' },
    { id: 2, title: 'Frontend Development', category: 'Development', description: 'Master modern frontend technologies including React, Vue, and Angular.', duration: '8 weeks', level: 'Beginner', price: 'Free' },
    { id: 3, title: 'Backend Development', category: 'Development', description: 'Learn server-side development with Node.js, Python, and databases.', duration: '10 weeks', level: 'Intermediate', price: 'Free' },
    { id: 4, title: 'App Development', category: 'Mobile', description: 'Build mobile applications for iOS and Android platforms.', duration: '6 weeks', level: 'Beginner', price: 'Free' },
    { id: 5, title: 'Data Science & Analytics', category: 'Data Science', description: 'Analyze data and build machine learning models.', duration: '10 weeks', level: 'Advanced', price: 'Free' },
    { id: 6, title: 'Responsive Web Design', category: 'Design', description: 'Create beautiful, responsive websites that work on all devices.', duration: '4 weeks', level: 'Beginner', price: 'Free' }
];

let pricing = [
    { id: 1, plan: 'Basic', price: 'Free', features: ['Access to all courses', 'Community support', 'Basic certificates'] },
    { id: 2, plan: 'Premium', price: '$49/month', features: ['All Basic features', '1-on-1 mentorship', 'Priority support', 'Advanced projects'] },
    { id: 3, plan: 'Enterprise', price: '$199/month', features: ['All Premium features', 'Custom curriculum', 'Team management', 'Analytics dashboard'] }
];

let internships = [
    { id: 1, title: 'Full Stack Development', duration: '1 months', type: 'Remote', spots: 15, description: 'Master both frontend and backend technologies while working on real client projects. Build scalable web applications using modern frameworks.' },
    { id: 2, title: 'Frontend Development', duration: '1 months', type: 'Remote', spots: 20, description: 'Create stunning user interfaces and exceptional user experiences using modern frontend technologies and design principles.' },
    { id: 3, title: 'Backend Development', duration: '1 months', type: 'Remote', spots: 12, description: 'Build robust server-side applications, APIs, and database systems that power modern web applications at scale.' },
    { id: 4, title: 'Mobile App Development', duration: '1 months', type: 'Remote', spots: 10, description: 'Develop cross-platform mobile applications using React Native and Flutter, from concept to app store deployment.' }
];

// Save data to localStorage and sync across devices
function saveData() {
    const data = { courses, pricing, internships };
    localStorage.setItem('techinternsData', JSON.stringify(data));
    
    // Trigger cross-device sync if available
    if (window.dataSync) {
        window.dataSync.saveToServer(data);
    }
    
    // Update data.json file for persistence
    updateDataFile(data);
}

// Load data from localStorage
function loadData() {
    const data = localStorage.getItem('techinternsData');
    if (data) {
        const parsed = JSON.parse(data);
        courses = parsed.courses || courses;
        pricing = parsed.pricing || pricing;
        internships = parsed.internships || internships;
    }
}

// Update data.json file (for admin updates)
async function updateDataFile(data) {
    try {
        // In a real server environment, this would make an API call
        // For now, we'll use localStorage with timestamp for sync
        localStorage.setItem('dataFileUpdate', JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
        
        // Notify other tabs/windows
        window.dispatchEvent(new CustomEvent('dataFileUpdated', { detail: data }));
    } catch (error) {
        console.error('Failed to update data file:', error);
    }
}

// Listen for data updates from other sources
window.addEventListener('dataUpdated', (event) => {
    courses = event.detail.courses || courses;
    pricing = event.detail.pricing || pricing;
    internships = event.detail.internships || internships;
    
    // Refresh UI if functions exist
    if (typeof loadCourses === 'function') loadCourses();
    if (typeof loadInternships === 'function') loadInternships();
    if (typeof loadPricing === 'function') loadPricing();
});

// Initialize data
loadData();