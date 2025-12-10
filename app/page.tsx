"use client";

import { useState, FormEvent } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newUserMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed })
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Request failed with status ${res.status}`);
      }

      const data: { answer?: string } = await res.json();
      const answer = data.answer ?? "抱歉，目前無法產生回應。";

      const assistantMessage: Message = {
        role: "assistant",
        content: answer
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setError("呼叫後端失敗，請稍後再試或確認 API 網址設定。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="chat-container">
        <header className="chat-header">
          <h1>履歷 RAG 聊天機器人</h1>
          <p>以你的履歷為基礎，模擬面試對話。</p>
        </header>

        <section className="chat-window">
          {messages.length === 0 && (
            <div className="chat-empty">
              <p>可以先問一些與工作經驗、專案或技能相關的問題。</p>
            </div>
          )}

          {messages.map((m, idx) => (
            <div
              key={idx}
              className={
                m.role === "user"
                  ? "chat-bubble chat-bubble-user"
                  : "chat-bubble chat-bubble-assistant"
              }
            >
              <div className="chat-bubble-role">
                {m.role === "user" ? "面試官" : "許皓翔"}
              </div>
              <div className="chat-bubble-content">{m.content}</div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble chat-bubble-assistant typing">
              <div className="chat-bubble-role">許皓翔</div>
              <div className="chat-bubble-content">正在思考回應中…</div>
            </div>
          )}
        </section>

        {error && <div className="chat-error">{error}</div>}

        <form className="chat-input-area" onSubmit={handleSubmit}>
          <input
            className="chat-input"
            placeholder="請輸入面試問題，例如：請介紹一個你最有成就感的專案？"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button className="chat-send-btn" type="submit" disabled={loading}>
            {loading ? "送出中…" : "送出"}
          </button>
        </form>
      </div>
    </main>
  );
}
