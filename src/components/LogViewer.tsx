'use client';

import { useEffect, useRef, useState } from 'react';
import { socket as sharedSocket } from '@/lib/socket';

export default function LogViewer() {
    const [logs, setLogs] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;
        const threshold = 10;
        isAtBottomRef.current =
            container.scrollTop + container.clientHeight >= container.scrollHeight - threshold;
    };

    useEffect(() => {
        if (!sharedSocket) return;

        const handleMessage = (event: MessageEvent) => {
            const message = event.data;

            setLogs(prev => {
                const isProgressBar = message.includes('\r');
                const isSpinner = message.trim().startsWith('⠋');
                const isEstimateLine = message.startsWith('⏱️');

                if (isSpinner) {
                    const nextLine = prev[prev.length - 1];
                    if (nextLine && (nextLine.includes('✔') || nextLine.includes('✗'))) {
                        return prev;
                    }
                }

                if (isProgressBar) {
                    if (prev.length > 0 &&
                        (prev[prev.length - 1].includes('\r') ||
                            prev[prev.length - 1].includes('['))) {
                        return [...prev.slice(0, -1), message];
                    }
                    return [...prev, message];
                }

                if (isEstimateLine) {
                    return prev;
                }

                return [...prev, message];
            });

            if (isAtBottomRef.current && containerRef.current) {
                setTimeout(() => {
                    containerRef.current!.scrollTop = containerRef.current!.scrollHeight;
                }, 10);
            }
        };

        const handleOpen = () => {
            setLogs(prev => [...prev, 'Connected to WebSocket server']);
        };

        const handleClose = () => {
            setLogs(prev => [...prev, 'Disconnected from WebSocket server']);
        };

        const handleError = () => {
            setLogs(prev => [...prev, 'WebSocket error occurred']);
        };

        sharedSocket.addEventListener('open', handleOpen);
        sharedSocket.addEventListener('message', handleMessage);
        sharedSocket.addEventListener('close', handleClose);
        sharedSocket.addEventListener('error', handleError);

        return () => {
            sharedSocket?.removeEventListener('open', handleOpen);
            sharedSocket?.removeEventListener('message', handleMessage);
            sharedSocket?.removeEventListener('close', handleClose);
            sharedSocket?.removeEventListener('error', handleError);
        };
    }, []);

    const renderLogs = () => {
        return logs.map((log, index) => {
            const cleanLog = log.replace(/\r/g, '').trim();

            let className = "text-gray-300";
            if (cleanLog.includes('✗ Failed')) {
                className = "text-red-400";
            } else if (cleanLog.includes('✔ Successfully')) {
                className = "text-green-400 font-medium";
            } else if (cleanLog.includes('🎉 Done') || cleanLog.includes('🚀') || cleanLog.includes('📋')) {
                className = "text-yellow-300";
            } else if (cleanLog.includes('[') && cleanLog.includes(']')) {
                className = "text-cyan-400";
            } else if (cleanLog.includes('Connected') || cleanLog.includes('Disconnected')) {
                className = "text-blue-400";
            } else if (cleanLog.includes('⏱️')) {
                className = "text-purple-400 text-sm";
            }

            const isInitialProgress =
                cleanLog.trim().startsWith('⠋') &&
                logs[index + 1]?.includes('✔');

            return (
                <div
                    key={index}
                    className={`${className} ${index === logs.length - 1 ? 'animate-pulse' : ''} py-1`}
                    style={{ display: isInitialProgress ? 'none' : 'block' }}
                >
                    {cleanLog}
                </div>
            );
        });
    };

    return (
        <div className="p-4 m-auto mt-0 w-5xl h-[600px]">
            <h1 className="text-xl font-bold mb-4 text-gray-100">Realtime Log Viewer</h1>
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="font-mono whitespace-pre bg-gray-900 p-4
                rounded-lg border border-gray-800 h-full overflow-y-auto custom-scroll"
            >
                {renderLogs()}
            </div>
        </div>
    );
}
