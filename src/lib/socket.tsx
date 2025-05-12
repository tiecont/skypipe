'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export let socket: WebSocket | null = null;

export default function SocketProvider() {
    const connectedRef = useRef(false);

    useEffect(() => {
        if (connectedRef.current || typeof window === 'undefined') return;

        const fakeUserId = 1;
        connectedRef.current = true;
        createSocket(fakeUserId);
    }, []);

    return null;
}

// =========================
// 🔁 WebSocket Core Logic
// =========================
function createSocket(userId: number | null) {
    if (!userId) {
        console.warn('No userId provided, skipping WebSocket connection.');
        return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || window.location.host;
    const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsFullUrl = `${protocol}://${wsUrl}/ws?userId=${userId}`;

    if (!socket || socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
        console.log('Attempting to create WebSocket connection...');

        try {
            socket = new WebSocket(wsFullUrl);

            socket.onopen = () => {
                displayNotification('✅ WebSocket connection established.');
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (isNotificationType(data.type)) {
                        displayNotification(data.message);
                    }
                } catch (err) {
                    console.warn('Fallback WebSocket message parsing failed:', err);
                    const viewerEvent = new MessageEvent('message', { data: event.data });
                    window.dispatchEvent(viewerEvent);
                }
            };

            socket.onclose = (event) => {
                console.warn('❌ WebSocket closed:', event.reason || 'No reason provided');
                if (!event.wasClean) {
                    console.log('🔁 Connection closed unexpectedly. Attempting to reconnect...');
                    reconnect(userId);
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (err) {
            console.error('Failed to create WebSocket:', err);
            reconnect(userId);
        }
    }
}

function reconnect(userId: number) {
    setTimeout(() => {
        console.log('🔄 Reconnecting WebSocket...');
        createSocket(userId);
    }, 5000);
}

// =========================
// 🔔 Display Notification
// =========================
function displayNotification(message: string) {
    toast.success(message);
}

// =========================
// 🔍 Type Checker
// =========================
function isNotificationType(type: string): boolean {
    const validTypes = ['success', 'info', 'warning', 'error'];
    return validTypes.includes(type);
}
