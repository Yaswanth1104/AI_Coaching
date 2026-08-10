import { useState } from "react";

export default function ReplyPanel() {

  const [reply, setReply] = useState("");

  return (

    <div>

      <h3 className="text-white font-semibold mb-2">
        Employee Reply
      </h3>

      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Type your response..."
        className="w-full h-40 rounded-xl bg-slate-800 border border-slate-700 text-white p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

    </div>

  );

}