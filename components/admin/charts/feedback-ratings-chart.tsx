"use client";

import {
	PieChart,
	Pie,
	Cell,
	Legend,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ name: "5 Stars", value: 450 },
	{ name: "4 Stars", value: 320 },
	{ name: "3 Stars", value: 180 },
	{ name: "2 Stars", value: 85 },
	{ name: "1 Star", value: 45 },
];

const COLORS = ["#10b981", "#06b6d4", "#f59e0b", "#ef4444", "#dc2626"];

export default function FeedbackRatingsChart() {
	return (
		<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
			<h3 className="text-lg font-semibold text-white mb-6">
				Feedback Ratings Distribution
			</h3>
			<ResponsiveContainer width="100%" height={350}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						label={({ name, value }) => `${name}: ${value}`}
						outerRadius={100}
						fill="#8884d8"
						dataKey="value"
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							backgroundColor: "#1e293b",
							border: "1px solid #475569",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#e2e8f0" }}
					/>
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
