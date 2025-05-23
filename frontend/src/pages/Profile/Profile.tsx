import { SendERC20 } from 'components/Transactions/ERC20';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfileByAddress } from '../../api/profiles';
import { type ProfileResponse, type ErrorResponse } from '../../api/types';
import { useAccount } from "@starknet-react/core";
import { Button } from 'components/Button';

// Import Helper Sub-components
import LoadingIndicator from './components/LoadingIndicator';
import FetchErrorMessage from './components/FetchErrorMessage';
import FetchedProfileDisplay from './components/FetchedProfileDisplay';
import ProfileNotFoundMessage from './components/ProfileNotFoundMessage';
import ConnectWalletPromptMessage from './components/ConnectWalletPromptMessage';

function Profile() {
    const [lastTxError, setLastTxError] = useState("");
    const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const navigate = useNavigate();

    const { address: addressFromUrl } = useParams<{ address?: string }>();
    const { address: connectedUserAddress, isConnected } = useAccount();

    const targetAddress = addressFromUrl || connectedUserAddress;

    const profilesContractAddress = import.meta.env.VITE_PROFILES_CONTRACT_ADDRESS;
    if (!profilesContractAddress) {
        throw new Error("VITE_PROFILES_CONTRACT_ADDRESS environment variable is not set");
    }

    useEffect(() => {
        if (targetAddress) {
            setIsLoading(true);
            setProfileData(null);
            setFetchError(null);
            getProfileByAddress(targetAddress)
                .then(response => {
                    if (response && typeof response === 'object' && 'error' in response) {
                        const errorResponse = response as ErrorResponse;
                        const detailsString = String(errorResponse.error);
                        if (detailsString.toLowerCase().includes("not found")) {
                            setProfileData(null);
                        } else {
                            setFetchError(detailsString || "Failed to fetch profile data.");
                        }
                    } else if (response && typeof response === 'object' && 'address' in response) {
                        setProfileData(response as ProfileResponse);
                    } else {
                        setFetchError("Received an invalid or empty response from the server.");
                        setProfileData(null);
                    }
                })
                .catch(err => {
                    console.error('Fetch profile error:', err);
                    setFetchError(err instanceof Error ? err.message : "An unknown error occurred while fetching profile.");
                    setProfileData(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [targetAddress]);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (fetchError) {
        return <FetchErrorMessage error={fetchError} />;
    }

    if (!isConnected && !addressFromUrl) {
        return <ConnectWalletPromptMessage />;
    }

    const isOwnProfile = targetAddress === connectedUserAddress;

    return (
        <div className="p-4">
            {lastTxError && (
                <div className="error-message p-4 bg-red-100 border border-red-400 rounded mb-4">
                    <p>Error: {lastTxError}</p>
                </div>
            )}

            {/* Profile Data Section */}
            {profileData ? (
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <FetchedProfileDisplay 
                        profileData={profileData} 
                        isOwnProfile={isOwnProfile} 
                        profilesContractAddress={profilesContractAddress}
                    />
                </div>
            ) : addressFromUrl ? (
                <ProfileNotFoundMessage address={addressFromUrl} />
            ) : null}

            {/* Actions Section - Always visible for own profile */}
            {isOwnProfile && (
                <div className="mt-4">
                    {/* Profile Action Button */}
                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                        <Button
                            onClick={() => navigate('/profile/deploy', { 
                                state: { profile: profileData } 
                            })}
                            className="w-full"
                            hideChevron
                        >
                            {profileData ? 'Edit Profile' : 'Create Profile'}
                        </Button>
                    </div>

                    {/* Token Transfer Section */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Send Tokens</h3>
                        <SendERC20 setLastTxError={setLastTxError} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;