import React from 'react';
import { type ProfileResponse } from '../../../api/types'; // Adjusted import path

interface FetchedProfileDisplayProps {
    profileData: ProfileResponse;
    isOwnProfile: boolean;
    profilesContractAddress?: string;
}

const FetchedProfileDisplay: React.FC<FetchedProfileDisplayProps> = ({ profileData, isOwnProfile }) => (
    <div>
        <h2>
            {profileData.name || `Profile of ${profileData.address}`}
            {isOwnProfile && <span> (Your Profile)</span>}
        </h2>
        <p><strong>Address:</strong> {profileData.address}</p>
        <p><strong>Username:</strong> {profileData.name || "Not set"}</p>
        <div>
            <p><strong>Tags:</strong></p>
            <ul>
                {[profileData.tags0, profileData.tags1, profileData.tags2, profileData.tags3]
                    .filter(tag => tag !== null && tag !== undefined && tag !== '')
                    .map((tag, index) => (
                        <li key={index}>{tag}</li>
                    ))}
                {![profileData.tags0, profileData.tags1, profileData.tags2, profileData.tags3]
                    .some(tag => tag !== null && tag !== undefined && tag !== '') &&
                    <li>No tags set</li>
                }
            </ul>
        </div>
        <p><strong>Location:</strong> {profileData.location.x}, {profileData.location.y}</p>
        <p><strong>Public Key:</strong> {profileData.pubkey_hi || "Not set"}</p>
        <p><strong>Public Key (Low):</strong> {profileData.pubkey_lo || "Not set"}</p>
    </div>
);

export default FetchedProfileDisplay;
