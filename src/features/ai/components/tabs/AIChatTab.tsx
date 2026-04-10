"use client";

import React, { useState, useEffect, useRef, startTransition } from "react";
import { useAIChat, useAIModels } from "../../hooks/useAI";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PaperPlaneTilt,
  User,
  Robot,
  Sparkle,
  CircleNotch,
  Lightning,
  Brain,
  Terminal,
} from "@phosphor-icons/react";
import { ChatMessage } from "../../types";
import { motion, AnimatePresence } from "motion/react";

interface AIChatTabProps {
  token: string;
  orgId: string;
}

export const AIChatTab: React.FC<AIChatTabProps> = ({ token, orgId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: modelsData } = useAIModels(
    token,
    orgId,
  );
  const chatMutation = useAIChat(token, orgId);

  useEffect(() => {
    const models = Array.isArray(modelsData)
      ? modelsData
      : (modelsData?.models ?? []);
    if (models.length > 0 && !selectedModel) {
      startTransition(() => setSelectedModel(models[0].id));
    }
  }, [modelsData, selectedModel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  const handleSend = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await chatMutation.mutateAsync({
        model_id: selectedModel || undefined,
        messages: newMessages,
      });

      setMessages([...newMessages, response.message]);
    } catch {
      // Error handled by hook toast
    }
  };

  return (
    <div className="flex flex-col h-[700px] max-w-5xl mx-auto rounded-[32px] bg-black/60 backdrop-blur-3xl border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.05)]">
      {/* Neural Console Header */}
      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <Brain className="text-cyan-400" size={24} weight="duotone" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border-2 border-cyan-500/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Neural Console
            </h3>
            <p className="text-[10px] font-bold text-gray-500 font-mono tracking-[0.2em] uppercase">
              Inference Engine: Operational
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <Lightning size={14} className="text-amber-400" weight="fill" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Low Latency Mode
            </span>
          </div>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-56 bg-black/40 border-white/10 h-11 rounded-xl text-white font-medium">
              <SelectValue placeholder="Neural Model" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
              {(Array.isArray(modelsData)
                ? modelsData
                : (modelsData?.models ?? [])
              ).map((m) => (
                <SelectItem
                  key={m.id}
                  value={m.id}
                  className="focus:bg-cyan-500/10 focus:text-cyan-400"
                >
                  {m.name}{" "}
                  <span className="opacity-40 text-[10px] ml-1 uppercase">
                    {m.provider}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message Stream */}
      <div
        className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth"
        ref={scrollRef}
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="p-8 rounded-full bg-cyan-500/[0.03] border border-cyan-500/10">
                <Sparkle
                  size={64}
                  className="text-cyan-400/40 animate-pulse"
                  weight="fill"
                />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-white/90">
                  Awaiting Neural Input
                </p>
                <p className="text-gray-500 text-sm max-w-sm font-light">
                  Query the CELAEST grid. All communications are vault-encrypted
                  and context-aware.
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-6 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500 ${
                  msg.role === "user"
                    ? "bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                    : "bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                }`}
              >
                {msg.role === "user" ? (
                  <User size={18} className="text-blue-400" weight="duotone" />
                ) : (
                  <Robot size={18} className="text-cyan-400" weight="duotone" />
                )}
              </div>
              <div
                className={`max-w-[75%] p-6 rounded-3xl text-[15px] leading-relaxed tracking-wide shadow-sm transition-all duration-300 ${
                  msg.role === "user"
                    ? "bg-blue-600/10 text-blue-50 border border-blue-500/10 rounded-tr-none hover:bg-blue-600/15"
                    : "bg-white/[0.04] text-gray-100 border border-white/5 rounded-tl-none hover:bg-white/[0.07] backdrop-blur-xl"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {chatMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-6"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <CircleNotch className="text-cyan-400 animate-spin" size={18} />
              </div>
              <div className="bg-white/[0.04] p-6 rounded-3xl rounded-tl-none border border-white/5 backdrop-blur-xl">
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-duration:0.8s]" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Command Input Area */}
      <div className="p-8 border-t border-white/5 bg-white/[0.01]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative group"
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500/40 group-focus-within:text-cyan-400 transition-colors">
            <Terminal size={18} weight="duotone" />
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Initialize command sequence..."
            className="w-full bg-white/[0.03] border border-white/10 focus:border-cyan-500/40 text-white h-16 pl-14 pr-20 rounded-[20px] outline-none transition-all placeholder:text-gray-600 font-medium"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              type="submit"
              disabled={!input.trim() || chatMutation.isPending}
              className="bg-cyan-600 hover:bg-cyan-500 text-white h-11 w-11 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all p-0"
            >
              {chatMutation.isPending ? (
                <CircleNotch className="animate-spin" size={20} />
              ) : (
                <PaperPlaneTilt size={20} weight="fill" />
              )}
            </Button>
          </div>
        </form>
        <p className="text-[9px] text-center text-gray-600 mt-4 uppercase tracking-[0.3em] font-bold">
          Neural Transmission Secure • CELAEST GRID v2.5
        </p>
      </div>
    </div>
  );
};
