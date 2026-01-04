# NagarNetra - Backend & API Setup Guide

## 🚀 Quick Setup Overview

NagarNetra is now equipped with:
- ✅ Supabase backend for persistent data storage
- ✅ Google Maps API integration for location selection
- ✅ AI Urgency Calculator for intelligent issue prioritization
- ✅ Duplicate issue detection with multi-reporter tracking
- ✅ Role-based access control (Citizens & Administrators)

---

## 📋 Setup Instructions

### 1. Google Maps API Configuration

To enable interactive map features in the Report Issue page:

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable these APIs:
     - Maps JavaScript API
     - Geocoding API
     - Places API
   - Create credentials → API Key
   - (Optional) Restrict the key to your domain for security

2. **Add the API Key:**
   - Open `/components/GoogleMapsPicker.tsx`
   - Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key on line 17:
   ```typescript
   const GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
   ```

3. **Features Enabled:**
   - Interactive map with draggable marker
   - Reverse geocoding (converts coordinates to addresses)
   - Current location detection
   - Click-to-place marker

**Note:** Without the API key, the system will use a fallback mode with basic geolocation.

---

### 2. Supabase Backend Setup

Your backend is already connected! Here's what's included:

**Backend Features:**
- User authentication (signup, login, sessions)
- Issue CRUD operations (Create, Read, Update, Delete)
- Urgency score calculation
- Area-based filtering for admins
- Statistics and analytics endpoints

**API Endpoints:**
- `POST /make-server-5b40dbc6/auth/signup` - User registration
- `POST /make-server-5b40dbc6/auth/session` - Session verification
- `POST /make-server-5b40dbc6/issues` - Create new issue
- `GET /make-server-5b40dbc6/issues` - Get issues (filtered by role)
- `GET /make-server-5b40dbc6/issues/:id` - Get single issue
- `PUT /make-server-5b40dbc6/issues/:id` - Update issue (admin only)
- `DELETE /make-server-5b40dbc6/issues/:id` - Delete issue (admin only)
- `GET /make-server-5b40dbc6/stats` - Get statistics

**Data stored in KV Store:**
- Issue reports with all details
- User-issue relationships
- Geographic coordinates
- AI analysis results
- Multi-reporter tracking

---

### 3. AI Urgency Calculator

**Location:** `/utils/urgencyCalculator.ts`

**How it works:**
1. **Issue Type Analysis** (40% weight)
   - Critical: Gas Leak, Fire Hazard, Electrical Hazard (95/100)
   - High: Pothole, Traffic Signal, Missing Manhole (70-85/100)
   - Medium: Garbage, Graffiti, Sidewalk Damage (40-60/100)
   - Low: Noise complaints, Park maintenance (30-40/100)

2. **Location Impact** (25% weight)
   - High traffic areas (downtown, schools, hospitals) get +15 points
   - Regular areas get base points

3. **Safety Hazard Detection** (25% weight)
   - Scans description for keywords: dangerous, hazard, broken, exposed, leak
   - Each keyword adds +5 to urgency score

4. **Time Sensitivity** (10% weight)
   - Peak hours (7-10 AM, 4-7 PM) increase urgency
   - Off-peak hours use base calculation

**Output:**
- Score (0-100)
- Level (Low, Medium, High, Critical)
- Factors breakdown
- Recommendation for response team
- Estimated response time

---

### 4. Duplicate Issue Detection

**How it works:**
1. When an issue is reported, the system checks for similar issues nearby
2. Similar issues within 500m radius are flagged
3. Multiple reports are merged into a single issue
4. Admin dashboard shows:
   - Number of reporters (with "flagged by X users")
   - Names and emails of all reporters
   - Individual report dates
   - Combined urgency score (higher with more reports)

**Benefits:**
- Prevents duplicate work for authorities
- Increases issue visibility and priority
- Shows community consensus on problem severity

---

## 🎯 User Roles & Permissions

### Citizens
- ✅ Report new issues with photo upload
- ✅ View location on interactive map
- ✅ Track their own reported issues
- ✅ See AI-detected issue type and urgency
- ✅ Get duplicate detection alerts
- ❌ Cannot access admin dashboard
- ❌ Cannot view issues from other citizens

### Administrators
- ✅ View ALL issues across all areas
- ✅ Filter issues by area and urgency
- ✅ See urgency scores calculated by AI
- ✅ View multi-reporter issues with citizen names
- ✅ Update issue status (Pending → In Progress → Resolved)
- ✅ Access analytics and statistics
- ❌ Cannot report new issues
- ❌ Blocked from Report Issue page

---

## 🔄 Data Flow

### Citizen Reporting Flow:
1. Citizen uploads photo → AI analyzes image
2. AI detects issue type and generates description
3. Citizen selects location on Google Maps
4. System calculates urgency score based on:
   - Issue type
   - Location (traffic level)
   - Description keywords
   - Time of day
5. System checks for duplicate issues nearby
6. Issue saved to backend with all data
7. Citizen receives confirmation

### Admin Management Flow:
1. Admin views dashboard with all issues
2. Issues sorted by urgency score (highest first)
3. Multi-reporter issues highlighted with user count
4. Admin clicks issue to see full details:
   - All reporter names and emails
   - AI urgency analysis breakdown
   - Exact location with coordinates
   - Photo and description
5. Admin assigns status and team
6. Status updates visible to all reporters

---

## 📊 Sample Data Structure

```typescript
interface Issue {
  id: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  urgencyScore: number; // 0-100
  status: 'Pending' | 'In Progress' | 'Resolved';
  aiAnalysis: string;
  reporters: Array<{
    name: string;
    email: string;
    reportedDate: string;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🛠 Development Tips

1. **Testing Google Maps:**
   - Use a test API key with unlimited local requests
   - Check browser console for any API errors
   - Ensure location permissions are enabled

2. **Testing Duplicate Detection:**
   - Report similar issues in the same area
   - Check admin dashboard for merged view
   - Verify all reporter names appear

3. **Testing Urgency Calculator:**
   - Try different issue types
   - Use high-traffic area keywords
   - Include safety keywords in description
   - Check calculated scores in admin panel

4. **Backend Testing:**
   - Use browser DevTools Network tab
   - Check `/make-server-5b40dbc6/health` endpoint
   - Verify authentication tokens are sent
   - Monitor KV store data

---

## 🎨 Branding

**Application Name:** NagarNetra  
**Tagline:** AI-Powered Civic Reporting  
**Logo:** Modern city icon (automatically loaded)  
**Color Scheme:**
- Primary: Blue (#2563EB) - Trust & governance
- Success: Green (#10B981) - Resolved issues
- Warning: Yellow (#F59E0B) - Pending issues
- Danger: Red (#EF4444) - Urgent issues
- Background: Light Gray (#F9FAFB)

---

## 📱 Mobile Responsiveness

All features are fully responsive:
- Mobile-first design
- Touch-friendly map controls
- Adaptive layouts for all screen sizes
- Optimized image upload for mobile cameras

---

## 🚦 Next Steps

1. Add your Google Maps API key to enable full map features
2. Test the reporting flow as a citizen
3. Test the admin dashboard with different filters
4. Customize urgency thresholds if needed
5. Add more issue types in the urgency calculator

---

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify API keys are properly configured
- Ensure location permissions are granted
- Test with different user roles

---

**Built with:** React, TypeScript, Tailwind CSS, Supabase, Google Maps API  
**Hackathon Ready:** ✅ Fully functional demo with AI features
