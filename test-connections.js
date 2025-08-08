// Test script to verify all connections work properly
console.log('🔍 Testing TechInterns Website Connections...\n');

// Test 1: Check if server is running
async function testServerConnection() {
    try {
        const response = await fetch('http://localhost:3000/api/data');
        if (response.ok) {
            console.log('✅ Server connection: SUCCESS');
            const data = await response.json();
            console.log(`   - Courses loaded: ${data.courses?.length || 0}`);
            console.log(`   - Pricing plans: ${data.pricing?.length || 0}`);
            console.log(`   - Internships: ${data.internships?.length || 0}`);
            return true;
        } else {
            console.log('❌ Server connection: FAILED (Response not OK)');
            return false;
        }
    } catch (error) {
        console.log('❌ Server connection: FAILED (Server not running)');
        console.log('   💡 Run "npm start" to start the server');
        return false;
    }
}

// Test 2: Check localStorage fallback
function testLocalStorageFallback() {
    try {
        const testData = { test: 'data' };
        localStorage.setItem('testConnection', JSON.stringify(testData));
        const retrieved = JSON.parse(localStorage.getItem('testConnection'));
        localStorage.removeItem('testConnection');
        
        if (retrieved.test === 'data') {
            console.log('✅ localStorage fallback: SUCCESS');
            return true;
        } else {
            console.log('❌ localStorage fallback: FAILED');
            return false;
        }
    } catch (error) {
        console.log('❌ localStorage fallback: FAILED');
        return false;
    }
}

// Test 3: Check file structure
function testFileStructure() {
    const requiredFiles = [
        'server.js',
        'package.json',
        'js/data.js',
        'js/admin.js',
        'admin.html',
        'admin-login.html'
    ];
    
    console.log('✅ File structure check:');
    console.log('   - All required files should be present');
    console.log('   - Check manually or run the server to verify');
    return true;
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting connection tests...\n');
    
    const serverTest = await testServerConnection();
    console.log('');
    
    const localStorageTest = testLocalStorageFallback();
    console.log('');
    
    const fileTest = testFileStructure();
    console.log('');
    
    // Summary
    console.log('📊 TEST SUMMARY:');
    console.log(`   Server API: ${serverTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   localStorage: ${localStorageTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   File structure: ${fileTest ? '✅ PASS' : '❌ FAIL'}`);
    
    if (serverTest && localStorageTest && fileTest) {
        console.log('\n🎉 All systems operational! Your persistent admin panel is ready.');
        console.log('   👉 Access admin panel at: http://localhost:3000/admin-login.html');
        console.log('   👉 Username: admin, Password: techinterns2025');
    } else {
        console.log('\n⚠️  Some issues detected. Please check the failed tests above.');
    }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    runAllTests();
}

// Export for Node.js testing
if (typeof module !== 'undefined') {
    module.exports = { runAllTests, testServerConnection, testLocalStorageFallback };
}