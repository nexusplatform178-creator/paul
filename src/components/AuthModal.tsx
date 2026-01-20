import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, Loader2, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import nlgrbLogo from "@/assets/nlgrb-logo.png";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

const AuthModal = ({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) => {
  const { login, register, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Login fields
  const [loginPhone, setLoginPhone] = useState("");
  
  // Register fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isOver25, setIsOver25] = useState(false);
  
  // Forgot password
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (activeTab === "login") {
        await login(loginPhone, password);
        onClose();
        resetForm();
      } else {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (!isOver25) {
          throw new Error("You must confirm you are 25 years or older");
        }
        await register(email, password, fullName, phone);
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await resetPassword(resetEmail);
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setPhone("");
    setLoginPhone("");
    setIsOver25(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setResetEmail("");
    setShowForgotPassword(false);
  };

  const switchTab = (tab: "login" | "register") => {
    setActiveTab(tab);
    resetForm();
  };

  if (showForgotPassword) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-sm p-0 gap-0 bg-card border-border overflow-hidden">
          <div className="bg-secondary/50 p-3 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <img src={nlgrbLogo} alt="NLGRB" className="h-8 w-auto" />
              <div>
                <h2 className="text-foreground font-bold text-base">mollybet</h2>
                <p className="text-muted-foreground text-xxs">Licensed & Regulated</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="p-4">
            <h3 className="text-foreground font-semibold text-sm mb-1">Reset Password</h3>
            <p className="text-muted-foreground text-xs mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="resetEmail" className="text-xs text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <button 
                type="button" 
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-center text-xs text-primary hover:underline"
              >
                Back to Login
              </button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-sm p-0 gap-0 bg-card border-border overflow-hidden">
        <div className="bg-secondary/50 p-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <img src={nlgrbLogo} alt="NLGRB" className="h-8 w-auto" />
            <div>
              <h2 className="text-foreground font-bold text-base">mollybet</h2>
              <p className="text-muted-foreground text-xxs">Licensed & Regulated</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-full transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex border-b border-border">
          <button
            onClick={() => switchTab("login")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "login" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            LOGIN
            {activeTab === "login" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button
            onClick={() => switchTab("register")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "register" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            REGISTER
            {activeTab === "register" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {activeTab === "login" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="loginPhone" className="text-xs text-muted-foreground">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+256</span>
                  <Input
                    id="loginPhone"
                    type="tel"
                    placeholder="700 000 000"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    className="pl-14 bg-secondary border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-secondary border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs text-muted-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs text-muted-foreground">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+256</span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    className="pl-14 bg-secondary border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-muted-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-secondary border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs text-muted-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-secondary border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <Checkbox
                  id="ageConfirm"
                  checked={isOver25}
                  onCheckedChange={(checked) => setIsOver25(checked === true)}
                  className="mt-0.5"
                />
                <Label htmlFor="ageConfirm" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                  I confirm that I am 25 years of age or older and agree to the terms and conditions.
                </Label>
              </div>
            </>
          )}

          <Button 
            type="submit" 
            disabled={isLoading || (activeTab === "register" && !isOver25)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{activeTab === "login" ? "Logging in..." : "Creating..."}</>
            ) : (
              activeTab === "login" ? "LOGIN" : "CREATE ACCOUNT"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {activeTab === "login" ? (
              <>Don't have an account? <button type="button" onClick={() => switchTab("register")} className="text-primary hover:underline">Register</button></>
            ) : (
              <>Already have an account? <button type="button" onClick={() => switchTab("login")} className="text-primary hover:underline">Login</button></>
            )}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;