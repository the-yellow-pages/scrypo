import React from 'react';

interface ProfilePageFallbackProps { }

const ProfilePageFallback: React.FC<ProfilePageFallbackProps> = () => (
    <div>
        <h2>Profile Page</h2>
        <p>Unable to determine profile to display. If you are connected, ensure your wallet address is available.</p>
    </div>
);

export default ProfilePageFallback;
