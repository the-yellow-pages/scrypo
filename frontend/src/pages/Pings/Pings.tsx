import { useState, useEffect } from 'react';
import { useAccount } from "@starknet-react/core";
import { getMessagesByRecipient, type Message } from '../../api/messages';
import { type ErrorResponse } from '../../api/types';

// Import Helper Components from Profile since we'll use similar patterns
import LoadingIndicator from '../Profile/components/LoadingIndicator';
import ConnectWalletPromptMessage from '../Profile/components/ConnectWalletPromptMessage';

function Pings() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const { address: connectedUserAddress, isConnected } = useAccount();

    useEffect(() => {
        if (connectedUserAddress) {
            setIsLoading(true);
            setMessages([]);
            setError(null);
            
            getMessagesByRecipient(connectedUserAddress)
                .then(response => {
                    console.log(response);
                    if (response && 'error' in response) {
                        const errorResponse = response as ErrorResponse;
                        setError(errorResponse.error || "Failed to fetch messages.");
                    } else {
                        setMessages(response as Message[]);
                    }
                })
                .catch(err => {
                    console.error('Fetch messages error:', err);
                    setError(err instanceof Error ? err.message : "An unknown error occurred while fetching messages.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [connectedUserAddress]);

    if (!isConnected) {
        return <ConnectWalletPromptMessage />;
    }

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 rounded">
                <p className="text-red-700">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Your Messages</h2>
            {messages.length === 0 ? (
                <p className="text-gray-500">No messages found.</p>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm text-gray-500">
                                    From: {message.sender}
                                </span>
                                {/*<span className="text-xs text-gray-400">*/}
                                {/*    {new Date(message.timestamp).toLocaleString()}*/}
                                {/*</span>*/}
                            </div>
                            <p className="text-gray-800"> cont: {message.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Pings; 