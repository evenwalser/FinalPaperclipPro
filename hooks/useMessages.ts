import { useState, useEffect, useCallback, useRef } from "react";
import {
  LocalConversation,
  LocalMessage,
  PaperclipConversation,
  PaperclipMessage,
  SendMessageRequest,
  MessagesResponse,
  ConversationsResponse,
  SendMessageResponse,
} from "@/types/messages";
import { useUser } from "@/app/contexts/UserContext";

export function useMessages() {
  const [conversations, setConversations] = useState<LocalConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Fetch conversations from Paperclip API
  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (user) {
      try {
        const response = await fetch(
          `/api/paperclip/conversations?user=${JSON.stringify(user)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data: ConversationsResponse = await response.json();

        // Transform Paperclip conversations to local format
        const transformedConversations: LocalConversation[] = data.data
          .filter((conv: PaperclipConversation) => conv?.user?.userId)
          .map((conv: PaperclipConversation) => ({
            id: conv.id,
            messages: [],
            lastMessage: conv?.lastMessage
              ? {
                  message: conv?.lastMessage?.message || "",
                  created: new Date(conv.lastMessage.created),
                  isSeen: conv.lastMessage.isSeen || false,
                }
              : { message: "", created: new Date(), isSeen: true },
            user: {
              userId: conv.user.userId,
              name: conv.user.name,
              firstName: conv.user.firstName,
              lastName: conv.user.lastName,
              pictureUrl: conv.user.pictureUrl,
              verified: conv.user.verified,
              official: conv.user.official,
            },
          }))

        setConversations(transformedConversations);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching conversations:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      if (user) {
        try {
          const response = await fetch(
            `/api/paperclip/messages?userId=${userId}&user=${JSON.stringify(
              user
            )}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch messages");
          }

          const data: MessagesResponse = await response.json();

          // Transform Paperclip messages to local format
          const transformedMessages: LocalMessage[] = data.data.messages
            .map((msg: PaperclipMessage) => ({
              id: msg.id,
              senderType: msg.senderType,
              senderId: msg.senderId,
              receiverId: msg.receiverId,
              receiverType: msg.receiverType,
              userId: msg.userId,
              message: msg.message,
              created: msg.created,
              attachment: msg.attachment,
              isInSupportMode: msg.isInSupportMode,
              isOffer: msg.isOffer,
              isOfferExpired: msg.isOfferExpired,
              acceptOffer: msg.acceptOffer,
              rejectOffer: msg.rejectOffer,
              offer: msg.offer,
              item: msg.item,
            }))
            .sort((a, b) => {
              // Sort by created date - older messages first
              const dateA = new Date(a.created).getTime();
              const dateB = new Date(b.created).getTime();
              return dateA - dateB;
            });

          // Update the conversation with messages
          setConversations((prev) =>
            prev.map((conv) =>
              conv.user?.userId === userId
                ? { ...conv, messages: transformedMessages }
                : conv
            )
          );
        } catch (err: any) {
          setError(err.message);
          console.error("Error fetching messages:", err);
        } finally {
          setLoading(false);
        }
      }
    },
    [user]
  );

  // Send a message
  const sendMessage = useCallback(
    async (userId: string, content: string, options?: { 
      attachmentType?: string; 
      attachmentImages?: string[] | File[]; 
      attachmentItemId?: string 
    }) => {
      if (user) {
        try {
          // If we have files, we need to send them as FormData
          if (options?.attachmentImages?.length && options.attachmentImages[0] instanceof File) {
            const formData = new FormData();
            formData.append('receiverId', userId);
            formData.append('message', content);
            formData.append('attachmentType', options.attachmentType || '');
            
            // Append each file with type assertion
            const files = options.attachmentImages as File[];
            files.forEach((file) => {
              formData.append(`attachmentImages`, file);
            });

            if (options.attachmentItemId) {
              formData.append('attachmentItemId', options.attachmentItemId);
            }

            formData.append('user', JSON.stringify(user));

            const response = await fetch("/api/paperclip/messages", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              throw new Error("Failed to send message");
            }

            const result: SendMessageResponse = await response.json();

            // Add the new message to the conversation
            const newMessage: LocalMessage = {
              id: result.data.messageId,
              senderType: "user",
              senderId: user.id,
              receiverId: userId,
              receiverType: "user",
              userId: user.id,
              message: content,
              created: new Date().toISOString(),
              attachment: {
                type: options.attachmentType || null,
                images: files.map(file => URL.createObjectURL(file)),
                itemId: options.attachmentItemId || null
              },
              isInSupportMode: false,
              isOffer: false,
              isOfferExpired: null,
              acceptOffer: null,
              rejectOffer: null,
            };

            setConversations((prev) =>
              prev.map((conv) =>
                conv.user?.userId === userId
                  ? {
                      ...conv,
                      messages: [...conv.messages, newMessage],
                      lastMessage: {
                        message: content,
                        created: new Date(),
                        isSeen: true,
                      },
                    }
                  : conv
              )
            );

            return result;
          } else {
            // Handle regular message without files
            const messageData: SendMessageRequest = {
              receiverId: userId,
              message: content,
              user,
              ...options,
            };

            const response = await fetch("/api/paperclip/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(messageData),
            });

            if (!response.ok) {
              throw new Error("Failed to send message");
            }

            const result: SendMessageResponse = await response.json();

            // Add the new message to the conversation
            const newMessage: LocalMessage = {
              id: result.data.messageId,
              senderType: "user",
              senderId: user.id,
              receiverId: userId,
              receiverType: "user",
              userId: user.id,
              message: content,
              created: new Date().toISOString(),
              attachment: options?.attachmentType ? {
                type: options.attachmentType,
                images: options.attachmentImages as string[] || [],
                itemId: options.attachmentItemId || null
              } : null,
              isInSupportMode: false,
              isOffer: false,
              isOfferExpired: null,
              acceptOffer: null,
              rejectOffer: null,
            };

            setConversations((prev) =>
              prev.map((conv) =>
                conv.user?.userId === userId
                  ? {
                      ...conv,
                      messages: [...conv.messages, newMessage],
                      lastMessage: {
                        message: content,
                        created: new Date(),
                        isSeen: true,
                      },
                    }
                  : conv
              )
            );

            return result;
          }
        } catch (err: any) {
          setError(err.message);
          console.error("Error sending message:", err);
          throw err;
        }
      }
    },
    [user]
  );

  // Handle offer actions
  const handleOfferAction = useCallback(
    async (messageId: string, action: "accept" | "decline" | "counter") => {
      if (user) {
        try {
          // Find the message to get the offer ID
          const message = conversations
            .flatMap((conv) => conv.messages)
            .find((msg) => msg?.item?.id === messageId);

          if (!message) {
            throw new Error("Message not found");
          }

          if (!message.offer?.id) {
            throw new Error("Offer ID not found for this message");
          }

          let response;
          if (action === "accept") {
            response = await fetch(
              `/api/paperclip/offers/accept/${message.offer.id}?userId=${user.id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          } else if (action === "decline") {
            response = await fetch(
              `/api/paperclip/offers/reject/${message.offer.id}?userId=${user.id}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          } else {
            return;
          }

          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Failed to ${action} offer`;

            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData.error || errorMessage;
            } catch {
              errorMessage = `${errorMessage}: ${errorText}`;
            }

            throw new Error(errorMessage);
          }

          // Update the message status in the UI
          setConversations((prev) =>
            prev.map((conv) => ({
              ...conv,
              messages: conv.messages.map((msg: LocalMessage) =>
                msg.id === messageId && msg.offer
                  ? {
                      ...msg,
                      offer: {
                        ...msg.offer,
                        status:
                          action === "accept"
                            ? "accepted"
                            : action === "decline"
                            ? "declined"
                            : "new",
                      },
                    }
                  : msg
              ),
            }))
          );

          console.log(
            `Successfully ${action}ed offer for message ${messageId}`
          );
        } catch (err: any) {
          setError(err.message);
          console.error("Error handling offer action:", err);
          throw err; // Re-throw to let the component handle it
        }
      }
    },
    [conversations, user]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Convert FileList to array and store
    const filesArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...filesArray]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (receiverId: string, content: string) => {
    try {
      // Always send the message with content, optionally include files if selected
      const messageOptions = selectedFiles.length > 0 ? {
        attachmentType: "image",
        attachmentImages: selectedFiles
      } : undefined;

      await sendMessage(receiverId, content, messageOptions);

      // Clear file selection after sending
      clearFiles();

      // Refresh conversations and messages
      await fetchConversations();
      if (receiverId) {
        await fetchMessages(receiverId);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation, fetchMessages]);

  // Set up interval to fetch conversations and messages every 2 minutes
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log("Auto-refreshing conversations and messages...");
      fetchConversations();

      // If there's an active conversation, also fetch its messages
      if (activeConversation) {
        fetchMessages(activeConversation);
      }
    }, 2 * 60 * 1000);

    // Cleanup interval on unmount or when user/activeConversation changes
    return () => clearInterval(interval);
  }, [user, activeConversation, fetchConversations, fetchMessages]);

  return {
    conversations,
    activeConversation,
    setActiveConversation,
    loading,
    error,
    sendMessage: handleSendMessage,
    handleOfferAction,
    fetchConversations,
    fetchMessages,
    uploading,
    handleFileChange,
    fileInputRef,
    selectedFiles,
    setConversations,
    removeFile,
    clearFiles,
  };
}
