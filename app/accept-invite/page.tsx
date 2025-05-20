'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import SignupForm from '@/components/SignupForm';

export default function AcceptInvitePage() {
  const [invitation, setInvitation] = useState(null);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ensure supabase instance is stable
  const supabase = useMemo(() => createClient(), []);
  const searchParams = useSearchParams();

  useEffect(() => {
    const validateInvitation = async () => {
      const token = searchParams?.get('token');
      const email = searchParams?.get('email');
      console.log('here is token', token, 'and here is email', email);
      if (!token || !email) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('token', token)
          .eq('email', email)
          .gte('expires_at', new Date().toISOString())
          .single();

        if (error || !data) throw new Error('Invalid or expired invitation');
        
        setInvitation(data);
        setValid(true);
      } catch (error) {
        console.error('Invitation validation failed:', error);
        setValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateInvitation();
  }, [searchParams, supabase]);

  if (loading) return <div>Loading...</div>;

  if (!valid) {
    return (
      <div>
        <h2>Invalid Invitation</h2>
        <p>This invitation link is either expired or invalid.</p>
      </div>
    );
  }

  return <SignupForm invitation={invitation!} />;
}
