import { SendERC20 } from 'components/Transactions/ERC20';
import { useState } from 'react';
import { useUserKeyGenerator } from 'msg/UserKeyGenerator';

function Profile() {
    const [lastTxError, setLastTxError] = useState("");
    const [publicKey, setPublicKey] = useState<string>("");
    const { generateKeys, isConnected } = useUserKeyGenerator();

    const handleGenerateKeys = async () => {
        try {
            const { publicKey: newPublicKey } = await generateKeys();
            setPublicKey(Buffer.from(newPublicKey).toString('hex'));
        } catch (error) {
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
        </div>
    );
}

export default Profile;