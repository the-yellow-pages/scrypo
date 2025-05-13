import React from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

type Coordinates = {
    latitude: number;
    longitude: number;
};

const Maps = () => {
    const coordinates = [
        { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
        { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
        { latitude: 40.7128, longitude: -74.0060 },  // New York
    ];
    const mapRef = React.useRef<MapRef>(null);

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

    const mapboxAPIToken = "pk.eyJ1Ijoic3RldmVuZHNheWxvciIsImEiOiJja295ZmxndGEwbGxvMm5xdTc3M2MwZ2xkIn0.WDBLMZYfh-ZGFjmwO82xvw";

    const markerOnClick = (coord: Coordinates) => {
        // Center the map on the clicked marker
        if (mapRef.current) {
            const bounds = mapRef.current.getBounds();

            if (!bounds) return;
            const options = {
                center: { lng: coord.longitude, lat: coord.latitude },

            }
            mapRef.current.fitBounds(bounds, options,);
        }
        setSelectedCoord(coord)
    }
    return (
        <div style={{
            height: '100%',
            padding: '1rem'
        }}>
            <div style={{
            }
            }>
                {selectedCoord ? (
                    <div>Selected Coordinates: Latitude {selectedCoord.latitude}, Longitude {selectedCoord.longitude}</div>
                ) : (
                    <div>Click on a marker to see its coordinates</div>
                )}
            </div>
            <Map
                {...viewport}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={mapboxAPIToken}
                onMove={(evt) => setViewport({ ...viewport, ...evt.viewState })}
                style={{ height: '80%' }}
                ref={mapRef}
            >
                {coordinates.map((coord, index) => (
                    <Marker key={index} latitude={coord.latitude} longitude={coord.longitude}>
                        <div
                            onClick={() => markerOnClick(coord)}
                            style={{
                                backgroundColor: selectedCoord?.latitude === coord.latitude && selectedCoord?.longitude === coord.longitude ? 'red' : 'blue',
                                borderRadius: '50%',
                                width: '10px',
                                height: '10px',
                                cursor: 'pointer'
                            }}
                        ></div>
                    </Marker>
                ))}
            </Map>
        </div>
    );
};

export default Maps;