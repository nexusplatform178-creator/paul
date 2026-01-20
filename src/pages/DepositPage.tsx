import { useState } from "react";
import { ArrowLeft, Smartphone, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLivraPayment } from "@/hooks/useLivraPayment";

const quickAmounts = [5000, 10000, 20000, 50000, 100000, 200000];

const DepositPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { deposit, isProcessing, paymentStatus } = useLivraPayment(
    user?.uid || null, 
    userProfile?.balance || 0
  );
  
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(userProfile?.phone?.replace('+256', '') || "");

  const handleDeposit = async () => {
    if (!amount || !phone) return;
    
    const numAmount = parseInt(amount);
    if (numAmount < 500) {
      return;
    }
    
    await deposit(phone, numAmount);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to deposit funds</p>
          <Link to="/" className="text-primary hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <span className="text-sm font-semibold text-foreground">Deposit</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <div className="bg-card rounded-xl p-4 border border-border mb-6">
          <p className="text-xs text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold text-foreground">
            UGX {(userProfile?.balance || 0).toLocaleString()}
          </p>
        </div>

        {isProcessing && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              {paymentStatus === "pending" ? (
                <Loader2 className="w-6 h-6 text-accent animate-spin" />
              ) : paymentStatus === "success" ? (
                <CheckCircle className="w-6 h-6 text-primary" />
              ) : (
                <AlertCircle className="w-6 h-6 text-destructive" />
              )}
              <div>
                <p className="font-medium text-foreground">
                  {paymentStatus === "pending" ? "Processing Payment..." : 
                   paymentStatus === "success" ? "Payment Successful!" : 
                   "Payment Status: " + paymentStatus}
                </p>
                <p className="text-xs text-muted-foreground">
                  {paymentStatus === "pending" ? "Please approve on your phone" : ""}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 mb-4">
          <Label className="text-xs text-muted-foreground">Mobile Money Number</Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+256</span>
            <Input
              type="tel"
              placeholder="700 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
              className="pl-20 bg-secondary border-border"
              disabled={isProcessing}
            />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <Label className="text-xs text-muted-foreground">Amount (UGX)</Label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-secondary border-border text-lg font-semibold"
            min={500}
            disabled={isProcessing}
          />
          <p className="text-xxs text-muted-foreground">Minimum: UGX 500</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt.toString())}
              disabled={isProcessing}
              className="bg-secondary hover:bg-secondary/80 border border-border rounded-lg py-2 text-sm font-medium text-foreground disabled:opacity-50"
            >
              {amt.toLocaleString()}
            </button>
          ))}
        </div>

        <Button
          onClick={handleDeposit}
          disabled={!amount || !phone || parseInt(amount) < 500 || isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Deposit UGX ${amount ? parseInt(amount).toLocaleString() : '0'}`
          )}
        </Button>

        <div className="mt-6 space-y-2 text-xs text-muted-foreground">
          <p>• Deposits are instant via MTN & Airtel Mobile Money</p>
          <p>• A small transaction fee may apply</p>
          <p>• Check your phone to approve the payment</p>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
