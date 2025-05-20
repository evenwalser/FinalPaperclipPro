import { Dispatch, SetStateAction } from "react";

// Add interface for window with NDEFReader
declare global {
  interface Window {
    NDEFReader: any;
  }
}

// Reader interfaces
export interface Reader {
  id: string;
  object: string;
  device_type: string;
  label: string;
  status: string;
}

export interface ReaderState {
  id: string;
  label: string;
  status: string;
  device_type: string;
  last_connected: string;
}

// NFC interfaces
export interface NDEFMessage {
  records: any[];
}

export interface NDEFReadingEvent {
  message: NDEFMessage;
  serialNumber: string;
}

// Receipt data interfaces
export interface ReceiptData {
  saleData:
    | {
        id: string;
        created_at: string;
        total_amount: number;
        payment_method: string;
        amount_tendered: number;
        change_amount: number;
      }
    | {
        id: string;
        created_at: string;
        total_amount: number;
        refund_method: string;
        reason: string;
        originalSaleId: string;
        isRefund: boolean;
        customer?: {
          name: string;
          email?: string;
          phone?: string;
        };
      };
  items: any[];
}

// Customer data interface
export interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

// Refund interfaces
export interface RefundSale {
  id: string;
  created_at: string;
  total_amount: number;
  payment_method: string;
  customer_id: string;
  sale_items: RefundSaleItem[];
 original_amount?: any; 
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

// Sale item interfaces
export interface SaleItem {
  id: string;
  item_id?: string;
  quantity: number;
  price: number;
  title: string;
  image_url?: string;
  category?: string;
  size?: string;
  shopify_inventory_level_id?: string;
  shopify_product_id?: string;
}

export interface RefundSaleItem extends SaleItem {
  original_quantity: number;
  refunded_quantity: number;
  refund_quantity?: number;
  effective_price?: number;
}

export interface RefundQuantities {
  [key: string]: number;
}

export interface RefundRecord {
  sale_item_id: string;
  quantity: number;
}

// Receipt data interfaces
export interface SaleReceiptData {
  saleData: {
    id?: string;
    created_at?: string;
    total_amount?: number;
    payment_method?: string;
    amount_tendered?: number;
    change_amount?: number;
    receipt_id?: string;
  };
  items?: any[];
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    savingsAmount: number;
  };
}

export interface RefundReceiptData {
  saleData: {
    id: string;
    created_at: string;
    total_amount: number;
    refund_method: string;
    reason: string;
    originalSaleId: string;
    isRefund: boolean;
    customer?: {
      name: string;
      email?: string;
      phone?: string;
    };
  };
  items: any[];
}

// Discount interface
export interface Discount {
  type: "percentage" | "fixed";
  value: number;
}

// Transaction interface
export interface Transaction {
  id: string;
  amount: number;
  status: string;
}

// POS Settings interface
export interface POSSettings {
  acceptCash: boolean;
  acceptCard: boolean;
  receiptLogo: string;
  receiptMessage: string;
}

// Component prop interfaces
export interface CartSectionProps {
  items: SaleItem[];
  isloading: boolean;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  total: number;
  clearCart: () => void;
  validateAndUpdateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  setShowDiscountModal: Dispatch<SetStateAction<boolean>>;
  discount: Discount;
  calculateFinalTotal: () => number;
}

export interface PaymentSectionProps {
  amount: string;
  setAmount: (amount: string) => void;
  change: number;
  isProcessing: boolean;
  paymentMethod: "card" | "cash" | null;
  items: SaleItem[];
  handlePayment: (method: "card" | "cash" | "terminal") => Promise<void>;
  handleNumberClick: (num: string) => void;
  handleClear: () => void;
  handleDecimal: () => void;
}

export interface CustomerFormProps {
  customerData: CustomerData;
  setCustomerData: Dispatch<SetStateAction<CustomerData>>;
  handleCustomerSubmit: () => void;
  setShowCustomerForm: Dispatch<SetStateAction<boolean>>;
}

export interface PaymentOptionsModalProps {
  posSettings: POSSettings;
  handlePayment: (method: "card" | "cash" | "terminal") => Promise<void>;
  setShowPaymentOptions: Dispatch<SetStateAction<boolean>>;
}

export interface DiscountModalProps {
  discount: Discount;
  setDiscount: Dispatch<SetStateAction<Discount>>;
  setShowDiscountModal: Dispatch<SetStateAction<boolean>>;
  total: number;
  calculateFinalTotal: () => number;
}

export interface ReaderManagerProps {
  reader: Reader | null;
  availableReaders: Reader[];
  terminalLoading: boolean;
  terminalStatus: string;
  discoverReaders: () => Promise<Reader[]>;
  selectReader: (readerId: string) => Promise<boolean>;
  setShowReaderManager: Dispatch<SetStateAction<boolean>>;
}

export interface TerminalStatusProps {
  terminalStatus: string;
  terminalLoading: boolean;
  showTerminalOptions: boolean;
  setShowTerminalOptions: Dispatch<SetStateAction<boolean>>;
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
}

export interface TerminalWaitingProps {
  setWaitingForTerminal: Dispatch<SetStateAction<boolean>>;
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
  setTerminalStatus: Dispatch<SetStateAction<string>>;
}

export interface RefundModalProps {
  showRefundModal: boolean;
  selectedSale: RefundSale | null;
  refundItems: RefundSaleItem[];
  refundReason: string;
  searchSaleId: string;
  setShowRefundModal: Dispatch<SetStateAction<boolean>>;
  setSelectedSale: Dispatch<SetStateAction<RefundSale | null>>;
  setRefundItems: Dispatch<SetStateAction<RefundSaleItem[]>>;
  setRefundReason: Dispatch<SetStateAction<string>>;
  setSearchSaleId: Dispatch<SetStateAction<string>>;
  searchSale: () => Promise<void>;
  updateRefundQuantity: (itemId: string, quantity: number) => void;
  calculateRefundTotal: () => number;
  processRefund: () => Promise<void>;
  formatCurrency: (amount: number) => string;
  isProcessing: boolean;
  isProcessRefund: boolean;
}

// Add this interface
export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
} 