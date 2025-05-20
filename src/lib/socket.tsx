'use client';

import { useEffect, useRef } from 'react';
import useToast from "@/hooks/useToast";
import {isNotificationType} from "@/lib/helper";

export let socket: WebSocket | null = null;

export default function SocketProvider() {
    const connectedRef = useRef(false);
    useEffect(() => {
        if (connectedRef.current || typeof window === 'undefined') return;

        const fakeUserId = "7d423b73-4edb-4fdd-b062-1a8169b37030";
        connectedRef.current = true;
        createSocket(fakeUserId);
    }, []);

    return null;
}

// =========================
// 🔁 WebSocket Core Logic
// =========================
function createSocket(userId: string | null) {
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
                const successConnection = new MessageEvent('message', { data: '✔ WebSocket connection established.'})
                DisplayNotification('WebSocket connection established.', 'success');
                window.dispatchEvent(successConnection)
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (isNotificationType(data.type)) {
                        DisplayNotification(data.message, data.type);
                    }
                } catch (err) {
                    console.warn('Fallback WebSocket message parsing failed:', err);
                    const viewerEvent = new MessageEvent('message', { data: event.data });
                    window.dispatchEvent(viewerEvent);
                }
            };

            socket.onclose = (event) => {
                const message = '🔁 Connection closed unexpectedly. Attempting to reconnect...'
                const msg = new MessageEvent('message', { data: message });
                DisplayNotification('Connection closed unexpectedly. Attempting to reconnect...', 'warning')
                if (!event.wasClean) {
                    window.dispatchEvent(msg);
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

function reconnect(userId: string) {
    setTimeout(() => {
        console.log('🔄 Reconnecting WebSocket...');
        createSocket(userId);
    }, 5000);
}

// =========================
// 🔔 Display Notification
// =========================
export function DisplayNotification(message: string, type: string) {
    // Check type validate
    const { showSuccess, showError, showWarning } = useToast();
    if (!isNotificationType(type)) return
    switch (type) {
        case 'error':
            showError(message)
            break;
        case 'success':
            showSuccess(message)
            break;
        case 'warning':
            showWarning(message)
    }
}

