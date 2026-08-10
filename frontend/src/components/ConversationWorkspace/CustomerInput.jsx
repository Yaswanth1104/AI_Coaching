export default function CustomerInput({
  message,
  setMessage,
}) {
  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">

        <h3 className="text-blue-400 text-xl font-semibold">
          Customer Message
        </h3>

        <span className="text-slate-400 text-sm">
          {message.length} Characters
        </span>

      </div>

      {/* Textarea */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type the customer's message here..."
        rows={7}
        className="
          w-full
          bg-slate-800
          border
          border-slate-700
          rounded-xl
          p-5
          text-white
          placeholder:text-slate-500
          resize-none
          outline-none
          transition-all
          duration-300
          focus:border-purple-500
          focus:ring-2
          focus:ring-purple-500/40
        "
      />

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-slate-400">

        <span>
          AI will analyze the customer conversation.
        </span>

        <span
          className={`font-semibold ${
            message.length > 500
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {message.length}/1000
        </span>

      </div>

    </div>
  );
}