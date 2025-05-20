'use client';

import {
    Connector,
    useAccount,
    useConnect,
    useDisconnect,
} from '@starknet-react/core';
import type { StarknetkitConnector } from 'starknetkit';
import { useStarknetkitConnectModal } from 'starknetkit';
import { useEffect, useState } from 'react';

export function WalletConnectorModal() {
    const { disconnect } = useDisconnect();
    const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);
    const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);

    useEffect(() => {
        // Check if Argent X is installed
        const checkWallet = () => {
            const isInstalled = window.starknet_argentX !== undefined;
            setIsWalletInstalled(isInstalled);
            if (isInstalled) {
                setShowInstallGuide(false);
            }
        };
        
        checkWallet();
        // Check again after a short delay to ensure the wallet has time to inject
        const timeoutId = setTimeout(checkWallet, 1000);
        
        return () => clearTimeout(timeoutId);
    }, []);

    const { connect, connectors } = useConnect();
    const { starknetkitConnectModal } = useStarknetkitConnectModal({
        connectors: connectors as StarknetkitConnector[],
    });

    async function connectWallet() {
        try {
            if (!isWalletInstalled) {
                setShowInstallGuide(true);
                return;
            }
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

    const { address } = useAccount();

    if (!address) {
        return (
            <div className="flex flex-col gap-2">
                <button
                    onClick={connectWallet}
                    className="text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors p-4"
                >
                    Connect Wallet
                </button>
                {showInstallGuide && (
                    <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                        <p className="text-red-600 mb-2">Argent X wallet is not installed</p>
                        <a 
                            href="https://www.argent.xyz/argent-x/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            Install Argent X Wallet
                        </a>
                    </div>
                )}
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="p-2 bg-gray-100 rounded-lg ">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <button
                onClick={() => disconnect()}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
                Disconnect
            </button>
        </div>
    );
}