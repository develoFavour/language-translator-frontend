"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
} from "recharts";

type Dist = { rating: number; count: number };

export default function FeedbackRatingsChart({
	distribution,
}: {
	distribution: Dist[];
}) {
	const allRatings = [1, 2, 3, 4, 5];
	const distributionMap = new Map(distribution.map((d) => [d.rating, d.count]));

	const data = allRatings.map((rating) => ({
		rating: `${rating}★`,
		count: distributionMap.get(rating) || 0,
	}));

	return (
		<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
			<h3 className="text-lg font-semibold text-white mb-6">
				Feedback Ratings Distribution
			</h3>
			{data.every((d) => d.count === 0) ? (
				<div className="h-[350px] flex items-center justify-center text-slate-400">
					No feedback ratings in the selected range.
				</div>
			) : (
				<ResponsiveContainer width="100%" height={350}>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
						<XAxis dataKey="rating" stroke="#94a3b8" />
						<YAxis stroke="#94a3b8" allowDecimals={false} />

						<Legend />
						<Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
