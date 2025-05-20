import { SaleItem, Discount } from "../../components/pos/types";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { processCustomerData } from "./customer-utils";

const supabase = createClient();

// Format currency for display
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
};

// Calculate final total after discount
export const calculateFinalTotal = (total: number, discount: Discount) => {
  if (discount.value === 0) return total;

  if (discount.type === "percentage") {
    return total - total * (discount.value / 100);
  } else {
    return Math.max(0, total - discount.value);
  }
};

// Process cash payment
export const processCashPayment = async (
  items: SaleItem[],
  amountTendered: number,
  finalTotal: number,
  originalAmount: number,
  customerRecord: any,
  discount: Discount,
  userId: string,
  storeId: string,
  customerData: any,
  receiptId: string
) => {
  try {
    const changeAmount = amountTendered - finalTotal;

    // Create sale data
    const saleData = {
      total_amount: finalTotal,
      original_amount: originalAmount,
      discount_type: discount.value > 0 ? discount.type : null,
      discount_value: discount.value > 0 ? discount.value : null,
      payment_method: "cash",
      status: "completed",
      payment_status: "paid",
      amount_tendered: amountTendered,
      change_amount: changeAmount,
      customer_id: customerRecord.id,
      store_id: storeId,
      receipt_id: receiptId,
    };

    // Create sale record
    const { data: saleRecord, error: saleError } = await supabase
      .from("sales")
      .insert(saleData)
      .select()
      .single();

    if (saleError) throw saleError;

    // Create sale items records
    const saleItems = items.map((item) => ({
      sale_id: saleRecord.id,
      item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: saleItemsError } = await supabase
      .from("sale_items")
      .insert(saleItems);

    if (saleItemsError) {
      await supabase.from("sales").delete().eq("id", saleRecord.id);
      throw saleItemsError;
    }

    await supabase
      .from("sales")
      .update({ inventory_updated: true })
      .eq("id", saleRecord.id);


      const shopifyUpdates = items
      .filter(item => item.shopify_product_id) // Only include items with Shopify ID
      .map(item => ({
        itemId: item.id,
        quantityDelta: -item.quantity,
        shopify_product_id: item.shopify_product_id
      }));


      
      if (shopifyUpdates.length > 0) {
        const shopifyResponse = await fetch('/api/shopify/update-inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storeId, updates: shopifyUpdates }),
        });

        if (!shopifyResponse.ok) {
          console.error('Failed to update Shopify inventory:', await shopifyResponse.json());
          toast.error('Sale recorded, but Shopify inventory update failed');
        }
      }

    // Create payment record
    const { error: paymentError } = await supabase.from("payments").insert({
      order_id: saleRecord.id,
      amount: finalTotal,
      status: "completed",
      customer_id: customerRecord.id,
      customer_data: customerData,
      items: items,
      store_id: storeId,
    });

    if (paymentError) {
      console.error("Error creating payment record:", paymentError);
    }

    return {
      success: true,
      saleRecord: { ...saleRecord, receipt_id: receiptId }, // Include receipt_id in the returned saleRecord
      items,
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    toast.error(error instanceof Error ? error.message : "Payment processing failed");
    return { success: false };
  }
};

// Store all information needed for webhook processing
export const storeTerminalPaymentContext = async (
  paymentIntentId: string,
  finalAmount: number,
  customerData: any,
  items: SaleItem[],
  total: number,
  discount: Discount,
  userId: string,
  storeId: string,
  receiptId: string
) => {
  try {
    // 1. Process customer first to get customer ID
    const customerRecord = await processCustomerData(customerData, userId, storeId, finalAmount);
    if (!customerRecord) {
      throw new Error("Failed to process customer data");
    }

    // Calculate important values
    const originalAmount = total;

    // 2. Store transaction context in terminal_payment_context table
    const paymentContext = {
      payment_intent_id: paymentIntentId,
      customer_id: customerRecord.id,
      customer_data: customerData,
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        title: item.title,
        image_url: item.image_url,
      })),
      original_amount: originalAmount,
      final_amount: finalAmount,
      discount_type: discount.value > 0 ? discount.type : null,
      discount_value: discount.value > 0 ? discount.value : null,
      store_id: storeId,
      created_at: new Date().toISOString(),
      status: "pending",
    };

    // Create a record in terminal_payment_context table
    const { error: contextError } = await supabase
      .from("terminal_payment_context")
      .insert(paymentContext);

    if (contextError) {
      console.error("Error storing payment context:", contextError);
      throw new Error("Failed to store payment context");
    }

    // Create a temporary sale record to get an order_id
    const { data: tempSale, error: tempSaleError } = await supabase
      .from("sales")
      .insert({
        total_amount: finalAmount,
        original_amount: originalAmount,
        discount_type: discount.value > 0 ? discount.type : null,
        discount_value: discount.value > 0 ? discount.value : null,
        payment_method: "card",
        status: "pending",
        payment_status: "pending",
        customer_id: customerRecord.id,
        store_id: storeId,
        payment_id: paymentIntentId,
        amount_tendered: finalAmount,
        change_amount: 0,
        receipt_id: receiptId
      })
      .select()
      .single();

    if (tempSaleError) {
      console.error("Error creating temporary sale:", tempSaleError);
      throw new Error("Failed to create temporary sale");
    }

    // Now create the payment record with the temporary sale ID
    const { error: paymentError } = await supabase.from("payments").insert({
      order_id: tempSale.id,
      payment_id: paymentIntentId,
      amount: finalAmount,
      status: "pending",
      customer_id: customerRecord.id,
      customer_data: customerData,
      items: items,
      store_id: storeId,
    });

    if (paymentError) {
      console.error("Error storing payment data:", paymentError);
      throw new Error("Failed to store payment data");
    }

    console.log("Successfully stored payment context for webhook processing");
    return true;
  } catch (error) {
    console.error("Error storing terminal payment context:", error);
    toast.error("Failed to prepare payment data");
    return false;
  }
}; 