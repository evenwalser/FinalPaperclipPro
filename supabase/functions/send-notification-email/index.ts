const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');

const handler = async (request: Request): Promise<Response> => {
  const payload = await request.json();
  if (payload.type === 'INSERT' && payload.table === 'notifications') {
    const notification = payload.record;
    if (notification.type === 'low_stock') {
      const metadata = notification.metadata;
      const userEmail = metadata.user_email;
      console.log("🚀 ~ handler ~ userEmail:", userEmail);
      const notificationChannels: string[] = metadata.notification_channels || [];
      const lowStockAlertEnabled = metadata.low_stock_alert_enabled;
      console.log("🚀 ~ handler ~ lowStockAlertEnabled:", lowStockAlertEnabled);
      if (lowStockAlertEnabled && notificationChannels.includes('email') && userEmail) {
        const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SENDGRID_API_KEY}`,
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [
                  {
                    email: userEmail,
                  },
                ],
              },
            ],
            from: {
              email: 'noreply@mydomain.com', // Replace with your verified sender email in SendGrid
            },
            subject: notification.subject,
            content: [
              {
                type: 'text/html',
                value: `<p>${notification.content}</p>`,
              },
            ],
          }),
        });

        if (!res.ok) {
          console.error('Failed to send email:', await res.text());
        }
      }
    }
  }
  return new Response('OK', { status: 200 });
};

Deno.serve(handler);