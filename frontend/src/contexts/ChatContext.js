import React, { createContext, useContext, useState, useEffect, useReducer } from 'react';
import io from 'socket.io-client';
import { UserContext } from './UserContext';
import { getConversation, getContacts, getUnreadMessageCount, markAsRead } from '../services/chatApi';

export const ChatContext = createContext();

// Tạo reducer function
const conversationsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            const { conversationId, message } = action.payload;
            return {
                ...state,
                [conversationId]: [...(state[conversationId] || []), message]
            };
        case 'SET_CONVERSATION':
            return {
                ...state,
                [action.payload.userId]: action.payload.messages
            };
        case 'RESET':
            return {};
        default:
            return state;
    }
};

export const ChatProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [conversations, dispatchConversations] = useReducer(conversationsReducer, {});
    const [contacts, setContacts] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeConversation, setActiveConversation] = useState(null);
    
    console.log("ChatContext rendering, user:", user ? `${user.userId} (${user.role})` : 'not logged in');

    // Initialize socket connection with detailed logging
    useEffect(() => {
        if (user?.accessToken) {
            console.log("Attempting to connect to socket server...");
            
            // Log socket config
            const socketUrl = 'http://localhost:9092';
            console.log(`Socket URL: ${socketUrl}`);
            
            const socketInstance = io(socketUrl, {
                transports: ['websocket', 'polling'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 20000,
                forceNew: true
            });
            
            console.log("Socket instance created with config:", {
                transports: socketInstance.io.opts.transports,
                reconnection: socketInstance.io.opts.reconnection,
                reconnectionAttempts: socketInstance.io.opts.reconnectionAttempts,
                timeout: socketInstance.io.opts.timeout
            });

            // Connection events
            socketInstance.on('connect', () => {
                console.log(`Socket CONNECTED! 🟢 ID: ${socketInstance.id}`);
                setIsConnected(true);

                // Identify user to server
                console.log(`Sending 'join' event with userId: ${user.userId}`);
                socketInstance.emit('join', user.userId);
            });

            socketInstance.on('connect_error', (error) => {
                console.error(`Socket CONNECTION ERROR! 🔴 ${error.message}`, error);
                console.log("Transport options:", socketInstance.io.opts.transports);
                
                // Log detailed error info
                console.error("Socket error details:", {
                    message: error.message,
                    description: error.description || 'No description',
                    transport: socketInstance.io.engine?.transport?.name || 'Unknown transport',
                    readyState: socketInstance.io.engine?.readyState || 'Unknown state',
                    uri: socketInstance.io.uri
                });
                
                // Try polling if websocket fails
                if (socketInstance.io.opts.transports[0] === 'websocket') {
                    console.log("⚠️ Switching to polling transport as fallback");
                    socketInstance.io.opts.transports = ['polling', 'websocket'];
                }
            });

            socketInstance.on('disconnect', (reason) => {
                console.log(`Socket DISCONNECTED! 🟠 Reason: ${reason}`);
                setIsConnected(false);
            });

            socketInstance.on('reconnect', (attemptNumber) => {
                console.log(`Socket RECONNECTED! 🟢 After ${attemptNumber} attempts`);
            });

            socketInstance.on('reconnect_attempt', (attemptNumber) => {
                console.log(`Socket reconnect attempt #${attemptNumber}`);
            });

            socketInstance.on('reconnect_error', (error) => {
                console.error(`Socket reconnect error: ${error.message}`);
            });

            socketInstance.on('reconnect_failed', () => {
                console.error("Socket reconnection failed after all attempts!");
            });
            
            socketInstance.on('error', (error) => {
                console.error(`Socket general error: ${error}`);
            });

            // Sửa đoạn xử lý sự kiện chat
            socketInstance.on('chat', (message) => {
                console.log('Received chat message:', message);
                
                // Xác định ID cuộc trò chuyện dựa trên người gửi/nhận
                const conversationId = message.senderId === user.userId ? 
                    message.receiverId : message.senderId;
                
                // Dispatch action để thêm tin nhắn mới
                dispatchConversations({
                    type: 'ADD_MESSAGE',
                    payload: { conversationId, message }
                });
                
                // Update unread count
                if (message.senderId !== user.userId && (!activeConversation || activeConversation !== message.senderId)) {
                    setUnreadCount(prev => prev + 1);
                }
            });
            
            socketInstance.on('read', (data) => {
                console.log('Messages marked as read:', data);
            });

            setSocket(socketInstance);
            
            console.log("Socket event handlers attached");

            // Cleanup on unmount
            return () => {
                console.log("Disconnecting socket on cleanup");
                socketInstance.disconnect();
            };
        } else {
            console.log("User not logged in, skipping socket connection");
        }
    }, [user?.accessToken, user?.userId]);

    // Rest of your code...

    // Add detailed logging to sendMessage
    const sendMessage = (receiverId, message) => {
        console.log(`Attempting to send message to ${receiverId}`);
        console.log(`Socket status: ${isConnected ? 'CONNECTED' : 'DISCONNECTED'}`);
        
        if (!socket) {
            console.error('❌ Cannot send message: Socket not initialized');
            return;
        }

        if (!isConnected) {
            console.error('❌ Cannot send message: Socket not connected');
            console.log('Trying to reconnect...');
            socket.connect();
            
            // Try again after reconnection attempt
            setTimeout(() => {
                if (socket.connected) {
                    console.log('Reconnected, trying to send message again');
                    sendMessageToSocket(receiverId, message);
                } else {
                    console.error('Still not connected after reconnection attempt');
                }
            }, 1000);
            return;
        }

        sendMessageToSocket(receiverId, message);
    };

        const sendMessageToSocket = (receiverId, message) => {
        console.log(`Sending message to ${receiverId}: "${message.substring(0, 20)}${message.length > 20 ? '...' : ''}"`);
        
        const messageData = {
            senderId: user.userId,
            senderName: user.name || 'User',
            senderRole: user.role,
            receiverId: receiverId,
            message: message
        };

        console.log('Emitting chat event with data:', messageData);
        
        socket.emit('chat', messageData, (response) => {
            if (response) {
                console.log('✅ Message sent successfully, server response:', response);

                // Thay đổi từ setConversations sang dispatchConversations
                dispatchConversations({
                    type: 'ADD_MESSAGE',
                    payload: {
                        conversationId: receiverId,
                        message: response
                    }
                });
            } else {
                console.error('⚠️ No acknowledgment from server for sent message');
            }
        });
    };

    const loadConversation = async (userId) => {
        if (!user?.accessToken) return;
        
        try {
            console.log(`Loading conversation with ${userId}`);
            const response = await getConversation(user.accessToken, userId);
            
            if (response.status === 200) {
                // Dispatch action để cập nhật cuộc trò chuyện
                dispatchConversations({
                    type: 'SET_CONVERSATION',
                    payload: { userId, messages: response.data }
                });
                
                // Set as active conversation
                setActiveConversation(userId);
                
                // Mark messages as read
                if (socket && isConnected) {
                    socket.emit('read', {
                        senderId: userId,
                        receiverId: user.userId
                    });
                }
                
                // API call to mark as read
                try {
                    await markAsRead(user.accessToken, userId);
                } catch (err) {
                    console.error('Error marking messages as read via API:', err);
                }
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    // Return component
    return (
        <ChatContext.Provider
            value={{
                socket,
                isConnected,
                conversations,
                contacts,
                unreadCount,
                activeConversation,
                setActiveConversation,
                loadConversation,
                sendMessage,
                // other methods
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};