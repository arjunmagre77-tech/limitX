import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SocialLayout } from "@/components/social/SocialLayout";
import { Message, User } from "@shared/schema";
import { MessageSquare, Send, User as UserIcon, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { VerificationBadge } from "@/components/social/VerificationBadge";

export default function Messages() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inputContent, setInputContent] = useState("");

  const { data: exploreData } = useQuery<{ suggestedUsers: User[] }>({
    queryKey: ["/api/explore"],
  });

  const activeUser = selectedUser || exploreData?.suggestedUsers[0] || null;

  const { data: messages = [], refetch } = useQuery<Message[]>({
    queryKey: ["/api/messages", activeUser?.id],
    queryFn: async () => {
      if (!activeUser) return [];
      const res = await fetch(`/api/messages?with=${activeUser.id}`);
      return res.json();
    },
    enabled: !!activeUser,
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || !activeUser) return;

    try {
      await apiRequest("POST", "/api/messages", {
        receiverId: activeUser.id,
        content: inputContent.trim(),
      });
      setInputContent("");
      refetch();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <SocialLayout hideSidebar={true}>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-black text-white uppercase flex items-center gap-2">
          DIRECT <span className="text-primary">MESSAGES</span>
        </h1>
      </div>

      <div className="glass-panel border border-white/10 grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
        {/* Left Conversation List */}
        <div className="border-r border-white/10 p-3 space-y-2">
          <h3 className="text-xs font-display text-gray-400 uppercase tracking-widest px-2 mb-2">Conversations</h3>
          {exploreData?.suggestedUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-sm text-left transition-colors ${
                activeUser?.id === user.id ? "bg-primary/20 border-l-2 border-primary" : "hover:bg-white/5"
              }`}
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`}
                alt={user.displayName}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="min-w-0 flex-grow">
                <h4 className="font-display font-bold text-xs text-white truncate flex items-center">
                  {user.displayName}
                  <VerificationBadge type={user.verificationType} />
                </h4>
                <p className="text-[10px] text-gray-400 font-sans truncate">@{user.username}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Right Active Chat Box */}
        <div className="md:col-span-2 flex flex-col justify-between p-4 bg-black/40">
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-4">
                <img
                  src={activeUser.avatar!}
                  alt={activeUser.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-primary"
                />
                <div>
                  <h3 className="font-display font-bold text-sm text-white flex items-center">
                    {activeUser.displayName}
                    <VerificationBadge type={activeUser.verificationType} />
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans">@{activeUser.username}</p>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-grow space-y-3 overflow-y-auto mb-4 p-2 max-h-80">
                {messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMe = msg.senderId === "user-guest";
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs p-3 text-xs font-sans rounded-sm ${
                            isMe
                              ? 'bg-primary/20 border border-primary/40 text-white'
                              : 'bg-white/10 border border-white/10 text-gray-200'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-xs text-gray-500 font-sans py-10">Start a private discussion with @{activeUser.username}.</p>
                )}
              </div>

              {/* Input Bar */}
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder={`Message @${activeUser.username}...`}
                  className="flex-grow bg-white/5 border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!inputContent.trim()}
                  className="bg-primary text-black font-display font-bold px-4 py-2 uppercase text-xs hover:bg-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-500">
              <MessageSquare className="w-8 h-8 mb-2" />
              <p className="text-xs font-display uppercase">Select a gamer to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </SocialLayout>
  );
}
