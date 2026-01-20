import { useState, useCallback, useRef } from "react";
import { ref, set, get } from "firebase/database";
import { database } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

const LIVRA_API_BASE = "https://api.livrauganda.workers.dev/api";

interface PaymentResponse {
  success: boolean;
  status: string;
  message: string;
  internal_reference?: string;
  customer_reference?: string;
  msisdn?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  charge?: number;
  request_status?: string;
  remote_ip?: string;
  provider_transaction_id?: string;
  completed_at?: string;
}

interface StatusResponse {
  success: boolean;
  status: string;
  message: string;
  request_status: string;
  amount?: number;
}

export const useLivraPayment = (userId: string | null, currentBalance: number) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const updateBalance = useCallback(async (amount: number) => {
    if (!userId) return;
    const newBalance = currentBalance + amount;
    await set(ref(database, `users/${userId}/balance`), newBalance);
  }, [userId, currentBalance]);

  const validatePhone = async (msisdn: string): Promise<boolean> => {
    try {
      const formattedPhone = msisdn.startsWith('+256') ? msisdn : `+256${msisdn}`;
      const response = await fetch(`${LIVRA_API_BASE}/validate-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msisdn: formattedPhone })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Phone validation error:", error);
      return false;
    }
  };

  const pollPaymentStatus = useCallback(async (
    internalReference: string, 
    amount: number,
    type: 'deposit' | 'withdraw'
  ) => {
    let attempts = 0;
    const maxAttempts = 60;
    
    const poll = async () => {
      try {
        const response = await fetch(
          `${LIVRA_API_BASE}/request-status?internal_reference=${internalReference}`
        );
        const data: StatusResponse = await response.json();
        
        console.log("Payment status poll:", data);
        setPaymentStatus(data.request_status || data.status);
        
        if (data.request_status === "success" || data.status === "success") {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          setIsProcessing(false);
          
          if (type === 'deposit') {
            await updateBalance(amount);
            toast({
              title: "Deposit Successful!",
              description: `UGX ${amount.toLocaleString()} has been added to your balance.`,
            });
          } else {
            toast({
              title: "Withdrawal Successful!",
              description: `UGX ${amount.toLocaleString()} has been sent to your mobile money.`,
            });
          }
          return;
        }
        
        if (data.request_status === "failed" || data.status === "failed") {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          setIsProcessing(false);
          toast({
            title: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} Failed`,
            description: data.message || "Transaction was not completed.",
            variant: "destructive",
          });
          return;
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          setIsProcessing(false);
          toast({
            title: "Transaction Timeout",
            description: "Please check your transaction status in your mobile money app.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Status polling error:", error);
      }
    };

    pollingRef.current = setInterval(poll, 5000);
    poll();
  }, [updateBalance]);

  const deposit = async (msisdn: string, amount: number, description: string = "Deposit to MollyBet") => {
    setIsProcessing(true);
    setPaymentStatus("pending");
    
    try {
      const formattedPhone = msisdn.startsWith('+256') ? msisdn : `+256${msisdn}`;
      
      const response = await fetch(`${LIVRA_API_BASE}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msisdn: formattedPhone,
          amount,
          description
        })
      });
      
      const data: PaymentResponse = await response.json();
      console.log("Deposit response:", data);
      
      if (data.success && data.internal_reference) {
        toast({
          title: "Payment Initiated",
          description: "Please approve the payment on your phone.",
        });
        
        pollPaymentStatus(data.internal_reference, amount, 'deposit');
        return data;
      } else {
        setIsProcessing(false);
        toast({
          title: "Deposit Failed",
          description: data.message || "Unable to initiate deposit.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Deposit Error",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
      return null;
    }
  };

  const withdraw = async (msisdn: string, amount: number, description: string = "Withdrawal from MollyBet") => {
    setIsProcessing(true);
    setPaymentStatus("pending");
    
    try {
      const formattedPhone = msisdn.startsWith('+256') ? msisdn : `+256${msisdn}`;
      
      const response = await fetch(`${LIVRA_API_BASE}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msisdn: formattedPhone,
          amount,
          description
        })
      });
      
      const data: PaymentResponse = await response.json();
      console.log("Withdraw response:", data);
      
      if (data.success && data.internal_reference) {
        toast({
          title: "Withdrawal Initiated",
          description: "Processing your withdrawal...",
        });
        
        pollPaymentStatus(data.internal_reference, amount, 'withdraw');
        return data;
      } else {
        setIsProcessing(false);
        toast({
          title: "Withdrawal Failed",
          description: data.message || "Unable to initiate withdrawal.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast({
        title: "Withdrawal Error",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
      return null;
    }
  };

  const cancelPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setIsProcessing(false);
    setPaymentStatus(null);
  }, []);

  return {
    deposit,
    withdraw,
    validatePhone,
    isProcessing,
    paymentStatus,
    cancelPolling,
    updateBalance
  };
};
