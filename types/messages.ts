// Types for Paperclip Messages API
export interface PaperclipMessage {
  id: string;
  senderType: "user";
  senderId: string;
  receiverId: string;
  receiverType: "user";
  userId: string;
  message: string;
  created: string;
  attachment: any | null;
  isInSupportMode: boolean;
  isOffer: boolean;
  isOfferExpired: boolean | null;
  acceptOffer: string | null;
  rejectOffer: string | null;
  offer?: {
    id: string;
    listingId: string;
    price: number;
    isExpired: boolean;
    status: "new" | "accepted" | "declined" | "expired";
  };
  item?: {
    id: string;
    name: string;
    price: number;
    media: string[];
    brand: string | null;
  };
}

export interface PaperclipUser {
  userId: string;
  name: string;
  firstName: string;
  lastName: string;
  username?: string;
  pictureUrl: string;
  locationName?: string;
  isFollowed?: boolean;
  suspended?: boolean;
  verified: boolean;
  official: boolean;
  deleted?: boolean;
}

export interface PaperclipConversation {
  id: string;
  lastMessage: {
    message: string;
    created: string;
    isSeen: boolean;
  };
  user: PaperclipUser;
}

export interface MessagesResponse {
  errorCodeInt: number;
  data: {
    user: PaperclipUser;
    conversationId: string;
    messages: PaperclipMessage[];
  };
}

export interface ConversationsResponse {
  code: number;
  data: PaperclipConversation[];
}

export interface SendMessageResponse {
  code: number;
  data: {
    messageId: string;
    isInSupportMode: boolean;
  };
}

export interface SendMessageRequest {
  userId: string;
  message: string;
  attachment?: any;
  isOffer?: boolean;
  offerData?: {
    listingId: string;
    price: number;
  };
  user: PaperclipUser;
}

// Local types for the UI
export interface LocalMessage {
  id: string;
  senderType: "user";
  senderId: string;
  receiverId: string;
  receiverType: "user";
  userId: string;
  message: string;
  created: string;
  attachment: any | null;
  isInSupportMode: boolean;
  isOffer: boolean;
  isOfferExpired: boolean | null;
  acceptOffer: string | null;
  rejectOffer: string | null;
  offer?: {
    id: string;
    listingId: string;
    price: number;
    isExpired: boolean;
    status: "new" | "accepted" | "declined" | "expired";
  };
  item?: {
    id: string;
    name: string;
    price: number;
    media: string[];
    brand: string | null;
  };
}

export interface LocalConversation {
  messages: LocalMessage[];
  id: string;
  lastMessage: {
    message: string;
    created: Date;
    isSeen: boolean;
  };
  user: {
    userId: string;
    name: string;
    firstName: string;
    lastName: string;
    pictureUrl: string;
    verified: boolean;
    official: boolean;
  };
}
