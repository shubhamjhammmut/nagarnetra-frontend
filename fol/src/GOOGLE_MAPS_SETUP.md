# Google Maps API Setup Guide

## Current Status
✅ The application is configured to use Google Maps API  
⚠️ **API Key Required:** You need to add your Google Maps API key to enable full functionality

## Quick Setup (5 minutes)

### Step 1: Get Your Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" → "Library"
4. Enable these APIs:
   - ✅ **Maps JavaScript API**
   - ✅ **Geocoding API** 
   - ✅ **Places API**
5. Navigate to "APIs & Services" → "Credentials"
6. Click "Create Credentials" → "API Key"
7. Copy your API key

### Step 2: Add API Key to Application

Open `/components/GoogleMapsPicker.tsx` and find line 17:

```typescript
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
```

Replace `'YOUR_GOOGLE_MAPS_API_KEY_HERE'` with your actual API key:

```typescript
const GOOGLE_MAPS_API_KEY = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx';
```

### Step 3: Save and Test

1. Save the file
2. Refresh the application  
3. Navigate to "Report Issue" page
4. Upload a photo
5. You should now see an interactive map with address lookup!

## Features Enabled by Google Maps

### With API Key (Full Features):
✅ Interactive draggable map  
✅ Click-to-place marker  
✅ Reverse geocoding (shows human-readable addresses)  
✅ Current location detection with address  
✅ Smooth map interactions  

### Without API Key (Fallback Mode):
✅ Basic GPS coordinate capture  
✅ Latitude/Longitude display  
❌ No visual map  
❌ No address lookup  

## Default Location

The map is set to default to **Lucknow, Uttar Pradesh, India** (coordinates: 26.8467, 80.9462)

To change the default location, edit line 19-22 in `/components/GoogleMapsPicker.tsx`:

```typescript
const DEFAULT_LOCATION = {
  lat: 26.8467,  // Change latitude
  lng: 80.9462,  // Change longitude
};
```

## Testing

### Test Citizens Flow:
1. Login as: `citizen@demo.com` / `citizen123`
2. Click "Report Issue"
3. Upload any photo
4. Wait for AI analysis
5. Scroll to map section
6. Test interactions:
   - Drag the red marker
   - Click anywhere on map
   - Click "Use My Location" button
7. Watch address update in real-time

### Test in Different Areas:
The system recognizes these Uttar Pradesh areas:
- Hazratganj, Lucknow
- Gomti Nagar, Lucknow  
- Alambagh, Lucknow
- Indira Nagar, Lucknow
- Vidhan Sabha Marg, Lucknow
- Agra-Lucknow Expressway

## Security Best Practices

### For Production:

1. **Restrict API Key:**
   - Go to Google Cloud Console → Credentials
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain: `https://yourdomain.com/*`

2. **Set API Restrictions:**
   - Under "API restrictions", select "Restrict key"
   - Choose only the APIs you need:
     - Maps JavaScript API
     - Geocoding API
     - Places API

3. **Set Quotas:**
   - Monitor usage in Google Cloud Console
   - Set daily quotas to prevent unexpected charges
   - Free tier includes: 28,000 map loads/month

## Troubleshooting

### Map not loading?
1. Check browser console for errors
2. Verify API key is correct (no extra spaces)
3. Ensure APIs are enabled in Google Cloud Console
4. Check if domain restrictions are blocking localhost

### "This page can't load Google Maps correctly"?
- This means billing is not enabled on your Google Cloud project
- Enable billing (free $300 credit available)
- Or use the fallback mode (no API key needed)

### Location permission denied?
- Allow location access in browser settings
- Click the location icon in address bar
- Select "Always allow" for this site

### Address not showing?
- Geocoding API might not be enabled
- Check API key restrictions
- Verify internet connection

## Cost Estimation

### Google Maps Pricing (2024):
- **Maps JavaScript API:** $7 per 1,000 loads (first 28,000 free/month)
- **Geocoding API:** $5 per 1,000 requests (first 40,000 free/month)
- **Places API:** $17 per 1,000 requests (free tier available)

### Typical Usage for Civic App:
- ~100 reports/day = ~3,000/month
- Estimated cost: **$0** (within free tier)
- At 1,000 reports/day: ~$20-30/month

## Alternative: Running Without Google Maps

If you prefer not to use Google Maps, the application will automatically use fallback mode:

**Fallback Features:**
- GPS coordinate capture via browser geolocation
- Displays latitude/longitude
- Manual location input option
- Works offline-first

**To use fallback permanently:**
Simply leave the API key as `'YOUR_GOOGLE_MAPS_API_KEY_HERE'` and the app will use fallback mode.

## Support

For issues with Google Maps integration:
1. Check `/components/GoogleMapsPicker.tsx` for errors
2. Verify API key permissions in Google Cloud Console
3. Test with a fresh browser/incognito window
4. Check browser console for detailed error messages

---

**Quick Start:** Replace API key → Save → Refresh → Works! 🚀

**Demo Ready:** The app works perfectly without API key using fallback mode
