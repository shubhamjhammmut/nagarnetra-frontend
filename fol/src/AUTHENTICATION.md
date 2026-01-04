# CivicAI Authentication System

## Overview
CivicAI implements a role-based authentication system with two user types: **Citizens** and **Administrators**.

## User Roles

### 👤 Citizen
Citizens are regular users who can report and track civic issues.

**Permissions:**
- ✅ Report civic issues
- ✅ Upload photos of issues
- ✅ Track **only their own** reported issues
- ✅ View their own issue status
- ✅ View their own profile
- ❌ Cannot view all issues in the area
- ❌ Cannot access admin dashboard
- ❌ Cannot manage other users' issues
- ❌ Cannot view system analytics

**Demo Credentials:**
- Email: `citizen@demo.com`
- Password: `citizen123`

### 🛡️ Administrator
Administrators have full system access to manage and resolve civic issues.

**Permissions:**
- ✅ View **all issues** area-wise
- ✅ Access admin dashboard
- ✅ Manage all issues (view, update, assign)
- ✅ View analytics and reports
- ✅ View map of all issues
- ✅ Update issue status
- ✅ Assign issues to teams
- ✅ View reporter details for each issue
- ✅ Track issues page shows all issues
- ✅ View their own profile
- ❌ **Cannot report new issues**
- ❌ **Cannot upload photos**
- ❌ No access to "Report Issue" page

**Demo Credentials:**
- Email: `admin@civicai.gov`
- Password: `admin123`

## Key Permission Differences

### Issue Tracking
- **Citizens:** See only their own reported issues (3 issues in demo data)
- **Admins:** See all issues from all citizens area-wise (6 issues in demo data)

### Issue Reporting
- **Citizens:** Can report issues and upload photos
- **Admins:** Cannot report issues (this is a citizen-only feature)

### Reasoning
This permission structure reflects real-world civic systems:
- Citizens report problems they encounter in their community
- Administrators manage and resolve reported issues from a centralized dashboard
- Separation of concerns: reporting vs. management roles

## Authentication Flow

1. **Login Page** - Users land on the authentication page first
2. **Role Selection** - During login, users can check "Login as Administrator" for admin access
3. **Protected Routes** - Routes are protected based on user role:
   - Report Issue: Requires login
   - Track Issues: Requires login
   - Profile: Requires login
   - Admin Dashboard: Requires admin role

4. **Access Control** - If a user tries to access a restricted page:
   - Non-logged-in users: Shown error notification to login
   - Citizens accessing admin: Shown "Access denied" notification

## Features

### User Profile
- View account information
- See assigned role and permissions
- View statistics (issues reported/resolved)
- Understand permission levels

### Notifications
- Success notifications for successful login
- Error notifications for access denied
- Info notifications for logout

### User Menu
Accessible from the navbar with:
- User name and role badge
- View Profile option
- Logout option
- Visual distinction between citizen (green) and admin (blue)

## Technical Implementation

### State Management
- User state stored in `App.tsx`
- User object contains: `email`, `name`, `role`
- Protected navigation with permission checks

### Components
- `AuthPage.tsx` - Login/signup interface
- `Navbar.tsx` - Shows user info and role-based navigation
- `UserProfile.tsx` - Display user information and statistics
- `PermissionsInfo.tsx` - Visual permission matrix
- `WelcomeBanner.tsx` - Role-specific welcome messages
- `Notification.tsx` - Toast notifications

## Security Notes

⚠️ **Important:** This is a demo implementation with mock authentication.

In a production environment, you would need:
- Real backend API for authentication
- Secure password hashing
- JWT or session-based authentication
- HTTPS connections
- CSRF protection
- Rate limiting
- Password strength requirements
- Email verification
- Password reset functionality

## How to Test

1. **As Citizen:**
   - Click "Citizen Demo" button on login page
   - Explore reporting and tracking features
   - Try accessing admin page (will be denied)

2. **As Administrator:**
   - Click "Admin Demo" button on login page
   - Access admin dashboard
   - View all management features
   - All citizen features also available