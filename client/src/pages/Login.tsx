import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Gamepad2, Lock, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || isLoading) return;

    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/login", { username, password });
      toast({
        title: "Welcome Back!",
        description: "Successfully logged in to Limitless Social.",
      });
      setLocation("/feed");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid credentials.",
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
          <h2 className="text-xl font-display font-bold text-white uppercase mt-2">Log In to Limitless Social</h2>
          <p className="text-xs text-gray-400 font-sans mt-1">Connect with fraggers, organizations, and tournament circuits.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-display text-gray-300 uppercase mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full bg-white/5 border border-white/10 pl-10 pr-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-display text-gray-300 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
            {isLoading ? "Logging in..." : "Enter Social Feed"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center border-t border-white/10 pt-4 mt-6">
          <p className="text-xs text-gray-400 font-sans">
            Don't have an account?{" "}
            <Link href="/register">
              <a className="text-primary font-display font-bold uppercase hover:underline">Register Now</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
