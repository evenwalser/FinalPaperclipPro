import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

type TransactionData = {
  type: string;
  status: string;
  reader_id: string;
  amount: number;
  payment_intent_id: string;
};


const supabase = createClient();

export const saveTransaction = async (transaction: TransactionData) => {
  try {
    // Ensure we're working with a plain object
    const plainTransaction = {
      type: transaction.type,
      status: transaction.status,
      reader_id: transaction.reader_id,
      amount: transaction.amount,
      payment_intent_id: transaction.payment_intent_id,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert(plainTransaction)
      .select();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

export const updateTransactionStatus = async (paymentIntentId : any, status : any, error = null) => {
  const updates: { 
    status: any; 
    updated_at: string;
    error?: any;
  } = {
    status,
    updated_at: new Date().toISOString()
  }

  if (error) updates.error = error

  const { data, error: updateError } = await supabase
    .from('transactions')
    .update(updates)
    .eq('payment_intent_id', paymentIntentId)
    .select()

  if (updateError) throw updateError
  return data[0]
}
