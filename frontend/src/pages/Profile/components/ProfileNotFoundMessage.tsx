import React from 'react';

interface ProfileNotFoundMessageProps {
    address: string;
}

const ProfileNotFoundMessage: React.FC<ProfileNotFoundMessageProps> = ({ address }) => (
    <div>Profile not found for address: {address}</div>
);

export default ProfileNotFoundMessage;
