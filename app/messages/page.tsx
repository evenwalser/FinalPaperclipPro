"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  MessageSquare,
  PaperclipIcon,
  Search,
  Send,
  Smile,
  Loader2,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { OfferMessageComponent } from "./OfferMessageComponent";
import { useMessages } from "@/hooks/useMessages";
import { LocalConversation, LocalMessage } from "@/types/messages";
import { uploadAsset } from "@/lib/services/storage";
import { v4 as uuidv4 } from "uuid";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

function parseDateString(dateString: string): Date {
  // Convert "2025-06-19 06:52:40" to "2025-06-19T06:52:40Z"
  // If you want to treat it as UTC, add 'Z'
  // If you want to treat it as local, just replace the space with 'T'
  const isoString = dateString.replace(" ", "T") + "Z";
  return new Date(isoString);
}

const formatMessageDate = (dateString: string) => {
  const date = parseDateString(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const messageDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (messageDate.getTime() === today.getTime()) {
    return "Today";
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    // Use local time for formatting
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};

const formatMessageTime = (dateString: string) => {
  const date = parseDateString(dateString);
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Function to group messages by date
const groupMessagesByDate = (messages: LocalMessage[]) => {
  const groups: { date: string; messages: LocalMessage[] }[] = [];
  let currentDate = "";
  let currentGroup: LocalMessage[] = [];

  messages.forEach((message) => {
    const messageDate = formatMessageDate(message.created);

    if (messageDate !== currentDate) {
      if (currentGroup.length > 0) {
        groups.push({ date: currentDate, messages: currentGroup });
      }
      currentDate = messageDate;
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
  });

  if (currentGroup.length > 0) {
    groups.push({ date: currentDate, messages: currentGroup });
  }

  return groups;
};

export default function MessagesPage() {
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const {
    conversations,
    activeConversation,
    setActiveConversation,
    loading,
    error,
    sendMessage,
    handleOfferAction,
    uploading,
    handleFileChange: originalHandleFileChange,
    fileInputRef,
    selectedFiles,
    removeFile,
    setConversations,
    fetchConversations,
    fetchMessages,
  } = useMessages();

  // Wrap handleFileChange to create preview URLs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleFileChange(e);
    const files = e.target.files;
    if (files) {
      const newUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  // Remove a file and its preview
  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    removeFile(index);
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const selectedConversation = conversations.find(
    (conv) => conv?.user?.userId === activeConversation
  );

  // const handleOfferAction = (
  //   messageId: string,
  //   action: "accept" | "decline" | "counter"
  // ) => {
  //   console.log(`${action} offer for message ${messageId}`);
  // Handle offer actions here
  // };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conv) =>
      conv?.user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      conv?.lastMessage?.message
        ?.toLowerCase()
        ?.includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (activeConversation && (newMessage.trim() || selectedFiles.length > 0)) {
      try {
        await sendMessage(activeConversation, newMessage.trim());
        setNewMessage("");
        setPreviewUrls([]);
      } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message. Please try again.");
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setNewMessage((prev) => prev + (emoji.native || ""));
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-gray-700 bg-gray-800/50 backdrop-blur-sm flex flex-col">
        <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            <h1 className="text-xl font-semibold text-gray-100">Messages</h1>
            {/* <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-gray-100 hover:bg-gray-700"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button> */}
          </div>
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-700/50 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-[#DC2626] focus:ring-[#DC2626]"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-gray-700 hover:bg-gray-700/50 transition-colors",
                  activeConversation === conversation.id && "bg-gray-700/50",
                  !conversation.lastMessage.isSeen &&
                    "border-l-4 border-l-[#DC2626]"
                )}
                onClick={() =>
                  setActiveConversation(conversation?.user?.userId)
                }
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 border border-gray-600">
                    <img
                      src={conversation.user.pictureUrl || "/placeholder.svg"}
                      alt={conversation.user.name}
                      className="object-cover"
                    />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate text-gray-100">
                        {conversation.user.name}
                      </h3>
                      <time className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(
                          conversation.lastMessage.created
                        ).toLocaleDateString()}
                      </time>
                    </div>
                    <p className="text-sm text-gray-300 truncate">
                      {conversation.lastMessage.message}
                    </p>
                  </div>
                  {!conversation.lastMessage.isSeen && (
                    <Badge className="bg-[#DC2626] text-white hover:bg-[#E6352B]">
                      New
                    </Badge>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
        <div className="hidden md:flex flex-1 flex-col">
          {/* Chat Header */}
          <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border border-gray-600">
                  <img
                    src={
                      selectedConversation?.user.pictureUrl ||
                      "/placeholder.svg"
                    }
                    alt={selectedConversation?.user.name}
                    className="object-cover"
                  />
                </Avatar>
                <h2 className="font-medium text-gray-100">
                  {selectedConversation?.user.name}
                </h2>
              </div>
              {/* <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                >
                  View Profile
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div> */}
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            ) : !selectedConversation ||
              selectedConversation.messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                No messages yet. Start the conversation!
              </div>
            ) : selectedConversation ? (
              groupMessagesByDate(selectedConversation.messages).map(
                (group) => (
                  <div key={group.date}>
                    {/* Date Header */}
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                        {group.date}
                      </div>
                    </div>

                    {/* Messages for this date */}
                    {group.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex mb-4",
                          message.userId === message.senderId
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        <div className="flex items-start gap-2 max-w-[80%]">
                          {message.userId !== message.senderId && (
                            <Avatar className="w-6 h-6 mt-1 border border-gray-600">
                              <img
                                src={
                                  selectedConversation.user.pictureUrl ||
                                  "/placeholder.svg"
                                }
                                alt={selectedConversation.user.name}
                                className="object-cover"
                              />
                            </Avatar>
                          )}
                          <div>
                            {message.isOffer ? (
                              <OfferMessageComponent
                                message={message}
                                isMe={message.userId === message.senderId}
                                isExpired={message.isOfferExpired ?? false}
                                onAccept={async () => {
                                  if (
                                    message.isOfferExpired ||
                                    message.offer?.status === "expired"
                                  ) {
                                    alert(
                                      "This offer has expired and cannot be accepted."
                                    );
                                    return;
                                  }
                                  await handleOfferAction(
                                    message?.item?.id || "",
                                    "accept"
                                  );
                                  setConversations(
                                    (prev: LocalConversation[]) =>
                                      prev.map((conv: LocalConversation) => ({
                                        ...conv,
                                        messages: conv.messages.map(
                                          (msg: LocalMessage) =>
                                            msg.id === message.id && msg.offer
                                              ? {
                                                  ...msg,
                                                  offer: {
                                                    ...msg.offer,
                                                    status: "accepted",
                                                  },
                                                }
                                              : msg
                                        ),
                                      }))
                                  );
                                  await fetchConversations();
                                  if (activeConversation) {
                                    await fetchMessages(activeConversation);
                                  }
                                }}
                                onDecline={async () => {
                                  if (
                                    message.isOfferExpired ||
                                    message.offer?.status === "expired"
                                  ) {
                                    alert(
                                      "This offer has expired and cannot be declined."
                                    );
                                    return;
                                  }
                                  try {
                                    await handleOfferAction(
                                      message?.item?.id || "",
                                      "decline"
                                    );
                                    await fetchConversations();
                                    if (activeConversation) {
                                      await fetchMessages(activeConversation);
                                    }
                                  } catch (err: any) {
                                    if (
                                      err?.message
                                        ?.toLowerCase()
                                        .includes("expired")
                                    ) {
                                      alert(
                                        "This offer has expired and cannot be declined."
                                      );
                                    } else {
                                      alert(
                                        "Failed to decline offer. Please try again."
                                      );
                                    }
                                  }
                                }}
                              />
                            ) : (
                              <div>
                                <div
                                  className={cn(
                                    "rounded-lg p-3",
                                    message.userId === message.senderId
                                      ? "bg-[#DC2626] text-white rounded-tr-none"
                                      : "bg-gray-700 text-gray-100 rounded-tl-none"
                                  )}
                                >
                                  <p>{message.message}</p>
                                  {message.attachment?.type === "image" && (
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                      {(
                                        message.attachment?.images as string[]
                                      ).map((image: string, index: number) => (
                                        <div key={index} className="relative">
                                          <img
                                            src={image}
                                            alt={`Attachment ${index + 1}`}
                                            className="rounded-md w-full h-auto max-h-48 object-cover cursor-pointer"
                                            onClick={() =>
                                              window.open(image, "_blank")
                                            }
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="mt-1 text-xs text-gray-400">
                                  {formatMessageTime(message.created)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )
            ) : null}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-700 p-4 bg-gray-800/50 backdrop-blur-sm relative">
            {/* File Previews */}
            {previewUrls.length > 0 && (
              <div className="p-2 border-b border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={url} className="relative inline-block">
                      <img
                        src={url}
                        alt={`Selected file ${index + 1}`}
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form
              className="flex items-center gap-2 p-4"
              onSubmit={handleSendMessage}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "text-gray-400 hover:text-gray-200 hover:bg-gray-700",
                  selectedFiles.length > 0 && "text-[#DC2626]"
                )}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <PaperclipIcon className="w-5 h-5" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-gray-700/50 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-[#DC2626] focus:ring-[#DC2626]"
                disabled={loading}
                onFocus={() => setShowEmojiPicker(false)}
              />
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  tabIndex={-1}
                >
                  <Smile className="w-5 h-5" />
                </Button>
                {showEmojiPicker && (
                  <div className="absolute bottom-12 right-0 z-50">
                    <Picker
                      data={data}
                      onEmojiSelect={handleEmojiSelect}
                      theme="dark"
                    />
                  </div>
                )}
              </div>
              <Button
                type="submit"
                size="icon"
                className="bg-[#DC2626] hover:bg-[#E6352B] text-white"
                disabled={
                  (!newMessage.trim() && selectedFiles.length === 0) || loading
                }
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      ) : error ? (
        <div
          className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 
    w-[-webkit-fill-available]"
        >
          <Card className="w-96 p-6 text-center shadow-lg bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <div className="flex justify-center mb-4">
              <MessageSquare className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-100">
              Error Loading Messages
            </h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#DC2626] hover:bg-[#E6352B] text-white"
            >
              Retry
            </Button>
          </Card>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <Card className="w-96 p-6 text-center shadow-lg bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <div className="flex justify-center mb-4">
              <MessageSquare className="w-12 h-12 text-[#DC2626]" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-100">
              Your Messages
            </h2>
            <p className="text-gray-300 mb-4">
              Select a conversation to view messages or start a new
              conversation.
            </p>
            {/* <Button className="bg-[#DC2626] hover:bg-[#E6352B] text-white">
              New Message <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button> */}
          </Card>
        </div>
      )}

      {/* Mobile view - show empty state or selected conversation */}
      <div className="md:hidden flex-1 flex items-center justify-center">
        {activeConversation ? (
          <div className="w-full h-full flex flex-col">
            {/* Mobile Chat Header */}
            <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
              <div className="flex items-center h-16 px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveConversation(null)}
                  className="mr-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                >
                  <ArrowUpRight className="w-5 h-5 rotate-180" />
                </Button>
                <Avatar className="w-8 h-8 border border-gray-600">
                  <img
                    src={
                      selectedConversation?.user.pictureUrl ||
                      "/placeholder.svg"
                    }
                    alt={selectedConversation?.user.name}
                    className="object-cover"
                  />
                </Avatar>
                <h2 className="font-medium ml-2 text-gray-100">
                  {selectedConversation?.user.name}
                </h2>
              </div>
            </header>

            {/* Mobile Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : !selectedConversation ||
                selectedConversation.messages.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                groupMessagesByDate(selectedConversation.messages).map(
                  (group) => (
                    <div key={group.date}>
                      {/* Date Header */}
                      <div className="flex justify-center mb-4">
                        <div className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                          {group.date}
                        </div>
                      </div>

                      {/* Messages for this date */}
                      {group.messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex mb-4",
                            message.userId === message.senderId
                              ? "justify-end"
                              : "justify-start"
                          )}
                        >
                          <div className="flex items-start gap-2 max-w-[80%]">
                            {message.userId !== message.senderId && (
                              <Avatar className="w-6 h-6 mt-1 border border-gray-600">
                                <img
                                  src={
                                    selectedConversation.user.pictureUrl ||
                                    "/placeholder.svg"
                                  }
                                  alt={selectedConversation.user.name}
                                  className="object-cover"
                                />
                              </Avatar>
                            )}
                            <div>
                              {message.isOffer ? (
                                <OfferMessageComponent
                                  message={message}
                                  isMe={message.userId === message.senderId}
                                  isExpired={message.isOfferExpired ?? false}
                                  onAccept={async () => {
                                    if (
                                      message.isOfferExpired ||
                                      message.offer?.status === "expired"
                                    ) {
                                      alert(
                                        "This offer has expired and cannot be accepted."
                                      );
                                      return;
                                    }
                                    await handleOfferAction(
                                      message?.item?.id || "",
                                      "accept"
                                    );
                                    setConversations(
                                      (prev: LocalConversation[]) =>
                                        prev.map((conv: LocalConversation) => ({
                                          ...conv,
                                          messages: conv.messages.map(
                                            (msg: LocalMessage) =>
                                              msg.id === message.id && msg.offer
                                                ? {
                                                    ...msg,
                                                    offer: {
                                                      ...msg.offer,
                                                      status: "accepted",
                                                    },
                                                  }
                                                : msg
                                          ),
                                        }))
                                    );
                                    await fetchConversations();
                                    if (activeConversation) {
                                      await fetchMessages(activeConversation);
                                    }
                                  }}
                                  onDecline={async () => {
                                    if (
                                      message.isOfferExpired ||
                                      message.offer?.status === "expired"
                                    ) {
                                      alert(
                                        "This offer has expired and cannot be declined."
                                      );
                                      return;
                                    }
                                    try {
                                      await handleOfferAction(
                                        message?.item?.id || "",
                                        "decline"
                                      );
                                      await fetchConversations();
                                      if (activeConversation) {
                                        await fetchMessages(activeConversation);
                                      }
                                    } catch (err: any) {
                                      if (
                                        err?.message
                                          ?.toLowerCase()
                                          .includes("expired")
                                      ) {
                                        alert(
                                          "This offer has expired and cannot be declined."
                                        );
                                      } else {
                                        alert(
                                          "Failed to decline offer. Please try again."
                                        );
                                      }
                                    }
                                  }}
                                />
                              ) : (
                                <div>
                                  <div
                                    className={cn(
                                      "rounded-lg p-3",
                                      message.userId === message.senderId
                                        ? "bg-[#DC2626] text-white rounded-tr-none"
                                        : "bg-gray-700 text-gray-100 rounded-tl-none"
                                    )}
                                  >
                                    <p>{message.message}</p>
                                    {message.attachment?.type === "image" && (
                                      <div className="mt-2 grid grid-cols-2 gap-2">
                                        {(
                                          message.attachment?.images as string[]
                                        ).map(
                                          (image: string, index: number) => (
                                            <div
                                              key={index}
                                              className="relative"
                                            >
                                              <img
                                                src={image}
                                                alt={`Attachment ${index + 1}`}
                                                className="rounded-md w-full h-auto max-h-48 object-cover cursor-pointer"
                                                onClick={() =>
                                                  window.open(image, "_blank")
                                                }
                                              />
                                            </div>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="mt-1 text-xs text-gray-400">
                                    {formatMessageTime(message.created)}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )
              )}
            </div>

            {/* Mobile Message Input */}
            <div className="border-t border-gray-700 p-3 bg-gray-800/50 backdrop-blur-sm relative">
              <form
                className="flex items-center gap-2"
                onSubmit={handleSendMessage}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "text-gray-400 hover:text-gray-200 hover:bg-gray-700",
                    selectedFiles.length > 0 && "text-[#DC2626]"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <PaperclipIcon className="w-5 h-5" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-700/50 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:border-[#DC2626] focus:ring-[#DC2626]"
                  disabled={loading}
                  onFocus={() => setShowEmojiPicker(false)}
                />
                <div className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    onClick={() => setShowEmojiPicker((v) => !v)}
                    tabIndex={-1}
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 z-50">
                      <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme="dark"
                      />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#DC2626] hover:bg-[#E6352B] text-white"
                  disabled={!newMessage.trim() || loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          <Card className="mx-4 p-6 text-center shadow-lg bg-gray-800/80 backdrop-blur-sm border-gray-700">
            <div className="flex justify-center mb-4">
              <MessageSquare className="w-12 h-12 text-[#DC2626]" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-100">
              Your Messages
            </h2>
            <p className="text-gray-300 mb-4">
              Select a conversation to view messages or start a new
              conversation.
            </p>
            {/* <Button className="bg-[#DC2626] hover:bg-[#E6352B] text-white">
              New Message <ArrowUpRight className="ml-2 w-4 h-4" />
            </Button> */}
          </Card>
        )}
      </div>
    </div>
  );
}
