import { SendERC20 } from 'components/Transactions/ERC20';
import { useState } from 'react';
import { useUserKeyGenerator } from 'msg/UserKeyGenerator';
import { ProfileRegistry } from 'components/Profile/ProfileRegistry';

function Profile() {
    const [lastTxError, setLastTxError] = useState("");
    const [publicKey, setPublicKey] = useState<string>("");
    const { generateKeys, isConnected } = useUserKeyGenerator();
    
    const profilesContractAddress = import.meta.env.VITE_PROFILES_CONTRACT_ADDRESS
    if (!profilesContractAddress) {
        throw new Error("VITE_PROFILES_CONTRACT_ADDRESS environment variable is not set")
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
        <div>
            <h2>Profile Page</h2>
            <p>This is the Profile page content.</p>
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
                    Generate Keys
                </button>
                {publicKey && (
                    <div style={{ marginTop: '10px' }}>
                        <p>Public Key:</p>
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
                    contractAddress={profilesContractAddress}
                />
            </div>
        </div>
    );
}

export default Profile;