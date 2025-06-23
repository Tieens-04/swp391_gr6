import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { ChatContext } from '../../contexts/ChatContext';
import { getPrompts } from '../../services/chatApi';
import moment from 'moment';
import ScrollableFeed from 'react-scrollable-feed';
import './style.css';

const ChatBox = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const { conversations, activeConversation, sendMessage, unreadCount, isConnected } = useContext(ChatContext);

    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [prompts, setPrompts] = useState([]);
    const [showWelcome, setShowWelcome] = useState(true);
    const messagesEndRef = useRef(null);

    // Fetch prompt suggestions
    useEffect(() => {
        getPrompts()
            .then(response => {
                if (response.status === 200) {
                    setPrompts(response.data.prompts);
                }
            })
            .catch(error => {
                console.error('Error fetching prompts:', error);
            });
    }, []);

    // When chatbox opens, show welcome message
    useEffect(() => {
        if (isOpen) {
            // Hide welcome message if there's an active conversation
            if (activeConversation && conversations[activeConversation]?.length > 0) {
                setShowWelcome(false);
            } else {
                setShowWelcome(true);
            }
        }
    }, [isOpen, activeConversation, conversations]);

    // Thêm useEffect để đồng bộ tin nhắn mới
    useEffect(() => {
        // Re-render khi có tin nhắn mới trong cuộc trò chuyện hiện tại
        if (activeConversation && conversations[activeConversation]) {
            // Đảm bảo component render lại khi có tin nhắn mới
            console.log(`Conversation with ${activeConversation} updated, messages count: ${conversations[activeConversation].length}`);
        }
    }, [conversations, activeConversation]);

    useEffect(() => {
        if (activeConversation && conversations[activeConversation]?.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversations, activeConversation]);

    const handleChatButtonClick = () => {
        if (!user || !user.isLoggedIn) {
            // Redirect to login if not logged in
            navigate('/auth/login');
            return;
        }

        setIsOpen(!isOpen);
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;
        if (!isConnected) {
            console.error('Cannot send message: Socket not connected');
            return;
        }

        // Gửi tin nhắn tới "system" nếu không có cuộc hội thoại nào
        // Hệ thống sẽ phân phối tin nhắn tới nhân viên tư vấn đang online
        const receiverId = activeConversation || 'system';

        sendMessage(receiverId, message);
        setMessage('');
        setShowWelcome(false); // Hide welcome message after first user message
    };

    const handlePromptClick = (promptText) => {
        if (!isConnected) {
            console.error('Cannot send message: Socket not connected');
            return;
        }

        // Gửi prompt tới "system" nếu không có cuộc hội thoại nào
        const receiverId = activeConversation || 'system';
        sendMessage(receiverId, promptText);
        setShowWelcome(false);
    };

    // Navigate to messages page
    const handleViewAll = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Chat button with notification badge */}
            <div className="chat-button-container">
                <button
                    className="chat-button"
                    onClick={handleChatButtonClick}
                >
                    <i className="fas fa-comments"></i>
                    {user?.isLoggedIn && unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
                </button>
            </div>

            {/* Chat box - only show if logged in */}
            {user?.isLoggedIn && isOpen && (
                <div className="chat-box-container">
                    <div className="chat-box-header">
                        <h5>Trò chuyện</h5>
                        <div>
                            <Link to="/messages" className="view-all-link" onClick={handleViewAll}>
                                Xem tất cả
                            </Link>
                            <button className="close-button" onClick={() => setIsOpen(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div className="chat-box-body">
                        <ScrollableFeed>
                            {/* Welcome message and prompts */}
                            {showWelcome && (
                                <div className="welcome-container">
                                    <div className="system-message">
                                        <p>Xin chào! 👋</p>
                                        <p>Bạn cần tư vấn về vấn đề gì?</p>
                                    </div>
                                    <div className="prompt-container">
                                        {prompts.map(prompt => (
                                            <button
                                                key={prompt.id}
                                                className="prompt-button"
                                                onClick={() => handlePromptClick(prompt.text)}
                                            >
                                                {prompt.text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chat messages */}
                            {activeConversation && conversations[activeConversation]?.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message-bubble ${msg.senderId === user?.userId ? 'outgoing' : 'incoming'}`}
                                >
                                    <div className="message-content">
                                        {msg.message}
                                    </div>
                                    <div className="message-time">
                                        {moment(msg.createdAt).format('HH:mm')}
                                        {msg.senderId === user?.userId && (
                                            <span className="read-status">
                                                {msg.isRead ? (
                                                    <i className="fas fa-check-double text-primary"></i>
                                                ) : (
                                                    <i className="fas fa-check"></i>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </ScrollableFeed>
                    </div>

                    <div className="chat-box-footer">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            className="send-button"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || !isConnected}
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;