import React from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getProfilesWithinArea } from '../../api/profiles';
import type { ProfileResponse } from '../../api/types';
// import { Link } from 'react-router-dom';
import { ProfilePopup } from '../../components/Profile/ProfilePopup';

const Maps = () => {
    const mapRef = React.useRef<MapRef>(null);
    const [selectedProfile, setSelectedProfile] = React.useState<ProfileResponse | null>(null);

    const [viewport, setViewport] = React.useState<{
        latitude: number;
        longitude: number;
        zoom: number;
        width: string | number;
        height: string | number;
    }>({
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 3,
        width: '100%',
        height: '80%',
    });

    const [selectedCoord, setSelectedCoord] = React.useState<{ latitude: number; longitude: number } | null>(null);

    const [profiles, setProfiles] = React.useState<ProfileResponse[]>([]);
    const [loading, setLoading] = React.useState(true);

    const mapboxAPIToken = "pk.eyJ1Ijoic3RldmVuZHNheWxvciIsImEiOiJja295ZmxndGEwbGxvMm5xdTc3M2MwZ2xkIn0.WDBLMZYfh-ZGFjmwO82xvw";
    const profilesContractAddress = import.meta.env.VITE_PROFILES_CONTRACT_ADDRESS;

    // Debounced fetch on map move
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProfilesWithinArea();
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [viewport.latitude, viewport.longitude, viewport.zoom]);

    const markerOnClick = (profile: ProfileResponse) => {
        const coord = profileToCoord(profile);
        // Center the map on the clicked marker
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();

            if (!bounds) return;
            // The bounds object represents the geographical bounding box of the currently 
            // visible area of the map. It is defined by two points: {
            //   "_sw": {
            //     "lng": -138.98518853180713,
            //     "lat": -1.029049213137938
            //   },
            //   "_ne": {
            //     "lng": -76.5825607424681,
            //     "lat": 65.86014725705485
            //   }
            // }
            console.log('bounds', bounds);
            const options = {
                center: { lng: coord.longitude, lat: coord.latitude },
            }
            mapRef.current.fitBounds(bounds, options);
        }
        setSelectedCoord(coord);
        setSelectedProfile(profile);
    }

    // Convert profile location to map coordinates
    const profileToCoord = (profile: ProfileResponse) => ({
        latitude: profile.location.y,
        longitude: profile.location.x,
    });

    const fetchProfilesWithinArea = async () => {
        if (!mapRef.current) return;
        const bounds = mapRef.current.getBounds();
        if (!bounds) return;
        // bounds._sw (southwest), bounds._ne (northeast)
        const x1 = bounds._sw.lng;
        const y1 = bounds._sw.lat;
        const x2 = bounds._ne.lng;
        const y2 = bounds._ne.lat;
        setLoading(true);
        const res = await getProfilesWithinArea(x1, y1, x2, y2);
        if (Array.isArray(res)) {
            setProfiles(res);
        } else {
            setProfiles([]);
        }
        setLoading(false);
    };

    return (
        <div style={{ height: '100%', padding: '1rem' }}>
            <div>
                {selectedCoord ? (
                    <div>Selected Coordinates: Latitude {selectedCoord.latitude}, Longitude {selectedCoord.longitude}</div>
                ) : (
                    <div>Click on a marker to see its coordinates</div>
                )}
            </div>
            <div style={{ margin: '0.5rem 0' }}>
                {/* <button onClick={fetchProfilesWithinArea} disabled={loading} style={{ marginLeft: '1rem' }}>
                    Fetch Profiles Within Area
                </button> */}
            </div>
            <Map
                {...viewport}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={mapboxAPIToken}
                onMove={(evt) => setViewport({ ...viewport, ...evt.viewState })}
                style={{ height: '80%' }}
                ref={mapRef}
            >
                {profiles.map((profile, index) => {
                    const coord = profileToCoord(profile);
                    return (
                        <Marker key={profile.address || index} latitude={coord.latitude} longitude={coord.longitude}>
                            <div
                                onClick={() => markerOnClick(profile)}
                                style={{
                                    backgroundColor:
                                        selectedCoord?.latitude === coord.latitude && selectedCoord?.longitude === coord.longitude
                                            ? 'red'
                                            : 'blue',
                                    borderRadius: '50%',
                                    width: '10px',
                                    height: '10px',
                                    cursor: 'pointer'
                                }}
                                title={profile.name || profile.address}
                            ></div>
                        </Marker>
                    );
                })}

                {selectedProfile && selectedCoord && profilesContractAddress && (
                    <ProfilePopup
                        profile={selectedProfile}
                        latitude={selectedCoord.latitude}
                        longitude={selectedCoord.longitude}
                        onClose={() => {
                            setSelectedProfile(null);
                            setSelectedCoord(null);
                        }}
                        contractAddress={profilesContractAddress}
                    />
                )}
            </Map>
            <div style={{ marginTop: '1rem' }}>
                <h3>Profiles List</h3>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <ul>
                        {profiles.map((profile) => (
                            <li key={profile.address}>
                                <strong>{profile.name || profile.address}</strong>
                                {' '}
                                (x: {profile.location.x}, y: {profile.location.y})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Maps;