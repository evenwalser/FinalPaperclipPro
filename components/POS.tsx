"use client";

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// TypeScript interface for reader
interface Reader {
  id: string;
  object: string;
  device_type: string;
  label: string;
  status: string;
}

// TypeScript interface for transaction
interface Transaction {
  id: string;
  amount: number;
  status: string;
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

export default function POS() {
  const [amount, setAmount] = useState<number>(1000);
  const [reader, setReader] = useState<Reader | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Initialize Reader to Begin');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize Reader
  const initializeReader = async () => {
    setLoading(true);
    setStatus('Initializing Reader...');
    
    try {
      const response = await fetch('/api/create-reader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Reader response:", data);
      console.log("Reader data:", data.data.reader);

      
      if (data.data.reader) {
        setReader(data.data.reader);
        setStatus('Reader Ready');
      } else {
        throw new Error('No reader data received');
      }
    } catch (error: any) {
      console.error('Reader initialization error:', error);
      setStatus(`Reader Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Create Payment Intent
  const createPayment = async () => {
    if (!reader) {
      setStatus('Please initialize reader first');
      return;
    }
    
    setLoading(true);
    setStatus('Creating Payment...');
    
    try {
      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.clientSecret && data.paymentIntentId) {
        setPaymentIntent(data.paymentIntentId);
        setStatus('Payment Created - Ready to Process');
      } else {
        throw new Error('Invalid payment intent response');
      }
    } catch (error: any) {
      console.error('Payment creation error:', error);
      setStatus(`Payment Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Process Payment
  const processPayment = async () => {
    if (!reader || !paymentIntent) {
      setStatus('Reader or payment intent not ready');
      return;
    }
    
    setLoading(true);
    setStatus('Processing Payment...');
    
    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          readerId: reader.id,
          paymentIntentId: paymentIntent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setStatus('Present Card on Reader...');
      
      // Optional: Fetch updated transactions here
    } catch (error: any) {
      console.error('Payment processing error:', error);
      setStatus(`Processing Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pos-container">
      <h1>Next.js POS System</h1>
      
      <div className="control-panel">
        <button 
          onClick={initializeReader}
          className={reader ? 'success' : ''}
          disabled={loading}
        >
          {reader ? 'Reader Connected ✅' : 'Initialize Reader'}
        </button>
        <div className="amount-section">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
            placeholder="Amount in cents"
            min="100"
            step="100"
            disabled={loading}
          />
          <button 
            onClick={createPayment}
            // disabled={!reader || loading}
          >
            Create Payment
          </button>
        </div>
        <button 
          onClick={processPayment}
          disabled={!reader || !paymentIntent || loading}
          className="process-button"
        >
          Process Payment
        </button>
      </div>
      <div className="status-box">
        <h3>System Status</h3>
        <p>{status}</p>
        {loading && <p>Loading...</p>}
      </div>
      <div className="transactions">
        <h3>Recent Transactions</h3>
        <ul>
          {transactions.map((txn) => (
            <li key={txn.id} className={txn.status}>
              ${(txn.amount / 100).toFixed(2)} - {txn.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}