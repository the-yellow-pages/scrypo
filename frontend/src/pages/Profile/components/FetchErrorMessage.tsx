import React from 'react';

interface FetchErrorMessageProps {
    error: string | null;
}

const FetchErrorMessage: React.FC<FetchErrorMessageProps> = ({ error }) => (
    <div className="error-message">Error: {error}</div>
);

export default FetchErrorMessage;
