export default function AgentReplyBox({
  employeeReply,
  setEmployeeReply,
}) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-semibold text-gray-300">
        Employee Reply
      </label>

      <textarea
        value={employeeReply}
        onChange={(e) => setEmployeeReply(e.target.value)}
        placeholder="Type your response..."
        className="w-full h-32 rounded-xl bg-slate-800 border border-slate-700 p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

    </div>
  );
}