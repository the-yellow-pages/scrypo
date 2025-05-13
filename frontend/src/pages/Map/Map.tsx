import React from 'react';
import MapGL, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
    const coordinates = [
        { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
        { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
        { latitude: 40.7128, longitude: -74.0060 },  // New York
    ];

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
        height: '100%',
    });
    const mapboxAPIToken = "pk.eyJ1Ijoic3RldmVuZHNheWxvciIsImEiOiJja295ZmxndGEwbGxvMm5xdTc3M2MwZ2xkIn0.WDBLMZYfh-ZGFjmwO82xvw"

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <MapGL
                {...viewport}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={mapboxAPIToken} // Fixed prop name
                onMove={(evt) => setViewport({ ...viewport, ...evt.viewState })} // Merging viewState with viewport
            >
                {coordinates.map((coord, index) => (
                    <Marker key={index} latitude={coord.latitude} longitude={coord.longitude}>
                        <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '10px', height: '10px' }}></div>
                    </Marker>
                ))}
            </MapGL>
        </div>
    );
};

export default Map;