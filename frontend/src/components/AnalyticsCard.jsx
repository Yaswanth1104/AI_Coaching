import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

import Card from "./Card";
import { getAnalytics } from "../services/api";

const COLORS = [
    "#22c55e",
    "#facc15",
    "#ef4444"
];

export default function AnalyticsCard() {

    const [analytics, setAnalytics] = useState({

        total_conversations: 0,
        average_quality: 0,

        positive: 0,
        neutral: 0,
        negative: 0

    });

    useEffect(() => {

        loadAnalytics();

    }, []);

    const loadAnalytics = async () => {

        try {

            const data = await getAnalytics();

            setAnalytics(data);

        }

        catch (error) {

            console.error(error);

        }

    };

    const chartData = [

        {
            name: "Positive",
            value: analytics.positive
        },

        {
            name: "Neutral",
            value: analytics.neutral
        },

        {
            name: "Negative",
            value: analytics.negative
        }

    ];

    return (

        <Card title="📊 Analytics">

            <div className="space-y-6">

                <div className="flex justify-between">

                    <span>Total Conversations</span>

                    <b>{analytics.total_conversations}</b>

                </div>

                <div className="flex justify-between">

                    <span>Average Quality</span>

                    <b>{analytics.average_quality}%</b>

                </div>

                <div style={{ width: "100%", height: 300 }}>

                    <ResponsiveContainer>

                        <PieChart>

                            <Pie

                                data={chartData}

                                dataKey="value"

                                nameKey="name"

                                outerRadius={100}

                                label

                            >

                                {

                                    chartData.map(

                                        (entry, index) => (

                                            <Cell

                                                key={index}

                                                fill={
                                                    COLORS[index]
                                                }

                                            />

                                        )

                                    )

                                }

                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </Card>

    );

}