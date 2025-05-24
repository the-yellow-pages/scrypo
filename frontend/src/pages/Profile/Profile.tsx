import { SendERC20 } from 'components/Transactions/ERC20';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getProfileByAddress } from '../../api/profiles';
import { type ProfileResponse, type ErrorResponse } from '../../api/types';
import { useAccount } from "@starknet-react/core";
import { Button } from 'components/Button';
import '../../styles/profile.css';
import '../../styles/form.css';
import { addressesEqual } from '../../utils/addressHelpers';

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
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const navigate = useNavigate();
    const location = useLocation();

    const { address: addressFromUrl } = useParams<{ address?: string }>();
    const { address: connectedUserAddress, isConnected } = useAccount();

    const targetAddress = addressFromUrl || connectedUserAddress;

    const profilesContractAddress = import.meta.env.VITE_PROFILES_CONTRACT_ADDRESS;
    if (!profilesContractAddress) {
        throw new Error("VITE_PROFILES_CONTRACT_ADDRESS environment variable is not set");
    }

    const fetchProfileData = (address: string) => {
        setIsLoading(true);
        setProfileData(null);
        setFetchError(null);
        getProfileByAddress(address)
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
    };

    const refreshProfile = () => {
        if (targetAddress) {
            fetchProfileData(targetAddress);
            setRefreshKey(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (targetAddress) {
            fetchProfileData(targetAddress);
        }
    }, [targetAddress, refreshKey]);

    // Check if user returned from profile creation/editing and refresh data
    useEffect(() => {
        const state = location.state as { profileUpdated?: boolean; profile?: any } | null;
        if (state?.profileUpdated || state?.profile) {
            // Clear the state to prevent unnecessary refetches
            window.history.replaceState({}, '', location.pathname);
            // Force refresh with a delay to ensure backend is updated
            setTimeout(() => {
                refreshProfile();
            }, 1000);
        }
    }, [location.state]);

    // Listen for focus events to refresh when user returns to tab
    useEffect(() => {
        const handleFocus = () => {
            if (document.visibilityState === 'visible' && targetAddress) {
                refreshProfile();
            }
        };

        document.addEventListener('visibilitychange', handleFocus);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleFocus);
            window.removeEventListener('focus', handleFocus);
        };
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

    const isOwnProfile = addressesEqual(targetAddress, connectedUserAddress);

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
            ) : isOwnProfile ? (
                <div className="bg-blue-50 p-6 rounded-lg shadow mb-4 border border-blue-200">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">Welcome to Scrypo!</h2>
                        <div className="text-blue-800 mb-6 space-y-3">
                            <p className="text-lg">
                                Create your profile to unlock the full potential of our crypto community platform.
                            </p>
                            <div className="text-left max-w-2xl mx-auto">
                                <h3 className="font-semibold mb-2">With your profile, you can:</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    <li>Connect with other crypto enthusiasts and traders in your area</li>
                                    <li>Discover crypto-friendly businesses and services near you</li>
                                    <li>Receive tokens and payments from other users</li>
                                    <li>Build your reputation in the crypto community</li>
                                    <li>Access location-based crypto events and meetups</li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-sm text-blue-600 italic">
                            Join our growing network of crypto users and help build a more connected crypto ecosystem!
                        </p>
                    </div>
                </div>
            ) : null}

            {/* Actions Section */}
            {(isOwnProfile || (!isOwnProfile && profileData)) && (
                <div className="bg-white p-6 rounded-lg shadow mt-4">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: !isOwnProfile && profileData ? '24px' : '0'
                    }}>
                        {isOwnProfile && (
                            <button
                                onClick={refreshProfile}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                                title="Refresh profile data"
                            >
                                🔄
                            </button>
                        )}

                        <div style={{ display: 'flex', gap: '16px' }}>
                            {isOwnProfile && (
                                <button
                                    onClick={() => navigate('/profile/deploy', {
                                        state: { profile: profileData }
                                    })}
                                    className="form-button form-button-large"
                                >
                                    {profileData ? 'Edit Profile' : 'Create Profile'}
                                </button>
                            )}

                            {!isOwnProfile && profileData && (
                                <button
                                    onClick={() => {
                                        // Toggle or navigate to send tokens section
                                        const sendSection = document.getElementById('send-tokens-section');
                                        if (sendSection) {
                                            sendSection.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="form-button form-button-large"
                                >
                                    Send Tokens
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Profile;