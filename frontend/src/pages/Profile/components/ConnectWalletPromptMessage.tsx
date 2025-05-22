import React from 'react';

interface ConnectWalletPromptMessageProps { }

const ConnectWalletPromptMessage: React.FC<ConnectWalletPromptMessageProps> = () => (
    <div>
        <h2>Profile Page</h2>
        <p>Please connect your wallet to view or set up your profile. You can also view a specific profile by navigating to /profile/wallet_address.</p>
    </div>
);

export default ConnectWalletPromptMessage;
