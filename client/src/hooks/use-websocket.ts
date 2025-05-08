import { useState, useEffect, useRef, useCallback } from 'react';
import { WebSocketMessage } from '@/lib/types';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Initialize the WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        setLastMessage(message);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError(new Error('WebSocket connection error'));
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      setIsConnected(false);
      
      // Auto-reconnect after 3 seconds if closed unexpectedly
      if (event.code !== 1000) {
        setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          // Let the effect cleanup and re-run to establish a new connection
          if (socketRef.current) {
            socketRef.current = null;
          }
        }, 3000);
      }
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, []);

  // Send message to the WebSocket server
  const sendMessage = useCallback((type: string, data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, data }));
      return true;
    }
    return false;
  }, []);

  // Sync application
  const syncApplication = useCallback((applicationId: number, user?: string) => {
    return sendMessage('syncApplication', { applicationId, user });
  }, [sendMessage]);

  // Force sync all applications
  const forceSync = useCallback((user?: string, revision?: string) => {
    return sendMessage('forceSync', { user, revision });
  }, [sendMessage]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    syncApplication,
    forceSync
  };
}
