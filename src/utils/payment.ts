export interface CheckoutSession {
  id: string;
  url: string;
}

export interface PaymentProvider {
  name: string;
  createCheckout(toolId: string, email: string, planType: 'featured_monthly' | 'featured_lifetime'): Promise<CheckoutSession>;
  verifyPayment(sessionId: string): Promise<boolean>;
  refundPayment(paymentId: string): Promise<boolean>;
}

export interface MockPendingPayment {
  sessionId: string;
  toolId: string;
  email: string;
  planType: 'featured_monthly' | 'featured_lifetime';
  verified: boolean;
  timestamp: string;
}

export class MockPaymentProvider implements PaymentProvider {
  name = 'MockPayment';

  async createCheckout(
    toolId: string, 
    email: string, 
    planType: 'featured_monthly' | 'featured_lifetime'
  ): Promise<CheckoutSession> {
    console.log(`[MockPayment] Creating checkout session for tool: ${toolId}, plan: ${planType}, email: ${email}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sessionId = `sess_${Math.random().toString(36).substring(2, 12)}`;
    
    // Return a checkout URL that redirects back to the admin page with query params indicating a mock checkout success
    const mockCheckoutUrl = `${window.location.origin}/admin?checkout_status=success&session_id=${sessionId}&tool_id=${toolId}&plan=${planType}`;
    
    // Cache the pending payment locally to verify it later
    const pendingPayments = JSON.parse(localStorage.getItem('neo_mock_pending_payments') || '[]');
    pendingPayments.push({
      sessionId,
      toolId,
      email,
      planType,
      verified: false,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('neo_mock_pending_payments', JSON.stringify(pendingPayments));

    return {
      id: sessionId,
      url: mockCheckoutUrl
    };
  }

  async verifyPayment(sessionId: string): Promise<boolean> {
    console.log(`[MockPayment] Verifying payment for session: ${sessionId}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    const pendingPayments = JSON.parse(localStorage.getItem('neo_mock_pending_payments') || '[]') as MockPendingPayment[];
    const index = pendingPayments.findIndex((p) => p.sessionId === sessionId);
    
    if (index !== -1) {
      pendingPayments[index].verified = true;
      localStorage.setItem('neo_mock_pending_payments', JSON.stringify(pendingPayments));
      
      // Also register this in our mock tool featured status
      const toolId = pendingPayments[index].toolId;
      const planType = pendingPayments[index].planType;
      
      // Lifetime gets no expiry date, monthly gets 30 days
      let expiryDate: string | null = null;
      if (planType === 'featured_monthly') {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        expiryDate = expiry.toISOString();
      }

      // Import database logic to update featured status
      const { updateToolFeaturedStatus } = await import('./firebase');
      await updateToolFeaturedStatus(toolId, true, expiryDate);

      return true;
    }

    return false;
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    console.log(`[MockPayment] Refunding payment: ${paymentId}`);
    await new Promise(resolve => setTimeout(resolve, 400));
    return true;
  }
}

// Export a default payment manager
export const getActivePaymentProvider = (): PaymentProvider => {
  // If in the future we configure stripe, we can do:
  // if (import.meta.env.VITE_PAYMENT_GATEWAY === 'stripe') return new StripePaymentProvider();
  return new MockPaymentProvider();
};
