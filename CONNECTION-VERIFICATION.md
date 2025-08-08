# Connection Verification Report

## File Connections Overview

### 🔗 Backend System
- **server.js** → Main Express server handling API requests
- **data.json** → Persistent storage file (auto-created)
- **package.json** → Dependencies and scripts

### 🔗 Frontend Data Layer
- **js/data.js** → API integration with localStorage fallback
  - Connected to: ALL HTML files
  - Functions: `fetchData()`, `saveCoursesToAPI()`, `savePricingToAPI()`, `saveInternshipsToAPI()`

### 🔗 Admin System
- **admin-login.html** → Admin authentication
  - Credentials: admin / techinterns2025
  - Redirects to: admin.html
- **admin.html** → Admin panel interface
  - Uses: js/data.js, js/admin.js
- **js/admin.js** → Admin functionality
  - All functions are async and use API calls
  - Fallback to localStorage if API unavailable

### 🔗 Public Pages
All pages load data.js for API connectivity:

1. **index.html**
   - Loads: js/data.js, js/script.js
   - Connection: Fetches data on load

2. **courses.html**
   - Loads: js/data.js, js/script.js
   - Connection: Displays courses from API
   - Function: `loadCourses()` uses global `courses` array

3. **internships.html**
   - Loads: js/data.js, js/script.js
   - Connection: Displays internships from API
   - Function: `loadInternships()` uses global `internships` array

4. **about.html**
   - Loads: js/data.js, js/script.js
   - Connection: Fetches data on load (for consistency)

5. **contact.html**
   - Loads: js/data.js, js/script.js
   - Connection: Fetches data on load (for consistency)

6. **enroll.html**
   - Loads: js/data.js, js/enrollment-handler.js
   - Connection: Populates course dropdown from API
   - Dynamic course selection based on API data

## 🔄 Data Flow

### Admin Changes → Persistent Storage
1. Admin makes changes in admin.html
2. js/admin.js calls API functions (saveCoursesToAPI, etc.)
3. server.js receives PUT request
4. data.json file is updated
5. Changes persist across all systems

### Public Pages → Data Display
1. Page loads and calls fetchData()
2. js/data.js fetches from API
3. If API fails, falls back to localStorage
4. Global variables (courses, pricing, internships) are populated
5. Page-specific functions use these global variables

## 🛡️ Fallback System
- **Primary**: Backend API (server.js + data.json)
- **Secondary**: localStorage in browser
- **Tertiary**: Hardcoded default data in js/data.js

## ✅ Connection Verification Steps

### 1. Start the Server
```bash
npm start
# or
node server.js
```

### 2. Test API Endpoints
- GET http://localhost:3000/api/data
- PUT http://localhost:3000/api/courses
- PUT http://localhost:3000/api/pricing
- PUT http://localhost:3000/api/internships

### 3. Test Admin Panel
1. Go to http://localhost:3000/admin-login.html
2. Login with admin/techinterns2025
3. Make changes to courses/pricing/internships
4. Verify changes persist after browser refresh

### 4. Test Public Pages
1. Visit http://localhost:3000/courses.html
2. Visit http://localhost:3000/internships.html
3. Verify data displays correctly
4. Check that admin changes reflect immediately

### 5. Test Cross-System Persistence
1. Make changes on one computer/browser
2. Access website from different computer/browser
3. Verify changes are visible everywhere

## 🚨 Troubleshooting

### Server Not Starting
- Check if Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check port 3000 availability

### Data Not Persisting
- Verify server is running on localhost:3000
- Check browser console for API errors
- Ensure data.json file is created in root directory

### Admin Panel Not Working
- Check admin credentials: admin/techinterns2025
- Verify session storage in browser dev tools
- Check if js/admin.js is loading properly

### Pages Not Loading Data
- Check browser console for JavaScript errors
- Verify js/data.js is included in HTML files
- Test API endpoints manually

## 📁 File Dependencies

```
server.js
├── Depends on: package.json, data.json
└── Serves: All HTML files, API endpoints

js/data.js
├── Used by: ALL HTML files
├── Connects to: server.js API
└── Fallback: localStorage

js/admin.js
├── Used by: admin.html
├── Depends on: js/data.js
└── Functions: All async with API calls

HTML Files
├── All include: js/data.js
├── Dynamic pages: courses.html, internships.html, enroll.html
└── Admin: admin-login.html, admin.html
```

## 🎯 Success Indicators
- ✅ Server starts without errors
- ✅ data.json file is created automatically
- ✅ Admin panel login works
- ✅ Admin changes persist after refresh
- ✅ Public pages display updated data
- ✅ Cross-system consistency maintained
- ✅ Fallback to localStorage works when server is down