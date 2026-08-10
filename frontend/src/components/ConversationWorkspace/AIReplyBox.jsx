import { FaRobot } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

export default function AIReplyBox({ coach }) {

  return (

    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-xl">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">

            <FaRobot className="text-white text-xl" />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">

              AI Coach

            </h2>

            <p className="text-slate-400">

              Professional Guidance

            </p>

          </div>

        </div>

        <div>

          <p className="text-slate-400 text-sm">

            Confidence

          </p>

          <h2 className="text-green-400 text-2xl font-bold">

            {coach.confidence}%

          </h2>

        </div>

      </div>

      {/* Recommended Response */}

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">

        <h3 className="text-blue-400 font-semibold mb-3">

          💬 Recommended Response

        </h3>

        <p className="text-slate-300 whitespace-pre-wrap">

          {coach.recommended_response ||
            "Analyze a conversation to generate an AI response."}

        </p>

      </div>

      {/* Suggested Actions */}

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mt-5">

        <h3 className="text-yellow-400 font-semibold mb-3">

          📋 Suggested Actions

        </h3>

        {coach.suggested_actions.length === 0 ? (

          <p className="text-slate-500">

            No actions available.

          </p>

        ) : (

          coach.suggested_actions.map((action, index) => (

            <div
              key={index}
              className="flex gap-3 items-center mb-2"
            >

              <FiCheckCircle className="text-green-400" />

              <span className="text-slate-300">

                {action}

              </span>

            </div>

          ))

        )}

      </div>

      {/* Coaching Tips */}

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 mt-5">

        <h3 className="text-purple-400 font-semibold mb-3">

          🎯 Coaching Tips

        </h3>

        {coach.coaching_tips.length === 0 ? (

          <p className="text-slate-500">

            No tips available.

          </p>

        ) : (

          <ul className="list-disc pl-6 text-slate-300 space-y-2">

            {coach.coaching_tips.map((tip, index) => (

              <li key={index}>

                {tip}

              </li>

            ))}

          </ul>

        )}

      </div>

      {/* Confidence Bar */}

      <div className="mt-6">

        <div className="flex justify-between mb-2">

          <span className="text-slate-400">

            AI Confidence

          </span>

          <span className="text-green-400">

            {coach.confidence}%

          </span>

        </div>

        <div className="w-full bg-slate-700 rounded-full h-3">

          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700"
            style={{
              width: `${coach.confidence}%`,
            }}
          />

        </div>

      </div>

    </div>

  );

}