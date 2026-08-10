import CustomerInput from "./CustomerInput";
import AIReplyBox from "./AIReplyBox";
import AgentReplyBox from "./AgentReplyBox";
import ConversationHistory from "./ConversationHistory";
import ActionButtons from "./ActionButtons";

export default function ConversationWorkspace({
  message,
  setMessage,
  coach,
  employeeReply,
  setEmployeeReply,
  history,
  loading,
  handleAnalyze,
  handleSendReply,
}) {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl p-6 space-y-6">

      <h2 className="text-4xl font-bold text-white">
        Conversation
      </h2>

      <CustomerInput
        message={message}
        setMessage={setMessage}
      />

      <AIReplyBox coach={coach} />

      <AgentReplyBox
        employeeReply={employeeReply}
        setEmployeeReply={setEmployeeReply}
      />

      <ConversationHistory
        history={history}
      />
      <AIReplyBox coach={coach} />

      <ActionButtons
        loading={loading}
        handleAnalyze={handleAnalyze}
        handleSendReply={handleSendReply}
      />

    </div>
  );
}