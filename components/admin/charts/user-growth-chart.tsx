"use client";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ month: "Jan", users: 400 },
	{ month: "Feb", users: 520 },
	{ month: "Mar", users: 680 },
	{ month: "Apr", users: 890 },
	{ month: "May", users: 1050 },
	{ month: "Jun", users: 1250 },
];

export default function UserGrowthChart() {
	return (
		<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
			<h3 className="text-lg font-semibold text-white mb-6">User Growth</h3>
			<ResponsiveContainer width="100%" height={300}>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
					<XAxis dataKey="month" stroke="#94a3b8" />
					<YAxis stroke="#94a3b8" />
					<Tooltip
						contentStyle={{
							backgroundColor: "#1e293b",
							border: "1px solid #475569",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#e2e8f0" }}
					/>
					<Line
						type="monotone"
						dataKey="users"
						stroke="#06b6d4"
						strokeWidth={2}
						dot={{ fill: "#06b6d4", r: 4 }}
						activeDot={{ r: 6 }}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
