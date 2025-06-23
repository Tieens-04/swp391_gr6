package com.swp391_g6.demo.socket;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIONamespace;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.swp391_g6.demo.dto.ChatDTO;
import com.swp391_g6.demo.entity.Chat;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.service.ChatService;
import com.swp391_g6.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class ChatSocketHandler {

    @Autowired
    private SocketIOServer socketIOServer;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService; // Thêm UserService

    // Store client connections with user IDs
    private final Map<String, UUID> userSocketMap = new HashMap<>();

    // Store role of each connected user
    private final Map<String, String> userRoleMap = new HashMap<>();

    @PostConstruct
    private void init() {
        System.out.println("---------------------------------------------");
        System.out.println("INITIALIZING CHAT SOCKET HANDLER");
        System.out.println("---------------------------------------------");
        try {
            // Đăng ký trực tiếp trên socketIOServer (namespace mặc định)
            socketIOServer.addConnectListener(onConnected());
            socketIOServer.addDisconnectListener(onDisconnected());
            socketIOServer.addEventListener("join", String.class, onUserJoined());
            socketIOServer.addEventListener("chat", ChatDTO.class, onChatReceived());
            socketIOServer.addEventListener("read", Map.class, (DataListener<Map>) onMessagesRead());

            System.out.println("All event listeners registered successfully");
            System.out.println("Socket server configuration:");
            System.out.println("  - Host: " + socketIOServer.getConfiguration().getHostname());
            System.out.println("  - Port: " + socketIOServer.getConfiguration().getPort());
            System.out.println("  - Origin: " + socketIOServer.getConfiguration().getOrigin());
            System.out.println("  - Transport: " + socketIOServer.getConfiguration().getTransports());
            System.out.println("---------------------------------------------");
        } catch (Exception e) {
            System.err.println("ERROR INITIALIZING SOCKET HANDLER: " + e.getMessage());
            e.printStackTrace();
            System.out.println("---------------------------------------------");
        }
    }

    private ConnectListener onConnected() {
        return client -> {
            System.out.println("✅ CLIENT CONNECTED: " + client.getSessionId());
            System.out.println("  - Remote address: " + client.getRemoteAddress());
            System.out.println("  - Transport: " + client.getTransport().name());
            System.out.println("  - Handshake data: " + client.getHandshakeData().getUrl());
            System.out.println("  - Headers: " + client.getHandshakeData().getHttpHeaders());
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            System.out.println("❌ CLIENT DISCONNECTED: " + client.getSessionId());

            // Find and remove user from map
            Optional<String> userId = userSocketMap.entrySet().stream()
                    .filter(entry -> entry.getValue().equals(client.getSessionId()))
                    .map(Map.Entry::getKey)
                    .findFirst();

            userId.ifPresent(id -> {
                userSocketMap.remove(id);
                userRoleMap.remove(id); // Xóa role từ map
                System.out.println("  - Removed user mapping for: " + id);
            });
        };
    }

    private DataListener<String> onUserJoined() {
        return (client, userId, ackRequest) -> {
            System.out.println("👤 USER JOINED: " + userId);
            System.out.println("  - Client ID: " + client.getSessionId());

            // Store user's session ID
            userSocketMap.put(userId, client.getSessionId());

            // Store user's role
            User user = userService.getUserById(userId);
            if (user != null) {
                userRoleMap.put(userId, user.getRole());
                System.out.println("  - User role: " + user.getRole());
            }

            System.out.println("  - Added to userSocketMap, count: " + userSocketMap.size());

            if (ackRequest.isAckRequested()) {
                ackRequest.sendAckData("User joined successfully");
                System.out.println("  - Acknowledgment sent");
            }
        };
    }

    private DataListener<ChatDTO> onChatReceived() {
        return (client, data, ackRequest) -> {
            System.out.println("📝 CHAT MESSAGE RECEIVED:");
            System.out.println("  - From: " + data.getSenderId() + " (" + data.getSenderName() + ")");
            System.out.println("  - To: " + data.getReceiverId());
            System.out.println(
                    "  - Message: " + (data.getMessage().length() > 50 ? data.getMessage().substring(0, 50) + "..."
                            : data.getMessage()));

            try {
                // Kiểm tra nếu tin nhắn được gửi tới "system" (tin nhắn đầu tiên từ seeker)
                if ("system".equals(data.getReceiverId())) {
                    handleSystemMessage(data, ackRequest);
                } else {
                    // Xử lý tin nhắn bình thường
                    handleDirectMessage(data, ackRequest);
                }
            } catch (Exception e) {
                System.err.println("❌ ERROR PROCESSING MESSAGE: " + e.getMessage());
                e.printStackTrace();

                if (ackRequest.isAckRequested()) {
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", e.getMessage());
                    ackRequest.sendAckData(error);
                }
            }
        };
    }

    // Hàm mới để xử lý tin nhắn gửi đến "system"
    private void handleSystemMessage(ChatDTO data, AckRequest ackRequest) {
        System.out.println("  - Processing SYSTEM message");

        // Tìm staff (tư vấn viên) đang online
        List<String> onlineStaffIds = userRoleMap.entrySet().stream()
                .filter(entry -> "staff".equals(entry.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        System.out.println("  - Found " + onlineStaffIds.size() + " online staff members");

        if (onlineStaffIds.isEmpty()) {
            // Nếu không có staff online, lưu tin nhắn cho staff mặc định
            String defaultStaffId = "USER0000000126"; // ID của staff mặc định trong hệ thống

            System.out.println("  - No staff online, saving message for default staff: " + defaultStaffId);

            Chat savedChat = chatService.saveMessage(
                    data.getSenderId(),
                    defaultStaffId,
                    data.getMessage());

            // Chuyển đổi chat đã lưu thành DTO
            ChatDTO chatDTO = convertChatToDTO(savedChat);

            // Cập nhật activeConversation của người gửi
            SocketIOClient senderClient = socketIOServer.getClient(userSocketMap.get(data.getSenderId()));
            if (senderClient != null) {
                Map<String, String> conversationUpdate = new HashMap<>();
                conversationUpdate.put("activeStaff", defaultStaffId);
                senderClient.sendEvent("conversation_update", conversationUpdate);
                System.out.println("  - Sent conversation update to sender with default staff");
            }

            // Gửi ACK về cho người gửi
            if (ackRequest.isAckRequested()) {
                ackRequest.sendAckData(chatDTO);
            }
        } else {
            // Chọn staff đầu tiên đang online
            String staffId = onlineStaffIds.get(0);
            System.out.println("  - Selected online staff: " + staffId);

            // Lưu tin nhắn vào database với staff đã chọn
            Chat savedChat = chatService.saveMessage(
                    data.getSenderId(),
                    staffId,
                    data.getMessage());

            ChatDTO chatDTO = convertChatToDTO(savedChat);

            // Gửi tin nhắn tới staff đã chọn
            UUID staffSessionId = userSocketMap.get(staffId);
            if (staffSessionId != null) {
                System.out.println("  - Forwarding message to staff with session: " + staffSessionId);
                socketIOServer.getClient(staffSessionId).sendEvent("chat", chatDTO);
            }

            // Cập nhật activeConversation của người gửi
            SocketIOClient senderClient = socketIOServer.getClient(userSocketMap.get(data.getSenderId()));
            if (senderClient != null) {
                Map<String, String> conversationUpdate = new HashMap<>();
                conversationUpdate.put("activeStaff", staffId);
                senderClient.sendEvent("conversation_update", conversationUpdate);
                System.out.println("  - Sent conversation update to sender");
            }

            // Gửi ACK về cho người gửi
            if (ackRequest.isAckRequested()) {
                ackRequest.sendAckData(chatDTO);
            }
        }
    }

    // Xử lý tin nhắn trực tiếp giữa người dùng
    private void handleDirectMessage(ChatDTO data, AckRequest ackRequest) {
        Chat savedChat = chatService.saveMessage(
                data.getSenderId(),
                data.getReceiverId(),
                data.getMessage());
        System.out.println("  - Message saved with ID: " + savedChat.getChatId());

        // Convert saved chat to DTO
        ChatDTO chatDTO = convertChatToDTO(savedChat);

        // Broadcast to receiver if online
        UUID receiverSessionId = userSocketMap.get(data.getReceiverId());
        if (receiverSessionId != null) {
            System.out.println("  - Receiver online! Broadcasting message...");
            SocketIOClient receiverClient = socketIOServer.getClient(receiverSessionId);
            if (receiverClient != null) {
                receiverClient.sendEvent("chat", chatDTO);
                System.out.println("  - Message broadcasted to receiver");
            } else {
                System.out.println("  - ⚠️ Receiver client not found despite session ID in map");
            }
        } else {
            System.out.println("  - Receiver not online, message will be stored only");
        }

        // Send ACK to sender
        if (ackRequest.isAckRequested()) {
            System.out.println("  - Sending acknowledgment to sender");
            ackRequest.sendAckData(chatDTO);
        }
    }

    // Helper method để chuyển đổi Chat entity thành ChatDTO
    private ChatDTO convertChatToDTO(Chat chat) {
        ChatDTO chatDTO = new ChatDTO();
        chatDTO.setChatId(chat.getChatId());
        chatDTO.setSenderId(chat.getSender().getUserId());
        chatDTO.setSenderName(chat.getSender().getName());
        chatDTO.setSenderRole(chat.getSender().getRole());
        chatDTO.setReceiverId(chat.getReceiver().getUserId());
        chatDTO.setReceiverName(chat.getReceiver().getName());
        chatDTO.setReceiverRole(chat.getReceiver().getRole());
        chatDTO.setMessage(chat.getMessage());
        chatDTO.setRead(chat.isRead());
        chatDTO.setCreatedAt(chat.getCreatedAt());
        return chatDTO;
    }

    @SuppressWarnings("rawtypes")
    private DataListener onMessagesRead() {
        return new DataListener<Map>() {
            @Override
            public void onData(SocketIOClient client, Map data, AckRequest ackRequest) {
                try {
                    String senderId = (String) data.get("senderId");
                    String receiverId = (String) data.get("receiverId");

                    System.out.println("📚 MARKING MESSAGES AS READ:");
                    System.out.println("  - From sender: " + senderId);
                    System.out.println("  - To receiver: " + receiverId);

                    chatService.markAsRead(senderId, receiverId);
                    System.out.println("  - Messages marked as read in database");

                    // Notify sender that messages were read
                    UUID senderSessionId = userSocketMap.get(senderId);
                    if (senderSessionId != null) {
                        System.out.println("  - Sender is online, sending read notification");
                        Map<String, Object> readInfo = new HashMap<>();
                        readInfo.put("receiverId", receiverId);

                        SocketIOClient senderClient = socketIOServer.getClient(senderSessionId);
                        if (senderClient != null) {
                            senderClient.sendEvent("read", readInfo);
                            System.out.println("  - Read notification sent to sender");
                        } else {
                            System.out.println("  - ⚠️ Sender client not found despite session ID in map");
                        }
                    } else {
                        System.out.println("  - Sender not online, no notification sent");
                    }

                    if (ackRequest.isAckRequested()) {
                        ackRequest.sendAckData("Messages marked as read");
                        System.out.println("  - Acknowledgment sent");
                    }
                } catch (Exception e) {
                    System.err.println("❌ ERROR MARKING MESSAGES AS READ: " + e.getMessage());
                    e.printStackTrace();

                    if (ackRequest.isAckRequested()) {
                        Map<String, Object> error = new HashMap<>();
                        error.put("error", e.getMessage());
                        ackRequest.sendAckData(error);
                    }
                }
            }
        };
    }
}