"use client";

import { useState, useRef, useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard-store";
import { getDepartment } from "@/lib/departments";
import { Brain, Send, X, Sparkles, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
  streaming?: boolean;
};

function MarkdownMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-black/40 border border-border rounded-lg p-3 my-2 overflow-x-auto">
          <code className="text-xs text-green-400 font-mono whitespace-pre">{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="text-base font-bold text-white mt-3 mb-1">{renderInline(line.slice(2))}</h1>);
      i++; continue;
    }
    // H2
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-sm font-bold text-white mt-2 mb-1">{renderInline(line.slice(3))}</h2>);
      i++; continue;
    }
    // H3
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-sm font-semibold text-slate-200 mt-2 mb-0.5">{renderInline(line.slice(4))}</h3>);
      i++; continue;
    }

    // Bullet list
    if (line.match(/^[-*] /)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-none space-y-1 my-1.5 pl-1">
          {listItems.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-slate-300">
              <span className="text-accent mt-0.5 shrink-0">•</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const listItems: string[] = [];
      let num = 1;
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-none space-y-1 my-1.5 pl-1">
          {listItems.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-slate-300">
              <span className="text-accent font-mono text-xs mt-0.5 shrink-0 w-4">{j + 1}.</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      elements.push(<hr key={i} className="border-border my-2" />);
      i++; continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-1.5" />);
      i++; continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-slate-300 leading-relaxed">{renderInline(line)}</p>
    );
    i++;
  }

  return <div className="space-y-0.5 text-sm">{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  // Split on bold (**text**), italic (*text*), and inline code (`code`)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic text-slate-200">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="bg-black/40 text-green-400 font-mono text-xs px-1 py-0.5 rounded">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

const SUGGESTED_PROMPTS = [
  "What are the key trends in this data?",
  "Which state is performing best?",
  "Identify anomalies in the filtered data",
  "Compare year-over-year growth",
  "What insights can you draw from the current filters?",
];

export function AIPanel() {
  const { activeDepartment, filters, setAiPanelOpen } = useDashboardStore();
  const dept = getDepartment(activeDepartment);
  const DeptIcon = dept.icon;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinking, setThinking] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const assistantStartRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolledToAssistant = useRef(false);

  // Scroll to top of assistant reply when it first appears
  useEffect(() => {
    if (isStreaming && !hasScrolledToAssistant.current && assistantStartRef.current) {
      assistantStartRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      hasScrolledToAssistant.current = true;
    }
    if (!isStreaming) {
      hasScrolledToAssistant.current = false;
    }
  }, [messages, isStreaming]);

  // Scroll to bottom only for user messages and thinking indicator
  useEffect(() => {
    if (thinking) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [thinking]);

  const buildContext = () => {
    const parts = [`Department: ${dept.name}`];
    if (filters.state) parts.push(`State filter: ${filters.state}`);
    if (filters.year) parts.push(`Year filter: ${filters.year}`);
    if (filters.search) parts.push(`Search query: "${filters.search}"`);
    if (!filters.state && !filters.year) parts.push("No filters active — analyzing all data");
    return parts.join(", ");
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);
    setThinking("Analyzing data context and formulating response...");
    // Scroll to bottom to show user message + thinking indicator
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    const assistantMsg: Message = {
      role: "assistant",
      content: "",
      streaming: true,
    };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          context: buildContext(),
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "API error" }));
        throw new Error(errData.error || "API error");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      // Show thinking for 1.5s then start streaming
      await new Promise((r) => setTimeout(r, 1500));
      setThinking("");

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: fullText,
              streaming: true,
            };
            return updated;
          });
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          streaming: false,
        };
        return updated;
      });
    } catch (err) {
      setThinking("");
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `Error: ${errMsg}. Please try again.`,
          streaming: false,
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-accent" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Gemini AI</div>
            <div className="text-xs text-slate-500">Context-aware insights</div>
          </div>
        </div>
        <button
          onClick={() => setAiPanelOpen(false)}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Context badge */}
      <div className="px-4 py-2 border-b border-border bg-background/30">
        <div className={`text-xs px-2 py-1 rounded-lg ${dept.bgColor} ${dept.color} border ${dept.borderColor} inline-flex items-center gap-1.5`}>
          <DeptIcon className="w-3 h-3" />
          <span>{dept.shortName}</span>
          {filters.state && <span>· {filters.state}</span>}
          {filters.year && <span>· {filters.year}</span>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-slate-400 mb-1">Ask Gemini about your data</p>
              <p className="text-xs text-slate-600">
                I'll analyze the current filters and provide insights
              </p>
            </div>

            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="w-full text-left text-xs text-slate-400 hover:text-white bg-background/50 hover:bg-accent/10 border border-border hover:border-accent/30 rounded-lg px-3 py-2 transition-all"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            ref={msg.role === "assistant" && msg.streaming && i === messages.length - 1 ? assistantStartRef : null}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white"
                  : "bg-background border border-border text-slate-300"
              }`}
            >
              {msg.role === "user" ? (
                msg.content
              ) : (
                <MarkdownMessage content={msg.content} />
              )}
              {msg.streaming && (
                <span className="streaming-cursor"><span /></span>
              )}
            </div>
          </motion.div>
        ))}

        {/* Thinking indicator */}
        <AnimatePresence>
          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2"
            >
              <div className="bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3 h-3 animate-spin text-accent" />
                <span className="italic">{thinking}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex items-end gap-2 bg-background border border-border rounded-xl p-2 focus-within:border-accent/50 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the data..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 resize-none focus:outline-none max-h-24 py-1 px-1"
            style={{ minHeight: "24px" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="w-8 h-8 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
