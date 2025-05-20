import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

// components/InviteForm.tsx
export function InviteForm({ storeId, storeName }: any) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const supabase = createClient();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('loading');
      
      try {
        const { error } = await supabase.functions.invoke('send-invite-email', {
          body: { email, store_id: storeId, store_name: storeName },
          headers:{
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcmF2dm54ZXh1dnhvZWhoZnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MDk5ODksImV4cCI6MjA0OTE4NTk4OX0.OWC0Bg0pzt3I1EMFMDXaxTJUrCwwlPBP_NjPbmqwuTQ'
            
          }
        });
  
        if (error) throw error;
        setStatus('success');
        setEmail('');
      } catch (error) {
        setStatus('error');
      } finally {
        setTimeout(() => setStatus('idle'), 3000);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter associate's email"
          required
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send Invite'}
        </button>
        
        {status === 'success' && <p>✓ Invitation sent</p>}
        {status === 'error' && <p>✗ Failed to send</p>}
      </form>
    );
  }