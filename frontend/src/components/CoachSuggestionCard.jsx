import Card from "./Card";
import RecommendationBox from "./RecommendationBox";

export default function CoachSuggestionCard({ coach }) {

    // ======================================================
    // Empty State
    // ======================================================

    if (!coach) {

        return (

            <Card title="🤖 AI Coach Suggestion">

                <p className="text-slate-400">
                    Analyze a conversation first.
                </p>

            </Card>

        );

    }


    // ======================================================
    // Safe Values
    // ======================================================

    const recommendedResponse =
        coach.recommended_response ||
        "No recommendation generated.";

    const suggestedActions =
        Array.isArray(coach.suggested_actions)
            ? coach.suggested_actions
            : [];

    const coachingTips =
        Array.isArray(coach.coaching_tips)
            ? coach.coaching_tips
            : [];

    const confidence =
        Number.isFinite(Number(coach.confidence))
            ? Math.max(
                0,
                Math.min(
                    100,
                    Number(coach.confidence)
                )
            )
            : 0;


    // ======================================================
    // UI
    // ======================================================

    return (

        <Card title="🤖 AI Coach Suggestion">

            <div className="space-y-5">


                {/* ==========================================
                    Recommended Response
                ========================================== */}

                <RecommendationBox
                    title="💡 Recommended Response"
                >

                    <p className="text-slate-300 whitespace-pre-wrap">

                        {recommendedResponse}

                    </p>

                </RecommendationBox>


                {/* ==========================================
                    Suggested Actions
                ========================================== */}

                <RecommendationBox
                    title="✅ Suggested Actions"
                >

                    {
                        suggestedActions.length > 0 ? (

                            <ul className="list-disc pl-5 space-y-2 text-slate-300">

                                {
                                    suggestedActions.map(
                                        (action, index) => (

                                            <li key={index}>
                                                {action}
                                            </li>

                                        )
                                    )
                                }

                            </ul>

                        ) : (

                            <p className="text-slate-400">
                                No suggested actions available.
                            </p>

                        )
                    }

                </RecommendationBox>


                {/* ==========================================
                    Coaching Tips
                ========================================== */}

                <RecommendationBox
                    title="🎯 Coaching Tips"
                >

                    {
                        coachingTips.length > 0 ? (

                            <ul className="list-disc pl-5 space-y-2 text-slate-300">

                                {
                                    coachingTips.map(
                                        (tip, index) => (

                                            <li key={index}>
                                                {tip}
                                            </li>

                                        )
                                    )
                                }

                            </ul>

                        ) : (

                            <p className="text-slate-400">
                                No coaching tips available.
                            </p>

                        )
                    }

                </RecommendationBox>


                {/* ==========================================
                    AI Confidence
                ========================================== */}

                <div>

                    <div className="flex justify-between mb-2 text-white">

                        <span>
                            AI Confidence
                        </span>

                        <span>
                            {confidence}%
                        </span>

                    </div>


                    <div className="w-full bg-slate-700 rounded-full h-3">

                        <div
                            className="bg-blue-500 h-3 rounded-full"
                            style={{
                                width: `${confidence}%`
                            }}
                        />

                    </div>

                </div>

            </div>

        </Card>

    );

}