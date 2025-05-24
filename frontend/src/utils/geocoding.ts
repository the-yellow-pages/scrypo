export interface GeocodeResult {
    city: string;
    country: string;
    state?: string;
}

export const getCityFromCoordinates = async (lat: number, lng: number): Promise<GeocodeResult | null> => {
    try {
        const mapboxAPIToken = "pk.eyJ1Ijoic3RldmVuZHNheWxvciIsImEiOiJja295ZmxndGEwbGxvMm5xdTc3M2MwZ2xkIn0.WDBLMZYfh-ZGFjmwO82xvw";

        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxAPIToken}&types=place`
        );

        if (!response.ok) {
            throw new Error('Geocoding request failed');
        }

        const data = await response.json();

        if (data && data.features && data.features.length > 0) {
            const feature = data.features[0];
            const placeName = feature.place_name || '';
            const text = feature.text || '';

            // Extract context information
            const context = feature.context || [];
            let country = '';
            let state = '';

            context.forEach((item: any) => {
                if (item.id.includes('country')) {
                    country = item.text;
                } else if (item.id.includes('region')) {
                    state = item.text;
                }
            });

            return {
                city: text || 'Unknown',
                country: country || 'Unknown',
                state: state
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching city from coordinates:', error);
        return null;
    }
};
