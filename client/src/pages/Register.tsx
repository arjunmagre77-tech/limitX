import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Gamepad2, Lock, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !displayName || isLoading) return;

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/register", {
        username,
        displayName,
        password,
      });
      toast({
        title: "Account Created! 🎉",
        description: "Welcome to Limitless Social Network! +50 LP Bonus granted.",
      });
      setLocation("/feed");
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.message || "Username may be taken.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-panel border border-primary/40 p-8 relative overflow-hidden">
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="font-display font-bold text-2xl tracking-widest text-white glitch-effect" data-text="LIMITLESS">LIMITLESS</span>
            </a>
          </Link>
          <h2 className="text-xl font-display font-bold text-white uppercase mt-2">Join Limitless Social</h2>
          <p className="text-xs text-gray-400 font-sans mt-1">Claim your gamer tag and join the esports community feed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-display text-gray-300 uppercase mb-1">Gamer Handle (@username)</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. pro_fragger"
                required
                className="w-full bg-white/5 border border-white/10 pl-10 pr-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-display text-gray-300 uppercase mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex 'Viper' Chen"
              required
              className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-display text-gray-300 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose password"
                required
                className="w-full bg-white/5 border border-white/10 pl-10 pr-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-black font-display font-bold uppercase tracking-widest text-sm py-3 hover:bg-white transition-colors flex items-center justify-center gap-2 neon-border mt-6"
          >
            {isLoading ? "Creating Account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center border-t border-white/10 pt-4 mt-6">
          <p className="text-xs text-gray-400 font-sans">
            Already have an account?{" "}
            <Link href="/login">
              <a className="text-primary font-display font-bold uppercase hover:underline">Log In</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
