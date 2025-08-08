// Admin Panel JavaScript

// Show specific admin section
function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(section).style.display = 'block';
    event.target.classList.add('active');
    
    if (section === 'courses') loadCourses();
    if (section === 'pricing') loadPricing();
    if (section === 'internships') loadInternships();
}

// Load and display courses
function loadCourses() {
    const coursesList = document.getElementById('coursesList');
    coursesList.innerHTML = courses.map(course => `
        <div class="course-item">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h5>${course.title}</h5>
                    <p class="text-muted mb-2">${course.description}</p>
                    <div class="row">
                        <div class="col-md-3"><strong>Category:</strong> ${course.category}</div>
                        <div class="col-md-3"><strong>Duration:</strong> ${course.duration}</div>
                        <div class="col-md-3"><strong>Level:</strong> ${course.level}</div>
                        <div class="col-md-3"><strong>Price:</strong> ${course.price}</div>
                    </div>
                </div>
                <div class="ms-3">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editCourse(${course.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCourse(${course.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load and display pricing
function loadPricing() {
    const pricingList = document.getElementById('pricingList');
    pricingList.innerHTML = pricing.map(plan => `
        <div class="course-item">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h5>${plan.plan} Plan</h5>
                    <h4 class="text-primary">${plan.price}</h4>
                    <ul class="list-unstyled">
                        ${plan.features.map(feature => `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="ms-3">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editPricing(${plan.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePricing(${plan.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Show add course modal
function showAddCourseModal() {
    document.getElementById('courseForm').reset();
    new bootstrap.Modal(document.getElementById('addCourseModal')).show();
}

// Add new course
async function addCourse() {
    const form = document.getElementById('courseForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const newCourse = {
        id: courses.length + 1,
        title: document.getElementById('courseTitle').value,
        category: document.getElementById('courseCategory').value,
        description: document.getElementById('courseDescription').value,
        duration: document.getElementById('courseDuration').value,
        level: document.getElementById('courseLevel').value,
        price: document.getElementById('coursePrice').value
    };
    
    courses.push(newCourse);
    await saveCoursesToAPI();
    document.getElementById('totalCourses').textContent = courses.length;
    loadCourses();
    bootstrap.Modal.getInstance(document.getElementById('addCourseModal')).hide();
    showAlert('Course added successfully!', 'success');
}

// Edit course
function editCourse(id) {
    const course = courses.find(c => c.id === id);
    if (course) {
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseCategory').value = course.category;
        document.getElementById('courseDescription').value = course.description;
        document.getElementById('courseDuration').value = course.duration;
        document.getElementById('courseLevel').value = course.level;
        document.getElementById('coursePrice').value = course.price;
        
        // Change modal title and button
        document.querySelector('#addCourseModal .modal-title').textContent = 'Edit Course';
        document.querySelector('#addCourseModal .btn-primary').setAttribute('onclick', `updateCourse(${id})`);
        document.querySelector('#addCourseModal .btn-primary').textContent = 'Update Course';
        
        new bootstrap.Modal(document.getElementById('addCourseModal')).show();
    }
}

// Update course
async function updateCourse(id) {
    const form = document.getElementById('courseForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const courseIndex = courses.findIndex(c => c.id === id);
    if (courseIndex !== -1) {
        courses[courseIndex] = {
            ...courses[courseIndex],
            title: document.getElementById('courseTitle').value,
            category: document.getElementById('courseCategory').value,
            description: document.getElementById('courseDescription').value,
            duration: document.getElementById('courseDuration').value,
            level: document.getElementById('courseLevel').value,
            price: document.getElementById('coursePrice').value
        };
        
        await saveCoursesToAPI();
        loadCourses();
        bootstrap.Modal.getInstance(document.getElementById('addCourseModal')).hide();
        showAlert('Course updated successfully!', 'success');
        
        // Reset modal
        document.querySelector('#addCourseModal .modal-title').textContent = 'Add New Course';
        document.querySelector('#addCourseModal .btn-primary').setAttribute('onclick', 'addCourse()');
        document.querySelector('#addCourseModal .btn-primary').textContent = 'Add Course';
    }
}

// Delete course
async function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        courses = courses.filter(c => c.id !== id);
        await saveCoursesToAPI();
        document.getElementById('totalCourses').textContent = courses.length;
        loadCourses();
        showAlert('Course deleted successfully!', 'success');
    }
}

// Edit pricing (simplified)
async function editPricing(id) {
    const plan = pricing.find(p => p.id === id);
    if (plan) {
        const newPrice = prompt('Enter new price:', plan.price);
        if (newPrice) {
            plan.price = newPrice;
            await savePricingToAPI();
            loadPricing();
            showAlert('Pricing updated successfully!', 'success');
        }
    }
}

// Delete pricing
async function deletePricing(id) {
    if (confirm('Are you sure you want to delete this pricing plan?')) {
        pricing = pricing.filter(p => p.id !== id);
        await savePricingToAPI();
        loadPricing();
        showAlert('Pricing plan deleted successfully!', 'success');
    }
}

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    }
}

// Load and display internships
function loadInternships() {
    const internshipsList = document.getElementById('internshipsList');
    internshipsList.innerHTML = internships.map(internship => `
        <div class="course-item">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <h5>${internship.title}</h5>
                    <p class="text-muted mb-2">${internship.description}</p>
                    <div class="row">
                        <div class="col-md-4"><strong>Duration:</strong> ${internship.duration}</div>
                        <div class="col-md-4"><strong>Type:</strong> ${internship.type}</div>
                        <div class="col-md-4"><strong>Spots:</strong> ${internship.spots}</div>
                    </div>
                </div>
                <div class="ms-3">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="editInternship(${internship.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteInternship(${internship.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Edit internship
async function editInternship(id) {
    const internship = internships.find(i => i.id === id);
    if (internship) {
        const newSpots = prompt('Enter number of spots:', internship.spots);
        if (newSpots && !isNaN(newSpots)) {
            internship.spots = parseInt(newSpots);
            await saveInternshipsToAPI();
            loadInternships();
            showAlert('Internship updated successfully!', 'success');
        }
    }
}

// Show add internship modal
function showAddInternshipModal() {
    document.getElementById('internshipForm').reset();
    new bootstrap.Modal(document.getElementById('addInternshipModal')).show();
}

// Add new internship
async function addInternship() {
    const form = document.getElementById('internshipForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const newInternship = {
        id: internships.length + 1,
        title: document.getElementById('internshipTitle').value,
        description: document.getElementById('internshipDescription').value,
        duration: document.getElementById('internshipDuration').value,
        type: document.getElementById('internshipType').value,
        spots: parseInt(document.getElementById('internshipSpots').value)
    };
    
    internships.push(newInternship);
    await saveInternshipsToAPI();
    loadInternships();
    bootstrap.Modal.getInstance(document.getElementById('addInternshipModal')).hide();
    showAlert('Internship added successfully!', 'success');
}

// Delete internship
async function deleteInternship(id) {
    if (confirm('Are you sure you want to delete this internship?')) {
        internships = internships.filter(i => i.id !== id);
        await saveInternshipsToAPI();
        loadInternships();
        showAlert('Internship deleted successfully!', 'success');
    }
}

// Enrollment tracking system
let enrollments = [];

// Load enrollments from localStorage
function loadEnrollments() {
    const data = localStorage.getItem('enrollmentData');
    if (data) {
        enrollments = JSON.parse(data);
    }
}

// Save enrollments to localStorage
function saveEnrollments() {
    localStorage.setItem('enrollmentData', JSON.stringify(enrollments));
}

// Add new enrollment (called from enrollment form)
function addEnrollment(enrollmentData) {
    const enrollment = {
        id: Date.now(),
        ...enrollmentData,
        timestamp: new Date().toISOString(),
        revenue: calculateCourseRevenue(enrollmentData.course)
    };
    enrollments.push(enrollment);
    saveEnrollments();
    updateDashboard();
}

// Calculate revenue per course (simplified pricing model)
function calculateCourseRevenue(courseName) {
    const revenueMap = {
        'Frontend Development': 299,
        'Backend Development': 399,
        'Full Stack Development (Java)': 599,
        'App Development': 449,
        'Digital Marketing': 249,
        'Responsive Web Design': 199
    };
    return revenueMap[courseName] || 0;
}

// Update dashboard statistics
function updateDashboard() {
    const totalCourses = courses.length;
    const totalEnrollments = enrollments.length;
    const totalRevenue = enrollments.reduce((sum, enrollment) => sum + enrollment.revenue, 0);
    
    document.getElementById('totalCourses').textContent = totalCourses;
    document.getElementById('totalEnrollments').textContent = totalEnrollments;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', async function() {
    await fetchData();
    loadEnrollments();
    loadCourses();
    loadPricing();
    loadInternships();
    updateDashboard();
});