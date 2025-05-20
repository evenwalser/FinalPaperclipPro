"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { ShoppingCart, CreditCard, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Receipt } from "@/components/Receipt";
import { getUser } from "@/lib/services/items";
import { RefundReceipt } from "@/components/RefundReceipt";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

// Import types
import {
  CustomerData,
  Discount,
  NDEFReadingEvent,
  POSSettings,
  Reader,
  RefundReceiptData,
  RefundSale,
  RefundSaleItem,
  SaleReceiptData,
} from "../../components/pos/types";

// Import components
import CartSection from "@/components/pos/CartSection";
import PaymentSection from "@/components/pos/PaymentSection";
import CustomerForm from "@/components/pos/CustomerForm";
import PaymentOptionsModal from "@/components/pos/PaymentOptionsModal";
import DiscountModal from "@/components/pos/DiscountModal";
import RefundModal from "@/components/pos/RefundModal";
import ReaderManager from "@/components/pos/terminal/ReaderManager";
import TerminalStatus from "@/components/pos/terminal/TerminalStatus";
import TerminalWaiting from "@/components/pos/terminal/TerminalWaiting";

// Import utilities
import {
  formatCurrency,
  calculateFinalTotal,
  processCashPayment,
  storeTerminalPaymentContext,
} from "../../utils/pos/payment-utils";

import {
  checkReaderStatus,
  discoverReaders as discoverReadersUtil,
  selectReader as selectReaderUtil,
  createTerminalPayment as createTerminalPaymentUtil,
  processTerminalPayment as processTerminalPaymentUtil,
} from "../../utils/pos/terminal-utils";

import {
  processCustomerData,
  validateCustomerData,
} from "../../utils/pos/customer-utils";

