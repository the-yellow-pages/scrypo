import React, { useState, useEffect } from 'react';
import { type ProfileResponse } from '../../../api/types';
import { AVAILABLE_TAGS } from '../../../components/Tags/tags';
import { getCityFromCoordinates, type GeocodeResult } from '../../../utils/geocoding';
import '../../../styles/profile.css';

interface FetchedProfileDisplayProps {
    profileData: ProfileResponse;
    isOwnProfile: boolean;
    profilesContractAddress?: string;
}

const FetchedProfileDisplay: React.FC<FetchedProfileDisplayProps> = ({ profileData, isOwnProfile }) => {
    const [showAddressDetails, setShowAddressDetails] = useState(false);
    const [cityInfo, setCityInfo] = useState<GeocodeResult | null>(null);
    const [loadingCity, setLoadingCity] = useState(false);

    // Fetch city information when component mounts
    useEffect(() => {
        const fetchCityInfo = async () => {
            if (profileData.location.x && profileData.location.y) {
                setLoadingCity(true);
                try {
                    const lat = profileData.location.y;
                    const lng = profileData.location.x;

                    // Only fetch if coordinates are valid
                    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                        const result = await getCityFromCoordinates(lat, lng);
                        setCityInfo(result);
                    }
                } catch (error) {
                    console.error('Error fetching city info:', error);
                } finally {
                    setLoadingCity(false);
                }
            }
        };

        fetchCityInfo();
    }, [profileData.location.x, profileData.location.y]);

    // Convert bit flags back to tag objects
    const getTagsFromBitFlags = () => {
        const selectedTags: Array<{ id: string; label: string; icon: string }> = [];

        // Check tags0 (first 32 tags)
        if (profileData.tags0) {
            const tags0Value = typeof profileData.tags0 === 'string' ? parseInt(profileData.tags0) : profileData.tags0;
            for (let i = 0; i < 32 && i < AVAILABLE_TAGS.length; i++) {
                if (tags0Value & (1 << i)) {
                    selectedTags.push(AVAILABLE_TAGS[i]);
                }
            }
        }

        // Check tags1 (next 32 tags)
        if (profileData.tags1) {
            const tags1Value = typeof profileData.tags1 === 'string' ? parseInt(profileData.tags1) : profileData.tags1;
            for (let i = 32; i < 64 && i < AVAILABLE_TAGS.length; i++) {
                if (tags1Value & (1 << (i - 32))) {
                    selectedTags.push(AVAILABLE_TAGS[i]);
                }
            }
        }

        return selectedTags;
    };

    const selectedTags = getTagsFromBitFlags();

    const getCityDisplay = () => {
        if (loadingCity) return "Loading...";
        if (cityInfo) {
            return cityInfo.state ? `${cityInfo.city}, ${cityInfo.state}` : cityInfo.city;
        }
        return "Not available";
    };

    return (
        <div className="profile-display">
            <div className="profile-header">
                <h2 className="profile-title">
                    {profileData.name || `Profile of ${profileData.address.slice(0, 8)}...`}
                </h2>
                {isOwnProfile && <p className="profile-subtitle">Your Profile</p>}
            </div>

            <div className="profile-section">
                <h3 className="profile-section-title">Tags</h3>
                <div className="profile-tags-container">
                    {selectedTags.length > 0 ? (
                        <div className="profile-tags-grid">
                            {selectedTags.map((tag) => (
                                <div key={tag.id} className="profile-tag-display">
                                    <span className="profile-tag-icon">{tag.icon}</span>
                                    <span className="profile-tag-label">{tag.label}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="profile-no-tags">No tags set</div>
                    )}
                </div>
            </div>

            <div className="profile-section">
                <h3 className="profile-section-title">Location</h3>
                <div className="profile-location">
                    <div className="profile-field">
                        <span className="profile-field-label">City:</span>
                        <span className="profile-field-value">{getCityDisplay()}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-field-label">Latitude:</span>
                        <span className="profile-field-value">{profileData.location.y}</span>
                    </div>
                    <div className="profile-field">
                        <span className="profile-field-label">Longitude:</span>
                        <span className="profile-field-value">{profileData.location.x}</span>
                    </div>
                </div>
            </div>

            <div className="profile-section">
                <button
                    className="profile-accordion-trigger"
                    onClick={() => setShowAddressDetails(!showAddressDetails)}
                >
                    <h3 className="profile-section-title">Address Details</h3>
                    <span className="profile-accordion-icon">
                        {showAddressDetails ? '−' : '+'}
                    </span>
                </button>

                {showAddressDetails && (
                    <div className="profile-accordion-content">
                        <div className="profile-field">
                            <span className="profile-field-label">Wallet Address:</span>
                            <span className="profile-field-value">{profileData.address}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-field-label">Public Key (High):</span>
                            <span className="profile-field-value">{profileData.pubkey_hi || "Not set"}</span>
                        </div>
                        <div className="profile-field">
                            <span className="profile-field-label">Public Key (Low):</span>
                            <span className="profile-field-value">{profileData.pubkey_lo || "Not set"}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FetchedProfileDisplay;
