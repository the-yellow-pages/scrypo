// WalletProvider.js
import { useEffect, type ReactNode } from 'react';
import { useAccount, useConnect } from '@starknet-react/core';
import { useStarknetkitConnectModal, type Connector, type StarknetkitConnector } from 'starknetkit';


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { isConnected } = useAccount();
    // const [persistedAccount, setPersistedAccount] = useState(null);

    // Auto-reconnect
    useEffect(() => {
        const autoReconnect = async () => {
            const wasConnected = localStorage.getItem("starknetWalletConnected");
            if (wasConnected && !isConnected) {
                await connectWallet();
            }
        };

        autoReconnect();
    }, [isConnected]);

    // Persist connection
    useEffect(() => {
        if (isConnected) {
            localStorage.setItem("starknetWalletConnected", "true");
            // setPersistedAccount(account);
        }
    }, [isConnected]);

    // Listen for account changes
    // useEffect(() => {
    //     if (window.starknet) {
    //         window.starknet.on('accountsChanged', (accounts) => {
    //             if (accounts.length === 0) disconnectWallet();
    //         });
    //     }
    // }, []);
    const { connect, connectors } = useConnect();
    const { starknetkitConnectModal } = useStarknetkitConnectModal({
        connectors: connectors as StarknetkitConnector[],
    });

    async function connectWallet() {
        try {
            const { connector } = await starknetkitConnectModal();
            if (!connector) {
                console.error('No connector selected');
                return;
            }
            await connect({ connector: connector as Connector });
        } catch (error) {
            console.error('Wallet connection error:', error);
            alert('Failed to connect wallet: ' + (error instanceof Error ? error.message : String(error)));
        }
    }

    return <>{children}</>;
};
