import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileDeployForm } from "../../components/Profile/ProfileDeployForm";
import { useUserKeyGenerator } from "msg/UserKeyGenerator";
import type { ProfileResponse } from "../../api/types";

function ProfileDeploy() {
    const [lastTxError, setLastTxError] = useState("");
    const [publicKey, setPublicKey] = useState<string>("");
    const { generateKeys } = useUserKeyGenerator();
    const navigate = useNavigate();
    const location = useLocation();
    const existingProfile = location.state?.profile as ProfileResponse | undefined;

    const profilesContractAddress = import.meta.env.VITE_PROFILES_CONTRACT_ADDRESS;
    if (!profilesContractAddress) {
        throw new Error("VITE_PROFILES_CONTRACT_ADDRESS environment variable is not set");
    }

    const handleGenerateKeys = async () => {
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
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {existingProfile ? 'Update Profile' : 'Create New Profile'}
                </h1>
                <button 
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    ← Back
                </button>
            </div>

            {lastTxError && (
                <div className="error-message p-4 bg-red-100 border border-red-400 rounded mb-4">
                    <p>Error: {lastTxError}</p>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <ProfileDeployForm
                    setLastTxError={setLastTxError}
                    contractAddress={profilesContractAddress as `0x${string}`}
                    publicKey={publicKey}
                    handleGenerateKeys={handleGenerateKeys}
                    existingProfile={existingProfile}
                    onSuccess={() => {
                        // Navigate back to profile page after successful deployment/update
                        navigate(-1);
                    }}
                />
            </div>
        </div>
    );
}

export default ProfileDeploy; 