import React from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getProfilesWithinArea, getProfileByAddress } from '../../api/profiles';
import type { ProfileResponse } from '../../api/types';
// import { Link } from 'react-router-dom';
import { ProfilePopup } from '../../components/Profile/ProfilePopup';
import { TagFilter } from '../../components/Tags/TagFilter';
import { AVAILABLE_TAGS } from '../../components/Tags/tags';
import { useAccount } from "@starknet-react/core";
import { addressesEqual } from '../../utils/addressHelpers';

const Maps = () => {
    const mapRef = React.useRef<MapRef>(null);
    const [selectedProfile, setSelectedProfile] = React.useState<ProfileResponse | null>(null);
    const { address: connectedUserAddress } = useAccount();
    const [userProfile, setUserProfile] = React.useState<ProfileResponse | null>(null);
    const [filterTags, setFilterTags] = React.useState<string[]>([]);

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

    // Fetch user's profile to center map on their location
    React.useEffect(() => {
        if (connectedUserAddress) {
            getProfileByAddress(connectedUserAddress)
                .then(response => {
                    if (response && typeof response === 'object' && 'address' in response) {
                        const profile = response as ProfileResponse;
                        setUserProfile(profile);
                        // Center map on user's location
                        setViewport(prev => ({
                            ...prev,
                            latitude: profile.location.y,
                            longitude: profile.location.x,
                            zoom: 10 // Zoom in more when centering on user
                        }));
                    }
                })
                .catch(err => {
                    console.log('Could not fetch user profile for map centering:', err);
                });
        }
    }, [connectedUserAddress]);

    // Debounced fetch on map move
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProfilesWithinArea();
        }, 500); // 500ms delay

        return () => clearTimeout(timeoutId);
    }, [viewport.latitude, viewport.longitude, viewport.zoom]);

    const markerOnClick = (profile: ProfileResponse) => {
        // Don't allow clicking on own marker
        if (addressesEqual(profile.address, connectedUserAddress)) {
            console.log('Clicked on own marker, ignoring');
            return;
        }

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

    // Helper function to check if profile has specific tags based on bit flags
    const profileHasTag = (profile: ProfileResponse, tagId: string): boolean => {
        const tagIndex = AVAILABLE_TAGS.findIndex(tag => tag.id === tagId);
        if (tagIndex < 0) return false;

        // Get the bit flag values from profile and ensure they're numbers
        const tags0 = Number(profile.tags0 || 0);
        const tags1 = Number(profile.tags1 || 0);

        if (tagIndex < 32) {
            return (tags0 & (1 << tagIndex)) !== 0;
        } else if (tagIndex < 64) {
            return (tags1 & (1 << (tagIndex - 32))) !== 0;
        }

        return false;
    };

    // Filter profiles based on selected tags
    const filteredProfiles = React.useMemo(() => {
        if (filterTags.length === 0) {
            return profiles;
        }

        return profiles.filter(profile => {
            // Always show user's own profile regardless of filter tags
            if (addressesEqual(profile.address, connectedUserAddress)) {
                return true;
            }

            // Check if profile has any of the selected filter tags
            return filterTags.some(filterTag => profileHasTag(profile, filterTag));
        });
    }, [profiles, filterTags, connectedUserAddress]);

    return (
        <div style={{ height: '100%', padding: '1rem' }}>
            <div>
                {selectedCoord ? (
                    <div>Selected Coordinates: Latitude {selectedCoord.latitude}, Longitude {selectedCoord.longitude}</div>
                ) : (
                    <div>Click on a marker to see its coordinates</div>
                )}
            </div>

            <TagFilter
                selectedTags={filterTags}
                onTagsChange={setFilterTags}
                maxTags={5}
            />

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
                {filteredProfiles.map((profile, index) => {
                    const coord = profileToCoord(profile);
                    const isOwnProfile = addressesEqual(profile.address, connectedUserAddress);
                    const isSelected = selectedCoord?.latitude === coord.latitude && selectedCoord?.longitude === coord.longitude;

                    console.log('Profile:', profile.address, 'Connected:', connectedUserAddress, 'IsOwn:', isOwnProfile);

                    return (
                        <Marker key={profile.address || index} latitude={coord.latitude} longitude={coord.longitude}>
                            <div
                                onClick={() => markerOnClick(profile)}
                                style={{
                                    backgroundColor: isOwnProfile
                                        ? 'green'
                                        : isSelected
                                            ? 'red'
                                            : 'blue',
                                    borderRadius: '50%',
                                    width: isOwnProfile ? '12px' : '10px',
                                    height: isOwnProfile ? '12px' : '10px',
                                    cursor: isOwnProfile ? 'default' : 'pointer',
                                    border: isOwnProfile ? '2px solid darkgreen' : 'none',
                                    boxSizing: 'border-box',
                                    opacity: isOwnProfile ? 0.8 : 1
                                }}
                                title={isOwnProfile ? `You (${profile.name || profile.address})` : (profile.name || profile.address)}
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
                {filterTags.length > 0 && (
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        Showing {filteredProfiles.length} of {profiles.length} profiles
                    </p>
                )}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <ul>
                        {filteredProfiles.map((profile) => (
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