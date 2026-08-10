function StatusItem({ title, status }) {
  let dotColor = "bg-gray-500";
  let textColor = "text-gray-400";

  switch (status) {
    case "Running":
      dotColor = "bg-blue-500 animate-pulse";
      textColor = "text-blue-400";
      break;

    case "Searching":
      dotColor = "bg-yellow-500 animate-pulse";
      textColor = "text-yellow-400";
      break;

    case "Complete":
      dotColor = "bg-green-500";
      textColor = "text-green-400";
      break;

    case "Error":
      dotColor = "bg-red-500";
      textColor = "text-red-400";
      break;

    default:
      dotColor = "bg-gray-500";
      textColor = "text-gray-400";
  }

  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-700 last:border-none">

      <div>
        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className={`text-sm ${textColor}`}>
          {status}
        </p>
      </div>

      <div
        className={`w-4 h-4 rounded-full ${dotColor}`}
      ></div>

    </div>
  );
}

export default function AgentStatusCard({ agentStatus }) {

  const completedAgents = Object.values(agentStatus).filter(
    (status) => status === "Complete"
  ).length;

  const progress = (completedAgents / 5) * 100;

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl p-6 text-white">

      {/* Title */}

      <h2 className="text-2xl font-bold mb-6">
        🤖 Multi-Agent Status
      </h2>

      {/* Agent List */}

      <StatusItem
        title="Customer Understanding"
        status={agentStatus.understanding}
      />

      <StatusItem
        title="Knowledge Agent"
        status={agentStatus.knowledge}
      />

      <StatusItem
        title="Coach Agent"
        status={agentStatus.coach}
      />

      <StatusItem
        title="Quality Evaluation"
        status={agentStatus.quality}
      />

      <StatusItem
        title="Supervisor Agent"
        status={agentStatus.supervisor}
      />

      {/* Progress */}

      <div className="mt-8">

        <div className="flex justify-between mb-2">

          <span className="text-gray-400">
            Overall Progress
          </span>

          <span className="font-semibold">
            {progress.toFixed(0)}%
          </span>

        </div>

        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

          <div
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>

      </div>

      {/* Summary */}

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-gray-400 text-sm">
            Active Agents
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {completedAgents}/5
          </h3>

        </div>

        <div className="bg-slate-800 rounded-xl p-4">

          <p className="text-gray-400 text-sm">
            System Status
          </p>

          <h3 className="text-2xl font-bold mt-2 text-green-400">
            Healthy
          </h3>

        </div>

      </div>

    </div>
  );
}