import {
  searchSale as searchSaleUtil,
  updateRefundQuantity as updateRefundQuantityUtil,
  calculateRefundTotal as calculateRefundTotalUtil,
  processRefund as processRefundUtil,
} from "../../utils/pos/refund-utils";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export default function POSPage() {
  const [availableReaders, setAvailableReaders] = useState<Reader[]>([]);
  const [showReaderManager, setShowReaderManager] = useState(false);
  const { items, updateQuantity, removeItem, total, clearCart, isLoading } =
    useCart();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const [amount, setAmount] = useState("0.00");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | null>(
    null
  );
  const [change, setChange] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<SaleReceiptData | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
  });
  const [posSettings, setPosSettings] = useState<POSSettings>({
    acceptCash: true,
    acceptCard: true,
    receiptLogo: "",
    receiptMessage: "Thank you for shopping with us!",
  });
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [searchSaleId, setSearchSaleId] = useState("");
  const [selectedSale, setSelectedSale] = useState<RefundSale | null>(null);
  const [refundItems, setRefundItems] = useState<RefundSaleItem[]>([]);
  const [refundReason, setRefundReason] = useState("");
  const [showRefundReceipt, setShowRefundReceipt] = useState(false);
  const [showTerminalOptions, setShowTerminalOptions] = useState(false);
  const [refundReceiptData, setRefundReceiptData] =
    useState<RefundReceiptData | null>(null);
  const [discount, setDiscount] = useState<Discount>({
    type: "fixed",
    value: 0,
  });
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [isProcessRefund, setIsProcessRefund] = useState(false);

  const scanButton = useRef<HTMLButtonElement>(null);

  // Terminal states
  const [reader, setReader] = useState<Reader | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  const [terminalStatus, setTerminalStatus] = useState<string>(
    "Stripe Terminal not initialized"
  );
  const [terminalLoading, setTerminalLoading] = useState(false);
  const [waitingForTerminal, setWaitingForTerminal] = useState(false);
  const [pendingReceiptId, setPendingReceiptId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getUser();
        setUser(user);
        console.log("here is my user", user);
      } catch (error) {
        console.error("Failed to load items:", error);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const loadSavedReader = async () => {
      try {
        // Try to get reader from local storage first
        const savedReader = localStorage.getItem("pos_active_reader");

        if (savedReader) {
          const readerData = JSON.parse(savedReader);
          setReader(readerData);
          setTerminalStatus(
            `Reader loaded: ${readerData.label || readerData.id}`
          );
        } else {
          // Try to get reader from database if user is logged in
          if (user?.store_id) {
            const { data } = await supabase
              .from("terminal_readers")
              .select("*")
              .eq("store_id", user.store_id)
              .eq("is_active", true)
              .maybeSingle();

            if (data) {
              setReader(data);
              // Also save to localStorage for faster access next time
              localStorage.setItem("pos_active_reader", JSON.stringify(data));
              setTerminalStatus(`Reader loaded: ${data.label || data.id}`);
            }
          }
        }
      } catch (error) {
        console.error("Error loading saved reader:", error);
      }
    };

    loadSavedReader();
  }, [user?.store_id, supabase]);

  useEffect(() => {
    if (typeof total === "number") {
      setAmount(total.toFixed(2));
    }
  }, [total]);

  useEffect(() => {
    const fetchPOSSettings = async () => {
      try {
        if (!user) return;
        const { data, error } = await supabase
          .from("stores")
          .select("accept_cash, accept_card, receipt_logo, receipt_message")
          .eq("owner_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setPosSettings({
            acceptCash: data.accept_cash ?? true,
            acceptCard: data.accept_card ?? true,
            receiptLogo: data.receipt_logo || "",
            receiptMessage:
              data.receipt_message || "Thank you for shopping with us!",
          });
        }
      } catch (error) {
        console.error("Error fetching POS settings:", error);
        toast.error("Failed to load POS settings");
      }
    };

    fetchPOSSettings();
  }, [user, supabase]);

  const generateNumericReceiptId = (): string => {
    // Use timestamp and random number to ensure uniqueness
    const timestamp = Date.now().toString(); // Current time in milliseconds
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0"); // 4-digit random number
    return `${timestamp}${randomNum}`.slice(-10); // Take last 10 digits for consistency
  };

  const handleNumberClick = (num: string) => {
    if (amount === "0.00") {
      setAmount(num);
    } else {
      setAmount((prev) => prev + num);
    }
  };

  const handleClear = () => {
    setAmount(typeof total === "number" ? total.toFixed(2) : "0.00");
  };

  const handleDecimal = () => {
    if (!amount.includes(".")) {
      setAmount((prev) => prev + ".");
    }
  };

  const handleProcessRefund = () => {
    setShowRefundModal(true);
  };
  // const handleCompleteSale = async () => {
  //   if (items.length === 0) {
  //     toast.error("Cart is empty");
  //     return;
  //   }

  //   const finalTotal = calculateFinalTotal(total, discount);
  //   if (parseFloat(amount) < finalTotal) {
  //     toast.error("Amount is less than total");
  //     return;
  //   }

  //   try {
  //     for (const item of items) {
  //       const { data: currentItem, error } = await supabase
  //         .from("items")
  //         .select("quantity")
  //         .eq("id", item.id)
  //         .single();

  //       if (error) throw error;
  //       if (!currentItem) {
  //         toast.error(`Item "${item.title}" not found`);
  //         return;
  //       }

  //       if (item.quantity > currentItem.quantity) {
  //         toast.error(
  //           `Only ${currentItem.quantity} items available for "${item.title}"`
  //         );
  //         updateQuantity(item.id, currentItem.quantity);
  //         return;
  //       }
  //     }

  //     // Generate the numeric receipt ID
  //     const receiptId = generateNumericReceiptId();
  //     setPendingReceiptId(receiptId);
  //     setReceiptData((prev) => ({
  //       ...prev,
  //       saleData: { ...prev?.saleData, receipt_id: receiptId },
  //     }));

  //     setShowCustomerForm(true);
  //   } catch (error) {
  //     toast.error("Failed to validate stock quantities");
  //     console.error("Stock validation error:", error);
  //   }
  // };

  const handleCompleteSale = async () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const finalTotal = calculateFinalTotal(total, discount);
    if (parseFloat(amount) < finalTotal) {
      toast.error("Amount is less than total");
      return;
    }

    try {
      for (const item of items) {
        const { data: currentItem, error } = await supabase
          .from("items")
          .select("quantity")
          .eq("id", item.id)
          .single();

        if (error) throw error;
        if (!currentItem) {
          toast.error(`Item "${item.title}" not found`);
          return;
        }

        if (item.quantity > currentItem.quantity) {
          toast.error(
            `Only ${currentItem.quantity} items available for "${item.title}"`
          );
          updateQuantity(item.id, currentItem.quantity);
          return;
        }
      }

      const receiptId = generateNumericReceiptId();
      setPendingReceiptId(receiptId);
      setReceiptData((prev) => ({
        ...prev,
        saleData: { ...prev?.saleData, receipt_id: receiptId },
      }));
      setShowCustomerForm(true);
    } catch (error) {
      toast.error("Failed to validate stock quantities");
      console.error("Stock validation error:", error);
    }
  };
  // const handleCompleteSale = async () => {
  //   if (items.length === 0) {
  //     toast.error("Cart is empty");
  //     return;
  //   }

  //   const finalTotal = calculateFinalTotal(total, discount);
  //   if (parseFloat(amount) < finalTotal) {
  //     toast.error("Amount is less than total");
  //     return;
  //   }

  //   // Validate stock quantities
  //   try {
  //     for (const item of items) {
  //       const { data: currentItem, error } = await supabase
  //         .from("items")
  //         .select("quantity")
  //         .eq("id", item.id)
  //         .single();

  //       if (error) throw error;
  //       if (!currentItem) {
  //         toast.error(`Item "${item.title}" not found`);
  //         return;
  //       }

  //       if (item.quantity > currentItem.quantity) {
  //         toast.error(
  //           `Only ${currentItem.quantity} items available for "${item.title}"`
  //         );
  //         updateQuantity(item.id, currentItem.quantity);
  //         return;
  //       }
  //     }

  //     // Generate the numeric receipt ID
  //     const receiptId = generateNumericReceiptId();

  //     // Store the receipt ID temporarily or pass it to the next step
  //     setReceiptData((prev) => ({
  //       ...prev,
  //       saleData: { ...prev?.saleData, receipt_id: receiptId },
  //     }));

  //     // Proceed to customer form
  //     setShowCustomerForm(true);
  //   } catch (error) {
  //     toast.error("Failed to validate stock quantities");
  //     console.error("Stock validation error:", error);
  //   }
  // };

  const handleCustomerSubmit = () => {
    if (!validateCustomerData(customerData)) return;

    setShowCustomerForm(false);
    setShowPaymentOptions(true);
  };

  const handlePayment = async (method: "card" | "cash" | "terminal") => {
    try {
      if (items.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      for (const item of items) {
        const { data: currentItem, error } = await supabase
          .from("items")
          .select("quantity") //marketplace_product_id
          .eq("id", item.id)
          .single();

        if (error) throw error;
        if (!currentItem) {
          toast.error(`Item "${item.title}" not found`);
          return;
        }

        if (item.quantity > currentItem.quantity) {
          toast.error(
            `Only ${currentItem.quantity} items available for "${item.title}"`
          );
          updateQuantity(item.id, currentItem.quantity);
          return;
        }
      }

      if (method === "terminal") {
        setPaymentMethod("card");
        setIsProcessing(true);
        setShowPaymentOptions(false);

        if (!reader) {
          toast.error(
            "No card reader configured. Please set up a reader first."
          );
          setShowReaderManager(true);
          setIsProcessing(false);
          return;
        }

        const readerStatus = await checkReaderStatus(reader);
        if (!readerStatus.ready) {
          toast.error(`Reader issue: ${readerStatus.message}`);
          setIsProcessing(false);
          return;
        }

        const finalTotal = calculateFinalTotal(total, discount);
        const receiptId = pendingReceiptId || generateNumericReceiptId();
        if (!receiptId) {
          toast.error("Receipt ID not generated");
          setIsProcessing(false);
          return;
        }

        const { success: paymentCreated, paymentIntentId } =
          await createTerminalPayment(reader, finalTotal, receiptId);

        if (!paymentCreated || !paymentIntentId) {
          toast.error("Failed to create payment");
          setIsProcessing(false);
          return;
        }

        await processTerminalPayment(reader, paymentIntentId);
        return;
      }

      setPaymentMethod(method);
      setIsProcessing(true);

      if (method === "cash") {
        const amountTendered = parseFloat(amount);
        const finalTotal = calculateFinalTotal(total, discount);
        const changeAmount = amountTendered - finalTotal;

        if (changeAmount < 0) {
          toast.error("Insufficient payment amount");
          setIsProcessing(false);
          return;
        }

        setChange(changeAmount);

        const customerRecord = await processCustomerData(
          customerData,
          user.id,
          user.store_id,
          finalTotal
        );
        if (!customerRecord) {
          setIsProcessing(false);
          return;
        }

        const originalAmount = total;
        const receiptId = pendingReceiptId;
        if (!receiptId) {
          toast.error("Receipt ID not generated");
          setIsProcessing(false);
          return;
        }

        const {
          success,
          saleRecord,
          items: saleItems,
        } = await processCashPayment(
          items,
          amountTendered,
          finalTotal,
          originalAmount,
          customerRecord,
          discount,
          user.id,
          user.store_id,
          customerData,
          receiptId
        );

        if (success && saleRecord) {

          // for (const soldItem of items) {
          //   const { data: itemData } = await supabase
          //     .from("items")
          //     .select("marketplace_product_id, quantity")
          //     .eq("id", soldItem.id)
          //     .single();

          //   if (itemData?.marketplace_product_id) {
          //     const newQuantity = itemData.quantity - soldItem.quantity;
          //     const response = await fetch(
          //       `https://paperclip.marketplace/api/products/${itemData.marketplace_product_id}/inventory`,
          //       {
          //         method: "PUT",
          //         headers: {
          //           "Content-Type": "application/json",
          //           "Authorization": `Bearer ${process.env.MARKETPLACE_API_KEY}`,
          //         },
          //         body: JSON.stringify({ quantity: newQuantity }),
          //       }
          //     );

          //     if (!response.ok) {
          //       console.error("Failed to update marketplace inventory:", await response.text());
          //     }
          //   }
          // }
          setReceiptData({
            saleData: saleRecord,
            items: saleItems,
            discount:
              discount.value > 0
                ? {
                    type: discount.type,
                    value: discount.value,
                    savingsAmount: originalAmount - finalTotal,
                  }
                : undefined,
          });

          setShowReceipt(true);
          toast.success("Payment successful via cash");
          clearCart();
          setDiscount({ type: "fixed", value: 0 });
          setAmount("0.00");
          setPendingReceiptId(null); // Clear after use
        }
      } else if (method === "card") {
        toast.error("Standard card payment is not implemented yet");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error(
        error instanceof Error ? error.message : "Payment processing failed"
      );
      setIsProcessing(false);
      setPaymentMethod(null);
    }
  };
 
  // Terminal utility wrapper functions
  const discoverReaders = async () => {
    return await discoverReadersUtil(
      setAvailableReaders,
      setTerminalStatus,
      setTerminalLoading
    );
  };

  const selectReader = async (readerId: string) => {
    return await selectReaderUtil(
      readerId,
      setReader,
      setTerminalStatus,
      setTerminalLoading,
      user.id,
      user.store_id
    );
  };

  // const createTerminalPayment = async (currentReader: Reader, finalAmount: number, receiptId: string) => {
  //   const storePaymentContext = async (paymentIntentId: string, finalAmount: number) => {
  //     return await storeTerminalPaymentContext(
  //       paymentIntentId,
  //       finalAmount,
  //       customerData,
  //       items,
  //       total,
  //       discount,
  //       user.id,
  //       user.store_id,
  //       pendingReceiptId || '',
  //     );
  //   };

  //   return await createTerminalPaymentUtil(
  //     currentReader,
  //     finalAmount,
  //     setPaymentIntent,
  //     setTerminalStatus,
  //     setTerminalLoading,
  //     storePaymentContext
  //   );
  // };

  const createTerminalPayment = async (
    currentReader: Reader,
    finalAmount: number,
    receiptId: string
  ) => {
    const storePaymentContext = async (
      paymentIntentId: string,
      finalAmount: number
    ) => {
      return await storeTerminalPaymentContext(
        paymentIntentId,
        finalAmount,
        customerData,
        items,
        total,
        discount,
        user.id,
        user.store_id,
        receiptId
      );
    };

    return await createTerminalPaymentUtil(
      currentReader,
      finalAmount,
      setPaymentIntent,
      setTerminalStatus,
      setTerminalLoading,
      storePaymentContext
    );
  };

  const processTerminalPayment = async (
    currentReader: Reader,
    currentPaymentIntentId: string
  ) => {
    return await processTerminalPaymentUtil(
      currentReader,
      currentPaymentIntentId,
      setTerminalLoading,
      setTerminalStatus,
      setWaitingForTerminal,
      setShowTerminalOptions,
      setIsProcessing,
      startPollingForPaymentStatus
    );
  };

  // Add a polling function to check payment status
  const startPollingForPaymentStatus = async (paymentIntentId: string) => {
    // Check payment status every 3 seconds
    const intervalId = setInterval(async () => {
      try {
        const { data: context } = await supabase
          .from("terminal_payment_context")
          .select("status")
          .eq("payment_intent_id", paymentIntentId)
          .single();

        if (context?.status === "processed") {
          // Payment was successfully processed
          clearInterval(intervalId);
          handleTerminalPaymentCompletion(true);
        } else if (context?.status === "failed") {
          // Payment failed
          clearInterval(intervalId);
          handleTerminalPaymentCompletion(false);
        }
        // Otherwise keep polling
      } catch (error) {
        console.error("Error polling for payment status:", error);
      }
    }, 3000);

    // Stop polling after 2 minutes (timeout)
    setTimeout(() => {
      clearInterval(intervalId);
      // If we're still waiting, show a message
      if (waitingForTerminal) {
        setWaitingForTerminal(false);
        toast.error(
          "Payment processing timed out. Please check your dashboard."
        );
        setIsProcessing(false);
      }
    }, 120000);
  };

  // Function to handle terminal payment completion
  const handleTerminalPaymentCompletion = async (success: boolean) => {
    setWaitingForTerminal(false);

    if (success) {
      // Get the payment intent ID from the context store instead of state
      const { data: context } = await supabase
        .from("terminal_payment_context")
        .select("payment_intent_id")
        .eq("status", "processed")
        .order("processed_at", { ascending: false })
        .limit(1)
        .single();

      const processedPaymentIntentId = context?.payment_intent_id;

      if (processedPaymentIntentId) {
        toast.success("Payment successful via Stripe Terminal");

        // Fetch the sale record to show the receipt
        const { data: payment } = await supabase
          .from("payments")
          .select("order_id")
          .eq("payment_id", processedPaymentIntentId)
          .single();

        if (payment?.order_id) {
          const { data: sale } = await supabase
            .from("sales")
            .select("*")
            .eq("id", payment.order_id)
            .single();

          if (sale) {
            // Get the sale items to show receipt
            const { data: saleItems } = await supabase
              .from("sale_items")
              .select(
                `
                id,
                quantity,
                price,
                item:items(
                  id,
                  title,
                  images:item_images(image_url)
                )
              `
              )
              .eq("sale_id", sale.id);
            console.log(
              "🚀 ~ handleTerminalPaymentCompletion ~ saleItems:",
              saleItems
            );

            // Format the items for the receipt
            const receiptItems = saleItems?.map((item: any) => ({
              id: item.item.id,
              title: item.item.title,
              price: item.price,
              quantity: item.quantity,
              image_url: item.item.images?.[0]?.image_url || "/placeholder.svg",
            }));

            // Show the receipt
            setReceiptData({
              saleData: sale,
              items: receiptItems ?? [],
              discount: sale.discount_type
                ? {
                    type: sale.discount_type as "percentage" | "fixed",
                    value: Number(sale.discount_value),
                    savingsAmount:
                      Number(sale.original_amount) - Number(sale.total_amount),
                  }
                : undefined,
            });

            setShowReceipt(true);
          }
        }

        // Clear cart and reset amount
        clearCart();
        setAmount("0.00");
      } else {
        console.error("No processed payment intent found");
        toast.error("Couldn't find payment details");
      }
    } else {
      toast.error("Terminal payment failed");
    }

    // Reset states
    setPaymentIntent(null);
    setTerminalStatus("Reader Ready");
    setIsProcessing(false);
    setTerminalLoading(false);
    setShowTerminalOptions(false);
  };

  // Validate and update item quantity
  const validateAndUpdateQuantity = async (
    itemId: string,
    newQuantity: number
  ) => {
    // Optimistically update the UI immediately.
    updateQuantity(itemId, newQuantity);

    try {
      // Validate stock in the background.
      const { data: currentItem, error } = await supabase
        .from("items")
        .select("quantity")
        .eq("id", itemId)
        .single();

      if (error) throw error;
      if (!currentItem) {
        toast.error("Item not found");
        // Optionally, revert the optimistic update if needed.
        return;
      }

      if (newQuantity > currentItem.quantity) {
        // Only show the error if it hasn't been shown already
        toast.error(
          `Only ${currentItem.quantity} items available in stock`,
          { id: "stock-error" } // using a unique id
        );
        updateQuantity(itemId, currentItem.quantity);
        return;
      }
      // If validation passes, no further action is needed.
    } catch (error) {
      toast.error("Failed to validate stock quantity");
      // Optionally revert the optimistic update here as well.
    }
  };

  // Refund utility wrapper functions
  const searchSale = async () => {
    await searchSaleUtil(searchSaleId, setSelectedSale, setRefundItems);
  };

  const updateRefundQuantity = (itemId: string, quantity: number) => {
    updateRefundQuantityUtil(itemId, quantity, refundItems, setRefundItems);
  };

  const calculateRefundTotal = () => {
    return calculateRefundTotalUtil(refundItems);
  };

  const processRefund = async () => {
    // Prevent multiple refund processes from starting
    if (isProcessRefund) return;

    setIsProcessRefund(true); // Indicate that processing has started
    try {
      const resetRefundState = () => {
        setShowRefundModal(false);
        setSelectedSale(null);
        setRefundItems([]);
        setRefundReason("");
        setSearchSaleId("");
      };

      await processRefundUtil(
        selectedSale,
        refundItems,
        refundReason,
        user.store_id,
        user.id,
        calculateRefundTotal,
        setRefundReceiptData,
        setShowRefundReceipt,
        resetRefundState
      );
    } catch (error) {
      console.error("Refund processing error:", error);
      toast.error("Failed to process refund");
    } finally {
      setIsProcessRefund(false);
    }
  };
  // Helper for final total calculation
  const calculateFinalTotalWithDiscount = () => {
    return calculateFinalTotal(total, discount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Point of Sale
      </h1>

      {reader && (
        <div className="mb-4 flex items-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1 flex items-center">
            <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">
              Reader: {reader.label || reader.id} ({reader.status})
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-6 w-6 p-0"
              onClick={() => setShowReaderManager(true)}
            >
              <span className="sr-only">Manage Reader</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Add a Configure Reader button if no reader is set */}
      {!reader && (
        <div className="mb-4">
          <Button
            onClick={() => setShowReaderManager(true)}
            variant="outline"
            className="flex items-center"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Configure Card Reader
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Section */}
        <CartSection
          items={items}
          isloading={isLoading}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          total={total}
          clearCart={clearCart}
          validateAndUpdateQuantity={validateAndUpdateQuantity}
          setShowDiscountModal={setShowDiscountModal}
          discount={discount}
          calculateFinalTotal={calculateFinalTotalWithDiscount}
        />

        {/* Payment Section */}
        <PaymentSection
          amount={amount}
          setAmount={setAmount}
          change={change}
          isProcessing={isProcessing}
          paymentMethod={paymentMethod}
          items={items}
          handlePayment={handlePayment}
          handleNumberClick={handleNumberClick}
          handleClear={handleClear}
          handleDecimal={handleDecimal}
        />
      </div>

      <div className="mt-8 flex gap-4">
        <Button
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg"
          onClick={handleCompleteSale}
          disabled={isProcessing || items.length === 0}
        >
          {isProcessing && paymentMethod === "cash" ? (
            <span>Processing...</span>
          ) : (
            "Complete Sale"
          )}
        </Button>
        <Button
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg"
          onClick={handleProcessRefund}
          disabled={isProcessing}
        >
          <RotateCcw className="mr-2 h-5 w-5" />
          Process Refund
        </Button>
      </div>

      {/* Modals and Overlays */}
      {showCustomerForm && (
        <CustomerForm
          customerData={customerData}
          setCustomerData={setCustomerData}
          handleCustomerSubmit={handleCustomerSubmit}
          setShowCustomerForm={setShowCustomerForm}
        />
      )}

      {showPaymentOptions && (
        <PaymentOptionsModal
          posSettings={posSettings}
          handlePayment={handlePayment}
          setShowPaymentOptions={setShowPaymentOptions}
        />
      )}

      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-[#191e25] bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-scroll">
          <Receipt
            saleData={{
              id: receiptData.saleData.id || "",
              created_at: receiptData.saleData.created_at || "",
              total_amount: receiptData.saleData.total_amount || 0,
              payment_method: receiptData.saleData.payment_method || "",
              amount_tendered: receiptData.saleData.amount_tendered || 0,
              change_amount: receiptData.saleData.change_amount || 0,
              receipt_id: receiptData.saleData.receipt_id || "",
            }}
            items={receiptData.items || []}
            userId={user?.id || ""}
            receiptLogo={posSettings.receiptLogo}
            receiptMessage={posSettings.receiptMessage}
            discount={receiptData.discount}
            onClose={() => {
              setShowReceipt(false);
              setIsProcessing(false);
            }}
          />
        </div>
      )}

      {showRefundReceipt && refundReceiptData && (
        <div className="fixed inset-0 bg-[#191e25] bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-scroll">
          <RefundReceipt
            refundData={refundReceiptData.saleData}
            items={refundReceiptData.items}
            storeLogo={posSettings.receiptLogo}
            storeMessage={posSettings.receiptMessage}
            onClose={() => {
              setShowRefundReceipt(false);
              setIsProcessing(false);
            }}
          />
        </div>
      )}

      {showRefundModal && (
        <RefundModal
          showRefundModal={showRefundModal}
          selectedSale={selectedSale}
          refundItems={refundItems}
          refundReason={refundReason}
          searchSaleId={searchSaleId}
          setShowRefundModal={setShowRefundModal}
          setSelectedSale={setSelectedSale}
          setRefundItems={setRefundItems}
          setRefundReason={setRefundReason}
          setSearchSaleId={setSearchSaleId}
          searchSale={searchSale}
          updateRefundQuantity={updateRefundQuantity}
          calculateRefundTotal={calculateRefundTotal}
          processRefund={processRefund}
          formatCurrency={formatCurrency}
          isProcessing={isProcessing}
          isProcessRefund={isProcessRefund}
        />
      )}

      {showReaderManager && (
        <ReaderManager
          reader={reader}
          availableReaders={availableReaders}
          terminalLoading={terminalLoading}
          terminalStatus={terminalStatus}
          discoverReaders={discoverReaders}
          selectReader={selectReader}
          setShowReaderManager={setShowReaderManager}
        />
      )}

      {showDiscountModal && (
        <DiscountModal
          discount={discount}
          setDiscount={setDiscount}
          setShowDiscountModal={setShowDiscountModal}
          total={total}
          calculateFinalTotal={calculateFinalTotalWithDiscount}
        />
      )}

      {(terminalLoading || showTerminalOptions) && (
        <TerminalStatus
          terminalStatus={terminalStatus}
          terminalLoading={terminalLoading}
          showTerminalOptions={showTerminalOptions}
          setShowTerminalOptions={setShowTerminalOptions}
          setIsProcessing={setIsProcessing}
        />
      )}

      {waitingForTerminal && (
        <TerminalWaiting
          setWaitingForTerminal={setWaitingForTerminal}
          setIsProcessing={setIsProcessing}
          setTerminalStatus={setTerminalStatus}
        />
      )}
    </div>
  );
}
