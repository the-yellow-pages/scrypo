import React, { useState } from 'react';
import { Popup } from 'react-map-gl/mapbox';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { useContract, useSendTransaction } from "@starknet-react/core";
import { profileRegistryAbi } from "abi/profileRegistryAbi";
import { CallData } from "starknet";
import { encrypt, feltsToPub } from "msg/keyHelpers";
import type { ProfileResponse } from '../../api/types';

// Helper function to truncate address
const truncateAddress = (address: string) => {
    if (address.length <= 13) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

interface ProfilePopupProps {
    profile: ProfileResponse;
    latitude: number;
    longitude: number;
    onClose: () => void;
    contractAddress: string;
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({
    profile,
    latitude,
    longitude,
    onClose,
    contractAddress,
}) => {
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const MAX_MESSAGE_LENGTH = 200;

    const { contract } = useContract({
        abi: profileRegistryAbi,
        address: contractAddress as `0x${string}`,
    });

    const { sendAsync } = useSendTransaction({
        calls: [],
    });

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            setSending(true);
            setError(null);

            // Convert pubkey felts back to Uint8Array for encryption
            if (!profile.pubkey_hi || !profile.pubkey_lo) {
                throw new Error("Recipient doesn't have a public key set up");
            }

            // Use the new feltsToPub function
            const recipientPubKey = feltsToPub(profile.pubkey_hi, profile.pubkey_lo);

            // Encrypt the message
            const encryptedMsg = await encrypt(message, recipientPubKey);
            
            // Convert encrypted message to felt array
            // todo : use a more efficient way to convert to felt array
            const msgFelts = Array.from(encryptedMsg).map(byte => byte.toString());

            // Send transaction
            const { transaction_hash } = await sendAsync([{
                contractAddress: contractAddress as `0x${string}`,
                entrypoint: "send_msg",
                calldata: CallData.compile([
                    profile.address, // recipient address
                    msgFelts.length, // array length
                    ...msgFelts, // array elements
                ])
            }]);

            setMessage('');
            setShowMessageInput(false);
            alert(`Message sent! Transaction hash: ${transaction_hash}`);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err instanceof Error ? err.message : 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newMessage = e.target.value;
        if (newMessage.length <= MAX_MESSAGE_LENGTH) {
            setMessage(newMessage);
        }
    };

    return (
        <Popup
            latitude={latitude}
            longitude={longitude}
            onClose={onClose}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
        >
            <div className="popup-content" style={{ padding: '10px', maxWidth: '300px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                    {profile.name || 'Unnamed Profile'}
                </h3>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    <strong>Address:</strong>{' '}
                    <Link 
                        to={`/profile/${profile.address}`}
                        style={{ color: '#0066cc', textDecoration: 'none' }}
                        title={profile.address}
                    >
                        {truncateAddress(profile.address)}
                    </Link>
                </p>
                {profile.tags0 && (
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Tags:</strong> {profile.tags0}
                    </p>
                )}
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    <strong>Location:</strong> ({profile.location.x}, {profile.location.y})
                </p>
                {/* {profile.pubkey_hi && (
                    <p style={{ margin: '4px 0', fontSize: '14px', wordBreak: 'break-all' }}>
                        <strong>Public Key:</strong> {truncateAddress(profile.pubkey_hi)}
                    </p>
                )} */}

                {!showMessageInput ? (
                    <Button
                        onClick={() => setShowMessageInput(true)}
                        disabled={!profile.pubkey_hi || sending}
                        hideChevron
                        className="mt-2 w-full"
                    >
                        Send Message
                    </Button>
                ) : (
                    <form onSubmit={handleSendMessage} className="mt-2">
                        <div className="relative">
                            <textarea
                                value={message}
                                onChange={handleMessageChange}
                                placeholder="Type your message..."
                                className="w-full p-2 border rounded mb-2"
                                rows={3}
                                disabled={sending}
                                maxLength={MAX_MESSAGE_LENGTH}
                            />
                            <div className="text-right text-sm text-gray-500">
                                {message.length}/{MAX_MESSAGE_LENGTH}
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm mb-2">{error}</p>
                        )}
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={sending || !message.trim()}
                                hideChevron
                                className="flex-1"
                            >
                                {sending ? 'Sending...' : 'Send'}
                            </Button>
                            <Button
                                onClick={() => setShowMessageInput(false)}
                                disabled={sending}
                                hideChevron
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Popup>
    );
}; 