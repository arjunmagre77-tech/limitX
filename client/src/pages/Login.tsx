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
        <div className="text-center mb-6">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="font-display font-bold text-2xl tracking-widest text-white glitch-effect" data-text="LIMITLESS">LIMITLESS</span>
            </a>
          </Link>
          <h2 className="text-xl font-display font-bold text-white uppercase mt-2">Log In to Limitless Social</h2>
          <p className="text-xs text-gray-400 font-sans mt-1">Connect with fraggers, organizations, and tournament circuits.</p>
        </div>

        <a
          href="/api/auth/google"
          className="w-full bg-white/10 hover:bg-white/20 text-white font-display font-bold uppercase tracking-wider text-xs py-3 px-4 transition-all flex items-center justify-center gap-3 border border-white/20 mb-6"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
            />
          </svg>
          Continue with Google
        </a>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-black/40 backdrop-blur-md px-3 text-[10px] uppercase font-display text-gray-400 absolute">OR LOGIN WITH USERNAME</span>
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
