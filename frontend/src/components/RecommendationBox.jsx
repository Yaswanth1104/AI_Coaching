export default function RecommendationBox({
    title,
    children
}) {

    return (

        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">

            <h3 className="text-white font-semibold mb-3">

                {title}

            </h3>

            {children}

        </div>

    );

}