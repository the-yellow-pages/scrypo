import { SendERC20 } from 'components/Transactions/ERC20';
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useUserKeyGenerator } from 'msg/UserKeyGenerator';
import { useParams } from 'react-router-dom';
import { getProfileByAddress } from '../../api/profiles';
import { type ProfileResponse, type ErrorResponse } from '../../api/types';
import { useAccount } from "@starknet-react/core";

// --- Import Helper Sub-components ---
import LoadingIndicator from './components/LoadingIndicator';
import FetchErrorMessage from './components/FetchErrorMessage';
import FetchedProfileDisplay from './components/FetchedProfileDisplay';
import ProfileSetupForm from './components/ProfileSetupForm';
import ProfileNotFoundMessage from './components/ProfileNotFoundMessage';
import ConnectWalletPromptMessage from './components/ConnectWalletPromptMessage';
import ProfilePageFallback from './components/ProfilePageFallback';


function Profile() {
    const [lastTxError, setLastTxError] = useState("");
    const [publicKey, setPublicKey] = useState<string>("");
    const { generateKeys } = useUserKeyGenerator();

    const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

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
                    // Type guard for ErrorResponse based on 'details'
                    if (response && typeof response === 'object' && 'error' in response) {
                        const errorResponse = response as ErrorResponse;
                        const detailsString = String(errorResponse.error);
                        if (detailsString.toLowerCase().includes("not found")) {
                            setProfileData(null);
                        } else {
                            setFetchError(detailsString || "Failed to fetch profile data.");
                        }
                        // Type guard for ProfileResponse based on 'address' (assuming it's a unique key for profiles)
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
        } else {
            setProfileData(null);
            setIsLoading(false);
            setFetchError(null); // Clear fetch error if no targetAddress
        }
        console.log(isConnected, targetAddress, connectedUserAddress, profileData);
        console.log("Address from URL:", addressFromUrl);
    }, [targetAddress]);

    const handleGenerateKeys = useCallback(async () => { // useCallback for stable prop
        try {
            console.log('Starting key generation...');
            const { publicKey: newPublicKey } = await generateKeys();
            console.log('Received public key:', newPublicKey);
            if (!newPublicKey || newPublicKey.length === 0) {
                throw new Error('Generated public key is empty');
            }
            const hexKey = Array.from(newPublicKey).map(b => b.toString(16).padStart(2, '0')).join('');
            console.log('Converted to hex:', hexKey);
            setPublicKey(hexKey);
        } catch (error) {
            console.error('Key generation error:', error);
            setLastTxError(error instanceof Error ? error.message : "Failed to generate keys");
        }
    }, [generateKeys]); // Added generateKeys to dependency array

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (fetchError) {
        // Don't show setup form if there was a fetch error, even for own profile
        return <FetchErrorMessage error={fetchError} />;
    }

    // Case 1: Displaying a fetched profile
    if (profileData && targetAddress) {
        return <FetchedProfileDisplay profileData={profileData} isOwnProfile={targetAddress === connectedUserAddress} />;
    }

    // Case 2: Connected user's profile doesn't exist (and no fetch error), show setup UI
    if (isConnected && targetAddress === connectedUserAddress && !profileData) {
        return (
            <ProfileSetupForm
                connectedUserAddress={connectedUserAddress}
                lastTxError={lastTxError}
                setLastTxError={setLastTxError}
                publicKey={publicKey}
                handleGenerateKeys={handleGenerateKeys}
                isConnected={isConnected}
                profilesContractAddress={profilesContractAddress}
            />
        );
    }

    // Case 3: Viewing someone else's profile (via URL) and it doesn't exist (and no fetch error)
    if (addressFromUrl && targetAddress === addressFromUrl && !profileData) {
        return <ProfileNotFoundMessage address={addressFromUrl} />;
    }

    // Case 4: Not connected and no specific address in URL to view
    if (!isConnected && !addressFromUrl) {
        return <ConnectWalletPromptMessage />;
    }

    // Fallback for any other unhandled state
    return <ProfilePageFallback />;
}

export default Profile;