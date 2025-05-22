import React, { useState } from 'react';
import { type ProfileResponse } from '../../api/types';
import { Button } from '../Button';
import { ProfileDeployForm } from './ProfileDeployForm';
import { SendERC20 } from '../Transactions/ERC20';

interface FetchedProfileDisplayProps {
    profileData: ProfileResponse;
    isOwnProfile: boolean;
    profilesContractAddress?: string;
}

const FetchedProfileDisplay: React.FC<FetchedProfileDisplayProps> = ({ 
    profileData, 
    isOwnProfile,
    profilesContractAddress
}) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [lastTxError, setLastTxError] = useState("");

    return (
        <div className="flex flex-col gap-4">
            {lastTxError && (
                <div className="error-message p-4 bg-red-100 border border-red-400 rounded">
                    <p>Error: {lastTxError}</p>
                </div>
            )}

            {showEditForm && isOwnProfile && profilesContractAddress ? (
                <div className="bg-gray-50 p-4 rounded-lg shadow">
                    <ProfileDeployForm
                        setLastTxError={setLastTxError}
                        contractAddress={profilesContractAddress as `0x${string}`}
                        existingProfile={profileData}
                        onSuccess={() => setShowEditForm(false)}
                    />
                    <Button 
                        className="mt-4"
                        onClick={() => setShowEditForm(false)}
                        hideChevron
                    >
                        Cancel
                    </Button>
                </div>
            ) : (
                <>
                    <div className="profile-header">
                        <h2 className="text-2xl font-bold">
                            {profileData.name || `Profile of ${profileData.address}`}
                            {isOwnProfile && <span className="text-gray-500 ml-2">(Your Profile)</span>}
                        </h2>
                    </div>

                    <div className="profile-details bg-white p-4 rounded-lg shadow">
                        <p><strong>Address:</strong> {profileData.address}</p>
                        <p><strong>Username:</strong> {profileData.name || "Not set"}</p>
                        <div>
                            <p><strong>Tags:</strong></p>
                            <ul className="list-disc pl-5">
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

                    <div className="profile-actions flex flex-col gap-2 mt-4">
                        {isOwnProfile && profilesContractAddress && (
                            <Button 
                                onClick={() => setShowEditForm(true)}
                                hideChevron
                            >
                                Edit Profile
                            </Button>
                        )}
                        
                        {/* Always show SendERC20 component */}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Send Tokens</h3>
                            <SendERC20 setLastTxError={setLastTxError} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default FetchedProfileDisplay; 