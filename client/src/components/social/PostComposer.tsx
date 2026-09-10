import React, { useState } from "react";
import { Image, BarChart2, Trophy, Smile, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MatchResultData } from "@shared/schema";

interface PostComposerProps {
  onPostCreated?: () => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [matchData, setMatchData] = useState<MatchResultData>({
    tournamentName: "Limitless Community Cup",
    rank: "1st Place 🏆",
    kills: 12,
    booyahs: 1,
    prize: "$500",
  });

  const charLimit = 280;
  const remainingChars = charLimit - content.length;

  const handleAttachImage = () => {
    // Provide realistic esports gameplay screenshot options
    const sampleScreenshots = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80",
    ];
    const picked = sampleScreenshots[Math.floor(Math.random() * sampleScreenshots.length)];
    setMediaUrl(mediaUrl ? null : picked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.length > charLimit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/posts", {
        content: content.trim(),
        mediaUrls: mediaUrl ? [mediaUrl] : undefined,
        matchResult: showMatchForm ? matchData : undefined,
      });

      setContent("");
      setMediaUrl(null);
      setShowMatchForm(false);

      toast({
        title: "Post Published! 🎉",
        description: "+5 Limitless Points (LP) earned for sharing with the community!",
      });

      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      toast({
        title: "Failed to create post",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel border border-primary/30 p-4 mb-6 relative overflow-hidden">
      <div className="flex items-start gap-3">
        <img
          src="https://api.dicebear.com/7.x/bottts/svg?seed=challenger"
          alt="Avatar"
          className="w-10 h-10 rounded-full border border-primary/50 object-cover"
        />

        <form onSubmit={handleSubmit} className="flex-grow min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening in esports?"
            rows={3}
            className="w-full bg-transparent text-white font-sans placeholder-gray-500 border-none focus:outline-none focus:ring-0 resize-none text-base"
          />

          {/* Attached Image Preview */}
          {mediaUrl && (
            <div className="relative mt-2 rounded-sm overflow-hidden border border-white/20">
              <img src={mediaUrl} alt="Attached" className="w-full h-40 object-cover" />
              <button
                type="button"
                onClick={() => setMediaUrl(null)}
                className="absolute top-2 right-2 bg-black/80 text-white w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          )}

          {/* Match Result Form Toggle */}
          {showMatchForm && (
            <div className="my-3 glass-panel border border-primary/40 p-3 space-y-2 bg-black/60">
              <div className="flex justify-between items-center">
                <span className="text-xs font-display text-primary uppercase font-bold">Attach Match Scorecard</span>
                <button type="button" onClick={() => setShowMatchForm(false)} className="text-xs text-gray-400 hover:text-white">✕ Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  value={matchData.tournamentName}
                  onChange={e => setMatchData({ ...matchData, tournamentName: e.target.value })}
                  placeholder="Tournament Name"
                  className="bg-white/5 border border-white/10 p-1.5 text-white focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  value={matchData.rank}
                  onChange={e => setMatchData({ ...matchData, rank: e.target.value })}
                  placeholder="Rank (e.g. 1st Place)"
                  className="bg-white/5 border border-white/10 p-1.5 text-white focus:outline-none focus:border-primary"
                />
                <input
                  type="number"
                  value={matchData.kills}
                  onChange={e => setMatchData({ ...matchData, kills: parseInt(e.target.value) || 0 })}
                  placeholder="Kills"
                  className="bg-white/5 border border-white/10 p-1.5 text-white focus:outline-none focus:border-primary"
                />
                <input
                  type="number"
                  value={matchData.booyahs}
                  onChange={e => setMatchData({ ...matchData, booyahs: parseInt(e.target.value) || 0 })}
                  placeholder="Booyahs"
                  className="bg-white/5 border border-white/10 p-1.5 text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Composer Footer Actions */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleAttachImage}
                title="Attach Screenshot"
                className={`p-2 hover:bg-white/10 rounded-sm text-gray-400 hover:text-primary transition-colors ${mediaUrl ? 'text-primary' : ''}`}
              >
                <Image className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowMatchForm(!showMatchForm)}
                title="Attach Match Result"
                className={`p-2 hover:bg-white/10 rounded-sm text-gray-400 hover:text-primary transition-colors ${showMatchForm ? 'text-primary' : ''}`}
              >
                <Trophy className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setContent(prev => prev + " 🔥 #FreeFire")}
                title="Quick Hashtag"
                className="p-2 hover:bg-white/10 rounded-sm text-gray-400 hover:text-secondary transition-colors"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-display ${remainingChars < 20 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                {charLimit - remainingChars} / {charLimit}
              </span>

              <button
                type="submit"
                disabled={!content.trim() || content.length > charLimit || isSubmitting}
                className="bg-primary text-black font-display font-bold uppercase tracking-widest text-xs px-5 py-2 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 neon-border"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
