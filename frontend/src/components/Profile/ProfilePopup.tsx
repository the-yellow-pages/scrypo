import React, { useState } from 'react';
import { Popup } from 'react-map-gl/mapbox';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { TagChip } from '../Tags/TagChip';
import { AVAILABLE_TAGS } from '../Tags/tags';
import { useContract, useSendTransaction } from "@starknet-react/core";
import { profileRegistryAbi } from "abi/profileRegistryAbi";
import { CallData } from "starknet";
import { encrypt, feltsToPub, feltsToUint8Array, uint8ArrayToFelts } from "msg/keyHelpers";
import type { ProfileResponse } from '../../api/types';

// Helper function to truncate address
const truncateAddress = (address: string) => {
    if (address.length <= 13) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to get tag IDs from bit flags
const getTagsFromBitFlags = (tags0: number, tags1: number): string[] => {
    const tagIds: string[] = [];

    // Check tags0 (first 32 tags)
    for (let i = 0; i < 32 && i < AVAILABLE_TAGS.length; i++) {
        if (tags0 & (1 << i)) {
            tagIds.push(AVAILABLE_TAGS[i].id);
        }
    }

    // Check tags1 (next 32 tags)
    for (let i = 32; i < 64 && i < AVAILABLE_TAGS.length; i++) {
        if (tags1 & (1 << (i - 32))) {
            tagIds.push(AVAILABLE_TAGS[i].id);
        }
    }

    return tagIds;
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
            const encryptedMsg: Uint8Array = await encrypt(message, recipientPubKey);
            console.log("encrypted msg: ", encryptedMsg);
            // Convert encrypted message to felt array
            // todo : use a more efficient way to convert to felt array
            // const msgFelts = Array.from(encryptedMsg).map(byte => byte.toString());
            const msgFelts = uint8ArrayToFelts(encryptedMsg);

            console.log("send msg: ", msgFelts.map(x => BigInt(x)));
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

    const profileTags = getTagsFromBitFlags(Number(profile.tags0 || 0), Number(profile.tags1 || 0));

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
                {profileTags.length > 0 && (
                    <div style={{ margin: '8px 0' }}>
                        <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>Tags:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {profileTags.map(tagId => (
                                <TagChip key={tagId} tagId={tagId} size="sm" />
                            ))}
                        </div>
                    </div>
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
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <Link to={`/profile/${profile.address}`} style={{ flex: 1 }}>
                            <Button
                                hideChevron
                                className="w-full"
                            >
                                View Profile
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setShowMessageInput(true)}
                            disabled={!profile.pubkey_hi || sending}
                            hideChevron
                            style={{ flex: 1 }}
                        >
                            Send Message
                        </Button>
                    </div>
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