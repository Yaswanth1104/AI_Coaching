export default function ConversationHistory({ history }) {

  return (

    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <h3 className="text-purple-400 text-xl font-semibold">
          Conversation History
        </h3>

        <span className="text-slate-400 text-sm">
          {history.length} Messages
        </span>

      </div>

      <div
        className="
          bg-slate-800
          rounded-xl
          border
          border-slate-700
          p-5
          h-80
          overflow-y-auto
          space-y-6
        "
      >

        {history.length === 0 ? (

          <div className="h-full flex items-center justify-center">

            <p className="text-slate-500">
              No conversation yet.
            </p>

          </div>

        ) : (

          history.map((item, index) => (

            <div
              key={index}
              className="space-y-3"
            >

              {/* Customer */}

              <div className="flex justify-start">

                <div
                  className="
                    bg-blue-900/40
                    border
                    border-blue-600
                    rounded-xl
                    px-5
                    py-3
                    max-w-[80%]
                  "
                >

                  <p className="text-blue-300 text-sm mb-1">
                    👤 Customer
                  </p>

                  <p className="text-white whitespace-pre-wrap">
                    {item.customer}
                  </p>

                </div>

              </div>

              {/* Employee */}

              <div className="flex justify-end">

                <div
                  className="
                    bg-green-900/40
                    border
                    border-green-600
                    rounded-xl
                    px-5
                    py-3
                    max-w-[80%]
                  "
                >

                  <p className="text-green-300 text-sm mb-1">
                    🤖 Employee
                  </p>

                  <p className="text-white whitespace-pre-wrap">
                    {item.employee}
                  </p>

                </div>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}