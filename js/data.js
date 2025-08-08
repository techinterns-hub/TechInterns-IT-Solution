// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

// Shared data for courses and internships
let courses = [];
let pricing = [];
let internships = [];

// API Functions
async function fetchData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/data`);
        if (response.ok) {
            const data = await response.json();
            courses = data.courses || [];
            pricing = data.pricing || [];
            internships = data.internships || [];
            return true;
        }
    } catch (error) {
        console.warn('API not available, using localStorage fallback');
        return loadDataFromLocalStorage();
    }
    return false;
}

async function saveCoursesToAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/courses`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courses)
        });
        return response.ok;
    } catch (error) {
        console.warn('API not available, saving to localStorage');
        saveDataToLocalStorage();
        return false;
    }
}

async function savePricingToAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/pricing`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pricing)
        });
        return response.ok;
    } catch (error) {
        console.warn('API not available, saving to localStorage');
        saveDataToLocalStorage();
        return false;
    }
}

async function saveInternshipsToAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/internships`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(internships)
        });
        return response.ok;
    } catch (error) {
        console.warn('API not available, saving to localStorage');
        saveDataToLocalStorage();
        return false;
    }
}

// Fallback localStorage functions
function saveDataToLocalStorage() {
    localStorage.setItem('techinternsData', JSON.stringify({ courses, pricing, internships }));
}

function loadDataFromLocalStorage() {
    const data = localStorage.getItem('techinternsData');
    if (data) {
        const parsed = JSON.parse(data);
        courses = parsed.courses || getDefaultCourses();
        pricing = parsed.pricing || getDefaultPricing();
        internships = parsed.internships || getDefaultInternships();
        return true;
    }
    // Set default data if no localStorage data exists
    courses = getDefaultCourses();
    pricing = getDefaultPricing();
    internships = getDefaultInternships();
    return true;
}

// Default data functions
function getDefaultCourses() {
    return [
        { id: 1, title: 'Full Stack Development', category: 'Development', description: 'Complete web development course covering frontend and backend technologies.', duration: '12 weeks', level: 'Intermediate', price: 'Free' },
        { id: 2, title: 'Frontend Development', category: 'Development', description: 'Master modern frontend technologies including React, Vue, and Angular.', duration: '8 weeks', level: 'Beginner', price: 'Free' },
        { id: 3, title: 'Backend Development', category: 'Development', description: 'Learn server-side development with Node.js, Python, and databases.', duration: '10 weeks', level: 'Intermediate', price: 'Free' },
        { id: 4, title: 'App Development', category: 'Mobile', description: 'Build mobile applications for iOS and Android platforms.', duration: '6 weeks', level: 'Beginner', price: 'Free' },
        { id: 5, title: 'Data Science & Analytics', category: 'Data Science', description: 'Analyze data and build machine learning models.', duration: '10 weeks', level: 'Advanced', price: 'Free' },
        { id: 6, title: 'Responsive Web Design', category: 'Design', description: 'Create beautiful, responsive websites that work on all devices.', duration: '4 weeks', level: 'Beginner', price: 'Free' }
    ];
}

function getDefaultPricing() {
    return [
        { id: 1, plan: 'Basic', price: 'Free', features: ['Access to all courses', 'Community support', 'Basic certificates'] },
        { id: 2, plan: 'Premium', price: '$49/month', features: ['All Basic features', '1-on-1 mentorship', 'Priority support', 'Advanced projects'] },
        { id: 3, plan: 'Enterprise', price: '$199/month', features: ['All Premium features', 'Custom curriculum', 'Team management', 'Analytics dashboard'] }
    ];
}

function getDefaultInternships() {
    return [
        { id: 1, title: 'Full Stack Development', duration: '1 months', type: 'Remote', spots: 15, description: 'Master both frontend and backend technologies while working on real client projects. Build scalable web applications using modern frameworks.' },
        { id: 2, title: 'Frontend Development', duration: '1 months', type: 'Remote', spots: 20, description: 'Create stunning user interfaces and exceptional user experiences using modern frontend technologies and design principles.' },
        { id: 3, title: 'Backend Development', duration: '1 months', type: 'Remote', spots: 12, description: 'Build robust server-side applications, APIs, and database systems that power modern web applications at scale.' },
        { id: 4, title: 'Mobile App Development', duration: '1 months', type: 'Remote', spots: 10, description: 'Develop cross-platform mobile applications using React Native and Flutter, from concept to app store deployment.' }
    ];
}

// Unified save function
async function saveData() {
    await saveCoursesToAPI();
    await savePricingToAPI();
    await saveInternshipsToAPI();
}

// Initialize data
fetchData();