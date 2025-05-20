import { CustomerData } from "../../components/pos/types";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const processCustomerData = async (
  customerData: CustomerData,
  userId: string,
  storeId: string,
  finalTotal: number
) => {
  try {
    // Find existing customer
    let customerQuery = supabase
      .from("customers")
      .select("*")
      .eq("store_id", storeId);

    if (customerData.email) {
      customerQuery = customerQuery.eq("email", customerData.email);
    } else if (customerData.phone) {
      customerQuery = customerQuery.eq("phone", customerData.phone);
    }

    const { data: existingCustomer, error: customerSearchError } =
      await customerQuery.maybeSingle();

    let customerRecord;
    if (existingCustomer) {
      // Update existing customer
      const { data: updatedCustomer, error: updateError } = await supabase
        .from("customers")
        .update({
          name: customerData.name,
          last_purchase_date: new Date().toISOString(),
          total_purchases: (existingCustomer.total_purchases || 0) + 1,
          total_spent: (existingCustomer.total_spent || 0) + finalTotal,
        })
        .eq("id", existingCustomer.id)
        .select()
        .single();

      if (updateError) throw updateError;
      customerRecord = updatedCustomer;
    } else {
      // Create new customer
      const { data: newCustomer, error: createError } = await supabase
        .from("customers")
        .insert({
          name: customerData.name,
          email: customerData.email || null,
          phone: customerData.phone || null,
          store_id: storeId,
          last_purchase_date: new Date().toISOString(),
          total_purchases: 1,
          total_spent: finalTotal,
        })
        .select()
        .single();

      if (createError) throw createError;
      customerRecord = newCustomer;
    }

    return customerRecord;
  } catch (error) {
    console.error("Error processing customer data:", error);
    toast.error("Failed to process customer information");
    return null;
  }
};

export const validateCustomerData = (customerData: CustomerData) => {
  // Name validation
  if (!customerData.name.trim()) {
    toast.error("Customer name is required");
    return false;
  }

  // Phone validation - now required
  if (!customerData.phone?.trim()) {
    toast.error("Phone number is required");
    return false;
  }

  // Phone format validation
  if (!/^\+?[\d\s-]{10,}$/.test(customerData.phone)) {
    toast.error("Please enter a valid phone number");
    return false;
  }

  // Email format validation (if provided)
  if (
    customerData.email?.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)
  ) {
    toast.error("Please enter a valid email");
    return false;
  }

  return true;
}; 