// Enrollment form handler
document.addEventListener('DOMContentLoaded', function() {
    const enrollmentForm = document.getElementById('enrollmentForm');
    
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            const enrollmentData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                course: formData.get('course'),
                education: formData.get('education'),
                experience: formData.get('experience'),
                motivation: formData.get('motivation'),
                terms: formData.get('terms'),
                newsletter: formData.get('newsletter')
            };
            
            // Save enrollment data locally
            saveEnrollmentData(enrollmentData);
            
            // Submit to Formspree (original functionality)
            this.submit();
        });
    }
});

// Save enrollment data to localStorage
function saveEnrollmentData(enrollmentData) {
    let enrollments = [];
    const existingData = localStorage.getItem('enrollmentData');
    
    if (existingData) {
        enrollments = JSON.parse(existingData);
    }
    
    const enrollment = {
        id: Date.now(),
        ...enrollmentData,
        timestamp: new Date().toISOString(),
        revenue: calculateCourseRevenue(enrollmentData.course)
    };
    
    enrollments.push(enrollment);
    localStorage.setItem('enrollmentData', JSON.stringify(enrollments));
}

// Calculate revenue per course
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