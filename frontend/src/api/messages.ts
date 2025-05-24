import { type ErrorResponse } from './types';

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  message: Uint8Array; // Encrypted message content
  timestamp: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const getMessagesByRecipient = async (address: string): Promise<Message[] | ErrorResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/recipient/${address}`);
    const data = await response.json();
    console.log("Raw message data:", data);
    
    if (!response.ok) {
      return { error: data.error || 'Failed to fetch messages' };
    }

    // Convert the message data to proper Uint8Array format
    const messages = data.map((msg: any) => ({
      ...msg,
      message: new Uint8Array(Object.values(msg.message))
    }));

    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { error: `Failed to fetch messages` };
  }
};

export const getMessagesBySender = async (address: string): Promise<Message[] | ErrorResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages/sender/${address}`);
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || 'Failed to fetch messages' };
    }
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { error: `Failed to fetch messages` };
  }
}; 