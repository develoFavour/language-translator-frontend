"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Legend,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

type Dist = { rating: number; count: number };

export default function FeedbackRatingsChart({ distribution }: { distribution: Dist[] }) {
	const data = distribution
		.slice()
		.sort((a, b) => a.rating - b.rating)
		.map((d) => ({ rating: `${d.rating}★`, count: d.count }));

	return (
		<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
			<h3 className="text-lg font-semibold text-white mb-6">
				Feedback Ratings Distribution
			</h3>
			{data.length === 0 ? (
				<div className="h-[350px] flex items-center justify-center text-slate-400">
					No feedback ratings in the selected range.
				</div>
			) : (
				<ResponsiveContainer width="100%" height={350}>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
						<XAxis dataKey="rating" stroke="#94a3b8" />
						<YAxis stroke="#94a3b8" allowDecimals={false} />
						<Tooltip
							contentStyle={{
								backgroundColor: "#1e293b",
								border: "1px solid #475569",
								borderRadius: "8px",
							}}
							labelStyle={{ color: "#e2e8f0" }}
						/>
						<Legend />
						<Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
