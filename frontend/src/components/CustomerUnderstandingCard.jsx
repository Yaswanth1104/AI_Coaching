import Card from "./Card";
import StatusBadge from "./StatusBadge";

export default function CustomerUnderstandingCard({ analysis }) {

  if (!analysis) {

    return (

      <Card title="Customer Understanding">

        <div className="text-slate-400">

          Analyze a conversation to generate customer insights.

        </div>

      </Card>

    );

  }

  return (

    <Card title="Customer Understanding Agent">

      <div className="space-y-5">

        <div className="flex justify-between items-center">

          <span className="text-white font-semibold">

            Emotion

          </span>

          <StatusBadge
            label={analysis.emotion}
            type="emotion"
          />

        </div>

        <div className="flex justify-between items-center">

          <span className="text-white font-semibold">

            Intent

          </span>

          <StatusBadge
            label={analysis.intent}
            type="info"
          />

        </div>

        <div className="flex justify-between items-center">

          <span className="text-white font-semibold">

            Sentiment

          </span>

          <StatusBadge
            label={analysis.sentiment}
            type={
              analysis.sentiment.toLowerCase()
            }
          />

        </div>

        <div className="flex justify-between items-center">

          <span className="text-white font-semibold">

            Priority

          </span>

          <StatusBadge
            label={analysis.priority}
            type={
              analysis.priority.toLowerCase()
            }
          />

        </div>

        <hr className="border-slate-700" />

        <h3 className="text-xl font-bold text-white">

          Entities

        </h3>

        <div className="bg-slate-800 rounded-xl p-4 space-y-3">

          <div className="flex justify-between">

            <span className="text-slate-300">

              Product

            </span>

            <span className="text-white">

              {analysis.entities.product || "-"}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-300">

              Issue

            </span>

            <span className="text-white">

              {analysis.entities.issue || "-"}

            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-300">

              Duration

            </span>

            <span className="text-white">

              {analysis.entities.duration || "-"}

            </span>

          </div>

        </div>

        <div>

          <div className="flex justify-between text-white mb-2">

            <span>AI Confidence</span>

            <span>96%</span>

          </div>

          <div className="w-full bg-slate-700 rounded-full h-3">

            <div className="bg-green-500 h-3 rounded-full w-[96%]"></div>

          </div>

        </div>

      </div>

    </Card>

  );

}