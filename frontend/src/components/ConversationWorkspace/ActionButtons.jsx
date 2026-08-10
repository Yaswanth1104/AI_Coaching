export default function ActionButtons({
  loading,
  handleAnalyze,
  handleSendReply,
}) {
  return (
    <div className="grid grid-cols-2 gap-4">

      {/* Analyze Button */}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="
          py-4
          rounded-xl
          font-semibold
          text-white
          bg-gradient-to-r
          from-purple-600
          to-blue-600
          hover:scale-105
          hover:shadow-xl
          transition-all
          duration-300
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {loading ? (
          <div className="flex justify-center items-center gap-3">

            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>

            Analyzing...

          </div>
        ) : (
          "Analyze Conversation"
        )}
      </button>

      {/* Send Button */}

      <button
        onClick={handleSendReply}
        className="
          py-4
          rounded-xl
          font-semibold
          text-white
          bg-green-600
          hover:bg-green-700
          hover:scale-105
          hover:shadow-xl
          transition-all
          duration-300
        "
      >
        Send Reply
      </button>

    </div>
  );
}