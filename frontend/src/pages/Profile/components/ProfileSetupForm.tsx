import React from 'react';
import { SendERC20 } from 'components/Transactions/ERC20'; // Adjust path as needed if SendERC20 is not in root components
import { ProfileRegistry } from 'components/Profile/ProfileRegistry'; // Adjust path as needed

interface ProfileSetupFormProps {
    connectedUserAddress: string | undefined;
    lastTxError: string;
    setLastTxError: (error: string) => void;
    publicKey: string;
    handleGenerateKeys: () => Promise<void>;
    isConnected: boolean;
    profilesContractAddress: string;
}

const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({
    connectedUserAddress,
    lastTxError,
    setLastTxError,
    publicKey,
    handleGenerateKeys,
    isConnected,
    profilesContractAddress,
}) => (
    <div>
        <h2>Set Up Your Profile</h2>
        <p>Your profile is not yet deployed. Complete the steps below to create it.</p>
        {connectedUserAddress && <p>Connected as: {connectedUserAddress}</p>}
        <SendERC20 setLastTxError={setLastTxError} />
        {lastTxError && (
            <div className="error-message">
                <p>Error: {lastTxError}</p>
            </div>
        )}
        <div style={{ marginTop: '20px' }}>
            <button
                onClick={handleGenerateKeys}
                disabled={!isConnected}
                style={{
                    padding: '10px 20px',
                    backgroundColor: isConnected ? '#4CAF50' : '#cccccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isConnected ? 'pointer' : 'not-allowed'
                }}
            >
                Generate Keys for Messaging (if needed)
            </button>
            {publicKey && (
                <div style={{ marginTop: '10px' }}>
                    <p>Generated Public Key:</p>
                    <code style={{
                        display: 'block',
                        padding: '10px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        wordBreak: 'break-all'
                    }}>
                        {publicKey}
                    </code>
                </div>
            )}
        </div>
        <div style={{ marginTop: '20px' }}>
            <ProfileRegistry
                setLastTxError={setLastTxError}
                contractAddress={profilesContractAddress as `0x${string}`}
            />
        </div>
    </div>
);

export default ProfileSetupForm;
