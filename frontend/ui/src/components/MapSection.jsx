import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';

const DEFAULT_CENTER = { lat: 19.076, lng: 72.8777 }; // Mumbai fallback

const PLACE_TYPE_BY_DATE = {
  cozy: 'cafe',
  luxury: 'restaurant',
  nature: 'park',
  fun: 'bowling_alley',
  'movie night': 'movie_theater',
};

const libraries = ['places'];

export default function MapSection({ city, dateType, onPlacesLoaded }) {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const mapRef = useRef(null);
  const [authError, setAuthError] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  useEffect(() => {
    window.gm_authFailure = () => {
      console.error('Google Maps authentication failure');
      setAuthError(true);
    };
    return () => {
      window.gm_authFailure = null;
    };
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || undefined, // prevent "no-key" error string
    libraries,
  });

  const geocodeCity = useCallback((cityName) => {
    if (!window.google || !cityName?.trim()) return Promise.resolve(null);
    console.log('📍 Geocoding city:', cityName);
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve) => {
      geocoder.geocode({ address: cityName.trim() }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const loc = results[0].geometry.location;
          console.log('✅ City found:', loc.lat(), loc.lng());
          resolve({ lat: loc.lat(), lng: loc.lng() });
        } else {
          console.warn('❌ Geocoding failed:', status);
          resolve(null);
        }
      });
    });
  }, []);

  const fetchNearbyPlaces = useCallback(
    (mapInstance, centerLatLng) => {
      if (!window.google?.maps?.places || !mapInstance) return;
      const typeKey = (dateType || 'cozy').toLowerCase();
      const placeType = PLACE_TYPE_BY_DATE[typeKey] || 'cafe';

      console.log(`🔎 Fetching nearby ${placeType}s...`);

      const service = new window.google.maps.places.PlacesService(mapInstance);
      const request = {
        location: centerLatLng,
        radius: 3000, // 3km radius
        type: placeType,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length) {
          const top3 = results.slice(0, 3).map((p) => ({
            id: p.place_id,
            name: p.name,
            lat: p.geometry?.location?.lat?.(),
            lng: p.geometry?.location?.lng?.(),
            vicinity: p.vicinity,
            rating: p.rating,
          }));
          console.log('✨ Found places:', top3);
          setMarkers(top3);
          onPlacesLoaded?.(top3);
        } else {
          console.log('⚠️ No places found or API error:', status);
          setMarkers([]);
        }
      });
    },
    [dateType, onPlacesLoaded]
  );

  const onLoad = useCallback(
    (mapInstance) => {
      console.log('🗺️ Map Loaded');
      setMap(mapInstance);
      mapRef.current = mapInstance;

      const cityName = city?.trim();
      if (cityName) {
        geocodeCity(cityName).then((newCenter) => {
          if (newCenter) {
            setCenter(newCenter);
            mapInstance.setCenter(newCenter);
            fetchNearbyPlaces(mapInstance, newCenter);
          } else {
            fetchNearbyPlaces(mapInstance, DEFAULT_CENTER);
          }
        });
      } else {
        fetchNearbyPlaces(mapInstance, DEFAULT_CENTER);
      }
    },
    [city, geocodeCity, fetchNearbyPlaces]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
    mapRef.current = null;
    setMarkers([]);
  }, []);

  // Handle city/dateType changes after map is loaded
  useEffect(() => {
    if (!map || !window.google) return;

    const cityName = city?.trim();
    if (cityName) {
      geocodeCity(cityName).then((newCenter) => {
        if (newCenter) {
          setCenter(newCenter);
          map.setCenter(newCenter); // Use map state directly
          fetchNearbyPlaces(map, newCenter);
        } else {
          // Fallback to current center if geocode fails but we want to refresh places
          fetchNearbyPlaces(map, center);
        }
      });
    } else {
      // If city is cleared, maybe reset to default? 
      // For now, keep current center or default
      fetchNearbyPlaces(map, center);
    }
  }, [city, dateType, map, fetchNearbyPlaces, geocodeCity]); // Added geocodeCity to deps

  // --- Render Steps ---

  if (!apiKey) {
    return (
      <div className="rounded-2xl bg-white/20 backdrop-blur-sm border border-white/40 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="bg-amber-100 p-3 rounded-full mb-3">
          <span className="text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-bold text-[var(--dark-accent)] mb-2">Google Maps Key Missing</h3>
        <p className="text-[var(--dark-accent)]/80 mb-4 max-w-md">
          To see the interactive map and nearby suggestions, you need to add your API key.
        </p>
        <div className="bg-black/5 p-4 rounded-lg text-left text-xs font-mono text-[var(--dark-accent)] w-full max-w-md overflow-x-auto mb-4">
          VITE_GOOGLE_MAPS_KEY=your_api_key_here
        </div>
        <p className="text-xs text-[var(--dark-accent)]/60">
          Add this to <code>frontend/ui/.env</code> and restart the server.
        </p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="rounded-2xl bg-red-50/50 backdrop-blur-sm border border-red-200 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <p className="text-red-600 font-bold mb-2">Google Maps Authentication Error</p>
        <p className="text-sm text-[var(--dark-accent)]/80 mb-4 max-w-md">
          Your API key is invalid or not authorized.
        </p>
        <ul className="text-xs text-left text-[var(--dark-accent)]/70 list-disc pl-5 space-y-1">
          <li>Check if <b>Billing is enabled</b> on your Google Cloud Project.</li>
          <li>Ensure <b>Maps JavaScript API</b> and <b>Places API</b> are enabled.</li>
          <li>Check API key restrictions (allow localhost).</li>
        </ul>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl bg-red-50/50 backdrop-blur-sm border border-red-200 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <p className="text-red-600 font-medium">Error loading Google Maps</p>
        <p className="text-sm text-red-500 mt-1">{loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center min-h-[320px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 border-2 border-[var(--dark-accent)] border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-[var(--dark-accent)]/70 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2 text-lg text-[var(--dark-accent)]" style={{ fontFamily: 'var(--font-heading)' }}>
          📍 Nearby {markers.length > 0 ? 'Suggestions' : 'Places'}
        </h3>
        {city && (
          <a
            href={`https://www.google.com/maps/search/${(dateType || 'date spots').replace(' ', '+')}+in+${city}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[var(--primary-accent)] hover:underline flex items-center gap-1"
          >
            Open in Maps ↗
          </a>
        )}
      </div>

      <div className="w-full rounded-2xl overflow-hidden border border-white/40 shadow-inner" style={{ height: '350px' }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={13}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            disableDefaultUI: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          {markers.map((m) =>
            m?.lat != null && m?.lng != null ? (
              <Marker
                key={m.id}
                position={{ lat: m.lat, lng: m.lng }}
                title={m.name}
                animation={window.google.maps.Animation.DROP}
              />
            ) : null
          )}
        </GoogleMap>
      </div>

      {markers.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {markers.map((m) => (
            <div key={m.id} className="bg-white/40 backdrop-blur-sm p-3 rounded-xl border border-white/30 flex items-center justify-between group hover:bg-white/60 transition-colors">
              <div>
                <p className="font-medium text-[var(--dark-accent)]">{m.name}</p>
                {m.rating && <p className="text-xs text-[var(--dark-accent)]/70">⭐ {m.rating} • {m.vicinity || 'Nearby'}</p>}
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.name)}&query_place_id=${m.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-[var(--primary-accent)] text-white px-2 py-1 rounded-md"
              >
                Go ↗
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-[var(--dark-accent)]/60 italic py-2">
          {city ? 'Scanning the area for spots...' : 'Enter a city to find places.'}
        </p>
      )}
    </div>
  );
}
