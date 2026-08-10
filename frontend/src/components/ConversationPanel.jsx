import { useState } from "react";
import { analyzeMessage } from "../services/api";
import ReplyPanel from "./ReplyPanel";
import LoadingSpinner from "./LoadingSpinner";

export default function ConversationPanel({
  setAnalysis,
  setCoach,
  setAgentStatus,
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Delay helper for agent animation
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleAnalyze = async () => {
    if (!message.trim()) {
      alert("Please enter a customer message.");
      return;
    }

    try {
      setLoading(true);

      // Reset previous results
      setAnalysis(null);
      setCoach("");

      // ===============================
      // Agent 1 - Customer Understanding
      // ===============================
      setAgentStatus({
        understanding: "Running",
        knowledge: "Waiting",
        coach: "Waiting",
        quality: "Waiting",
        supervisor: "Waiting",
      });

      const result = await analyzeMessage(message);

      await sleep(700);

      setAnalysis(result.understanding);

      setAgentStatus({
        understanding: "Complete",
        knowledge: "Searching",
        coach: "Waiting",
        quality: "Waiting",
        supervisor: "Waiting",
      });

      // ===============================
      // Agent 2 - Knowledge Agent
      // ===============================
      await sleep(700);

      setAgentStatus({
        understanding: "Complete",
        knowledge: "Complete",
        coach: "Running",
        quality: "Waiting",
        supervisor: "Waiting",
      });

      // ===============================
      // Agent 3 - Coach Agent
      // ===============================
      await sleep(700);

      setCoach(result.coach);

      setAgentStatus({
        understanding: "Complete",
        knowledge: "Complete",
        coach: "Complete",
        quality: "Running",
        supervisor: "Waiting",
      });

      // ===============================
      // Agent 4 - Quality Agent
      // ===============================
      await sleep(700);

      setAgentStatus({
        understanding: "Complete",
        knowledge: "Complete",
        coach: "Complete",
        quality: "Complete",
        supervisor: "Running",
      });

      // ===============================
      // Agent 5 - Supervisor Agent
      // ===============================
      await sleep(700);

      setAgentStatus({
        understanding: "Complete",
        knowledge: "Complete",
        coach: "Complete",
        quality: "Complete",
        supervisor: "Complete",
      });

    } catch (error) {
      console.error("Analysis Error:", error);

      alert("Analysis Failed");

      setAgentStatus({
        understanding: "Error",
        knowledge: "Error",
        coach: "Error",
        quality: "Error",
        supervisor: "Error",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#182235] rounded-2xl shadow-xl border border-slate-700 p-6">

      <h2 className="text-3xl font-bold text-white mb-6">
        Customer Conversation
      </h2>

      {/* Customer Message */}

      <div className="mb-6">

        <label className="block text-white font-semibold mb-2">
          Customer Message
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter customer message here..."
          className="w-full h-44 rounded-xl bg-slate-800 border border-slate-700 text-white p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

      </div>

      {/* Employee Reply */}

      <ReplyPanel />

      {/* Buttons */}

      <div className="flex gap-4 mt-6">

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:scale-105 transition duration-300 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Conversation"}
        </button>

        <button
          className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-300"
        >
          Send Reply
        </button>

      </div>

      {/* Loading */}

      {loading && (
        <div className="mt-6">
          <LoadingSpinner />
        </div>
      )}

    </div>
  );
}