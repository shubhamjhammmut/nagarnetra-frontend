import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader, Navigation } from 'lucide-react';

interface GoogleMapsPickerProps {
  onLocationSelect: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  defaultLocation?: {
    latitude: number;
    longitude: number;
  };
}

// Google Maps API Key - Replace with your actual API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBRpP4I3FxQvCPn_KmjAeN_U4MTw7inXZE';

// Default location: Gorakhpur, Uttar Pradesh, India
const DEFAULT_LOCATION = {
  lat: 26.7606,
  lng: 83.3732,
};

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleMapsPicker({ onLocationSelect, defaultLocation }: GoogleMapsPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>('Fetching your location...');
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  const loadGoogleMapsScript = () => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      setIsApiLoaded(true);
      initializeMap();
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setIsApiLoaded(true);
        initializeMap();
      });
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsApiLoaded(true);
      initializeMap();
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps');
      setMapError(true);
      setIsLoading(false);
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (defaultLocation) {
      createMap(defaultLocation.latitude, defaultLocation.longitude);
    } else {
      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            createMap(lat, lng);
          },
          (error) => {
            console.error('Error getting location:', error);
            // Default to Gorakhpur, Uttar Pradesh
            createMap(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
          }
        );
      } else {
        // Fallback to Gorakhpur, Uttar Pradesh
        createMap(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
      }
    }
  };

  const createMap = (lat: number, lng: number) => {
    if (!mapRef.current || !window.google) {
      setIsLoading(false);
      return;
    }

    try {
      const mapOptions = {
        center: { lat, lng },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      };

      googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add marker
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: googleMapRef.current,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      // Get initial address
      getAddressFromLatLng(lat, lng);

      // Listen for marker drag
      markerRef.current.addListener('dragend', () => {
        if (markerRef.current) {
          const position = markerRef.current.getPosition();
          if (position) {
            const newLat = position.lat();
            const newLng = position.lng();
            getAddressFromLatLng(newLat, newLng);
          }
        }
      });

      // Listen for map clicks
      googleMapRef.current.addListener('click', (e: any) => {
        if (e.latLng) {
          const newLat = e.latLng.lat();
          const newLng = e.latLng.lng();
          
          // Move marker to clicked position
          if (markerRef.current) {
            markerRef.current.setPosition({ lat: newLat, lng: newLng });
          }
          
          getAddressFromLatLng(newLat, newLng);
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error creating map:', error);
      setMapError(true);
      setIsLoading(false);
    }
  };

  const getAddressFromLatLng = (lat: number, lng: number) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address;
        setSelectedLocation(address);
        onLocationSelect({
          address,
          latitude: lat,
          longitude: lng,
        });
      } else {
        const fallbackAddress = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        setSelectedLocation(fallbackAddress);
        onLocationSelect({
          address: fallbackAddress,
          latitude: lat,
          longitude: lng,
        });
      }
    });
  };

  const centerMapOnCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (googleMapRef.current) {
            googleMapRef.current.setCenter({ lat, lng });
          }
          
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
          }
          
          getAddressFromLatLng(lat, lng);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please ensure location permissions are enabled.');
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // If API failed to load, show fallback
  if (mapError || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return <GoogleMapsPickerFallback onLocationSelect={onLocationSelect} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-gray-700">Issue Location</label>
        <button
          type="button"
          onClick={centerMapOnCurrentLocation}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          disabled={isLoading}
        >
          <Navigation className="w-4 h-4" />
          Use My Location
        </button>
      </div>

      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg border border-gray-300 bg-gray-100"
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Loader className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">Selected Location:</p>
            <p className="text-gray-900 text-sm">{selectedLocation}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        💡 <strong>Tip:</strong> Click on the map or drag the marker to adjust the exact location
      </p>
    </div>
  );
}

// Fallback component when Google Maps API key is not configured
export function GoogleMapsPickerFallback({ onLocationSelect }: GoogleMapsPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationText, setLocationText] = useState('');
  const [hasLocation, setHasLocation] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
          setLocationText(address);
          setHasLocation(true);
          onLocationSelect({
            address,
            latitude: lat,
            longitude: lng,
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsGettingLocation(false);
          alert('Unable to get your location. Please ensure location permissions are enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-gray-700">Issue Location</label>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <p className="text-gray-900 mb-2">Location Detection</p>
        <p className="text-sm text-gray-600 mb-4">
          {hasLocation ? 'Location captured successfully!' : 'Click below to automatically detect your current location'}
        </p>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          {isGettingLocation ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              Get My Location
            </>
          )}
        </button>
      </div>

      {hasLocation && (
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Captured Location:</p>
              <p className="text-gray-900 text-sm">{locationText}</p>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        ℹ️ <strong>Note:</strong> For full map features with address lookup, configure Google Maps API key.
      </p>
    </div>
  );
}