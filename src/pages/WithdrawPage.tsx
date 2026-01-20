import { useState } from "react";
import { ArrowLeft, Smartphone, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLivraPayment } from "@/hooks/useLivraPayment";
import { toast } from "@/hooks/use-toast";

const WithdrawPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { withdraw, isProcessing, paymentStatus, updateBalance } = useLivraPayment(
    user?.uid || null,
    userProfile?.balance || 0
  );
  
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(userProfile?.phone?.replace('+256', '') || "");

  const handleWithdraw = async () => {
    if (!amount || !phone || !userProfile) return;
    
    const numAmount = parseInt(amount);
    if (numAmount < 1000) {
      toast({
        title: "Minimum Withdrawal",
        description: "Minimum withdrawal is UGX 1,000",
        variant: "destructive",
      });
      return;
    }
    
    if (numAmount > userProfile.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }
    
    // Deduct balance first
    await updateBalance(-numAmount);
    
    const result = await withdraw(phone, numAmount);
    
    // If withdrawal failed, refund the balance
    if (!result) {
      await updateBalance(numAmount);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to withdraw funds</p>
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
          <span className="text-sm font-semibold text-foreground">Withdraw</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <div className="bg-card rounded-xl p-4 border border-border mb-6">
          <p className="text-xs text-muted-foreground">Available Balance</p>
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
                  {paymentStatus === "pending" ? "Processing Withdrawal..." : 
                   paymentStatus === "success" ? "Withdrawal Successful!" : 
                   "Status: " + paymentStatus}
                </p>
                <p className="text-xs text-muted-foreground">
                  {paymentStatus === "pending" ? "Please wait while we process your request" : ""}
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
            min={1000}
            max={userProfile?.balance || 0}
            disabled={isProcessing}
          />
          <p className="text-xxs text-muted-foreground">Minimum: UGX 1,000</p>
        </div>

        {userProfile && userProfile.balance >= 1000 && (
          <button
            onClick={() => setAmount(userProfile.balance.toString())}
            disabled={isProcessing}
            className="w-full bg-secondary hover:bg-secondary/80 border border-border rounded-lg py-2 text-sm font-medium text-foreground mb-6 disabled:opacity-50"
          >
            Withdraw All ({userProfile.balance.toLocaleString()} UGX)
          </button>
        )}

        <Button
          onClick={handleWithdraw}
          disabled={!amount || !phone || parseInt(amount) < 1000 || parseInt(amount) > (userProfile?.balance || 0) || isProcessing}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Withdraw UGX ${amount ? parseInt(amount).toLocaleString() : '0'}`
          )}
        </Button>

        <div className="mt-6 space-y-2 text-xs text-muted-foreground">
          <p>• Withdrawals are processed instantly to your mobile money</p>
          <p>• A small transaction fee may apply</p>
          <p>• Funds will be sent to the number above</p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
