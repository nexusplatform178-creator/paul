import { Shield, ArrowLeft, Lock, Smartphone, Eye, EyeOff, Key, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

const SecurityPage = () => {
  const { user, userProfile, resetPassword } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!user || !userProfile?.email) return;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(userProfile.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully",
      });
      
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      let message = "Failed to update password";
      if (error.code === "auth/wrong-password") {
        message = "Current password is incorrect";
      } else if (error.code === "auth/requires-recent-login") {
        message = "Please log out and log in again before changing your password";
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!userProfile?.email) return;
    
    try {
      await resetPassword(userProfile.email);
    } catch (error) {
      // Error handled in resetPassword
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please login to access security settings</p>
          <Link to="/" className="text-primary hover:underline">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />
      <MobileHeader />
      
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2 text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">Security</span>
        <div className="w-5" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          {/* Security Status Card */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Account Security</h3>
                <p className="text-xs text-muted-foreground">Manage your security settings</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground">Your account is secured with Firebase Authentication</span>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Password</span>
              </div>
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="text-xs text-primary hover:underline"
              >
                {showChangePassword ? "Cancel" : "Change"}
              </button>
            </div>
            
            {showChangePassword ? (
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            ) : (
              <div className="p-4">
                <p className="text-sm text-muted-foreground">••••••••••</p>
                <p className="text-xs text-muted-foreground mt-1">Last changed: Never</p>
              </div>
            )}
          </div>

          {/* Reset Password */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Key className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Forgot Password?</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              We'll send a password reset link to your email: {userProfile?.email}
            </p>
            <button
              onClick={handleResetPassword}
              className="w-full bg-secondary text-foreground py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              Send Reset Link
            </button>
          </div>

          {/* Two-Factor Auth */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Two-Factor Authentication</span>
              </div>
              <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">Coming Soon</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Add an extra layer of security to your account with SMS verification.
            </p>
          </div>

          {/* Login Activity */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-foreground">Recent Login Activity</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="text-sm text-foreground">Current Session</p>
                  <p className="text-xs text-muted-foreground">Chrome on Windows</p>
                </div>
                <span className="text-xs text-primary">Active</span>
              </div>
              <p className="text-xs text-muted-foreground text-center py-2">
                No other recent login activity
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-14 md:hidden flex-shrink-0"></div>
      <MobileBottomNav />
    </div>
  );
};

export default SecurityPage;