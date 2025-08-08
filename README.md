# TechInterns Website with Persistent Admin Panel

This website now features a persistent admin panel that saves all changes to a backend server, ensuring data consistency across different systems.

## Features

- **Persistent Data Storage**: All admin changes are saved to a backend server
- **Fallback System**: Uses localStorage if the server is unavailable
- **Real-time Updates**: Changes reflect immediately across all pages
- **Cross-System Consistency**: Data remains the same regardless of which system accesses the website

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 3. Access the Website

- **Main Website**: Open `index.html` in your browser
- **Admin Panel**: Navigate to `admin-login.html` and use admin credentials

## How It Works

### Backend Server (`server.js`)
- Express.js server with CORS enabled
- Stores data in `data.json` file
- Provides REST API endpoints for CRUD operations
- Automatically creates default data if none exists

### Frontend Integration
- **API-First Approach**: All data operations go through the backend API
- **Fallback Mechanism**: Uses localStorage if API is unavailable
- **Async Operations**: All admin functions are now asynchronous

### Data Persistence
1. **Primary Storage**: Backend server with JSON file storage
2. **Fallback Storage**: Browser localStorage
3. **Default Data**: Hardcoded defaults if no storage is available

## API Endpoints

- `GET /api/data` - Retrieve all data (courses, pricing, internships)
- `PUT /api/courses` - Update courses data
- `PUT /api/pricing` - Update pricing data
- `PUT /api/internships` - Update internships data

## Admin Panel Features

- **Course Management**: Add, edit, delete courses
- **Pricing Management**: Modify pricing plans
- **Internship Management**: Manage internship offerings
- **Real-time Updates**: Changes persist across browser sessions and different systems

## File Structure

```
TechInterns-Website/
├── server.js              # Backend server
├── data.json              # Persistent data storage (auto-created)
├── package.json           # Dependencies and scripts
├── js/
│   ├── data.js           # Updated with API integration
│   └── admin.js          # Updated with async operations
├── admin.html            # Admin panel interface
└── [other HTML files]    # Updated to use API data
```

## Development vs Production

- **Development**: Server runs on `localhost:3000`
- **Production**: Configure `API_BASE_URL` in `data.js` for your production server

## Troubleshooting

1. **Server not starting**: Ensure Node.js is installed and run `npm install`
2. **Data not persisting**: Check if server is running and accessible
3. **Fallback mode**: Website will use localStorage if server is unavailable

## Security Notes

- Admin authentication is session-based
- Consider implementing proper authentication for production use
- CORS is enabled for development - configure appropriately for production