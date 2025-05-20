import { Reader } from "../../components/pos/types";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

// Check reader status
export const checkReaderStatus = async (currentReader: Reader) => {
  try {
    const response = await fetch("/api/reader-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readerId: currentReader.id }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { 
        ready: false, 
        message: error.error || `Reader connection issue (${response.status})` 
      };
    }
    
    const data = await response.json();
    
    if (data.reader.status === "online") {
      return { ready: true, message: "Reader is online" };
    } else {
      return { 
        ready: false, 
        message: `Reader is ${data.reader.status}. Please reconnect.` 
      };
    }
  } catch (error) {
    console.error("Error checking reader status:", error);
    return { 
      ready: false, 
      message: error instanceof Error ? error.message : "Unknown reader error" 
    };
  }
};

// Discover available readers
export const discoverReaders = async (
  setAvailableReaders: (readers: Reader[]) => void,
  setTerminalStatus: (status: string) => void,
  setTerminalLoading: (loading: boolean) => void
) => {
  try {
    setTerminalLoading(true);
    setTerminalStatus("Discovering readers...");
    
    const response = await fetch("/api/discover-readers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.readers && Array.isArray(data.readers)) {
      setAvailableReaders(data.readers);
      setTerminalStatus(`Found ${data.readers.length} readers`);
      toast.success(`Found ${data.readers.length} card readers`);
      return data.readers;
    } else {
      throw new Error("Invalid reader discovery response");
    }
  } catch (error) {
    console.error("Reader discovery error:", error);
    setTerminalStatus(`Discovery Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    toast.error("Failed to discover readers");
    return [];
  } finally {
    setTerminalLoading(false);
  }
};

// Select and connect to a reader
export const selectReader = async (
  readerId: string,
  setReader: (reader: Reader) => void,
  setTerminalStatus: (status: string) => void,
  setTerminalLoading: (loading: boolean) => void,
  userId: string, 
  storeId: string
) => {
  try {
    setTerminalLoading(true);
    setTerminalStatus("Connecting to reader...");
    
    const response = await fetch("/api/connect-reader", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ readerId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.reader) {
      // Save the reader in both state and local storage
      setReader(data.reader);
      localStorage.setItem('pos_active_reader', JSON.stringify(data.reader));
      
      // Also save to database if logged in
      if (storeId) {
        // First, clear any previously active readers
        await supabase
          .from('terminal_readers')
          .update({ is_active: false })
          .eq('store_id', storeId);
          
        // Then save this reader as active
        await supabase.from('terminal_readers').upsert({
          id: data.reader.id,
          label: data.reader.label,
          device_type: data.reader.device_type,
          status: data.reader.status,
          store_id: storeId,
          is_active: true,
          last_connected: new Date().toISOString()
        });
      }
      
      setTerminalStatus(`Connected to reader: ${data.reader.label || data.reader.id}`);
      toast.success(`Connected to ${data.reader.label || data.reader.id}`);
      return true;
    } else {
      throw new Error("Invalid reader connection response");
    }
  } catch (error) {
    console.error("Reader connection error:", error);
    setTerminalStatus(`Connection Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    toast.error("Failed to connect to reader");
    return false;
  } finally {
    setTerminalLoading(false);
  }
};

// Create Payment Intent for Terminal
export const createTerminalPayment = async (
  currentReader: Reader,
  finalAmount: number,
  setPaymentIntent: (id: string | null) => void,
  setTerminalStatus: (status: string) => void,
  setTerminalLoading: (loading: boolean) => void,
  storeTerminalPaymentContext: Function
) => {
  if (!currentReader) {
    toast.error("No reader configured");
    return { success: false, paymentIntentId: null };
  }

  setTerminalLoading(true);
  setTerminalStatus("Creating Payment...");

  try {
    const response = await fetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(finalAmount * 100) }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    const data = await response.json();

    if (data.clientSecret && data.paymentIntentId) {
      // Update state for future use
      setPaymentIntent(data.paymentIntentId);
      setTerminalStatus("Payment Created - Ready to Process");
      toast.success("Payment ready to process on terminal");

      // Store payment context
      await storeTerminalPaymentContext(data.paymentIntentId, finalAmount);

      return { success: true, paymentIntentId: data.paymentIntentId };
    } else {
      throw new Error("Invalid payment intent response");
    }
  } catch (error: any) {
    console.error("Payment creation error:", error);
    setTerminalStatus(`Payment Error: ${error.message}`);
    toast.error(`Payment creation error: ${error.message}`);
    return { success: false, paymentIntentId: null };
  } finally {
    setTerminalLoading(false);
  }
};

// Process Payment on Terminal
export const processTerminalPayment = async (
  currentReader: Reader,
  currentPaymentIntentId: string,
  setTerminalLoading: (loading: boolean) => void,
  setTerminalStatus: (status: string) => void,
  setWaitingForTerminal: (waiting: boolean) => void,
  setShowTerminalOptions: (show: boolean) => void,
  setIsProcessing: (processing: boolean) => void,
  startPollingForPaymentStatus: (paymentIntentId: string) => void
) => {
  if (!currentReader || !currentPaymentIntentId) {
    setTerminalStatus("Reader or payment intent not available");
    toast.error("Reader or payment intent not available");
    return false;
  }

  setTerminalLoading(true);
  setTerminalStatus("Processing Payment...");

  try {
    const response = await fetch("/api/process-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        readerId: currentReader.id,
        paymentIntentId: currentPaymentIntentId,
      }),
    });

    // Parse the response
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || `HTTP error ${response.status}`);
    }

    // Process payment request was successful
    setTerminalStatus("Present Card on Reader...");
    toast.success(
      "Present card on reader. Payment will be processed automatically."
    );

    // Start waiting for webhook response
    setWaitingForTerminal(true);
    startPollingForPaymentStatus(currentPaymentIntentId);

    // Set up UI
    setShowTerminalOptions(true);

    return true;
  } catch (error: any) {
    console.error("Payment processing error:", error);
    setTerminalStatus(`Processing Error: ${error.message}`);
    toast.error(`Processing error: ${error.message}`);
    setIsProcessing(false);

    // Handle intent_invalid_state error
    if (error.message && error.message.includes("intent_invalid_state")) {
      toast.error(
        "The payment intent is in the wrong state. Please try again."
      );
      setTerminalStatus("Payment needs to be restarted. Please try again.");
    }

    return false;
  } finally {
    setTerminalLoading(false);
  }
}; 