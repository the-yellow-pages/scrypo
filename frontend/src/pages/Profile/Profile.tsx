import { SendERC20 } from 'components/Transactions/ERC20';
import { useState } from 'react';

function Profile() {
    const [lastTxError, setLastTxError] = useState("");
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
        </div>
    );
}

export default Profile;