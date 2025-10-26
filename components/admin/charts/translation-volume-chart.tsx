"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

type Bucket = { language: string; count: number };

export default function TranslationVolumeChart({ languages }: { languages: Bucket[] }) {
	return (
		<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
			<h3 className="text-lg font-semibold text-white mb-6">Translation Volume by Language</h3>
			{languages.length === 0 ? (
				<div className="h-[300px] flex items-center justify-center text-slate-400">
					No translations in the selected range.
				</div>
			) : (
				<ResponsiveContainer width="100%" height={300}>
					<PieChart>
						<Pie
							data={languages.map((l) => ({ name: l.language || "Unknown", value: l.count }))}
							cx="50%"
							cy="50%"
							labelLine={false}
							label={({ name, value }) => `${name}: ${value}`}
							outerRadius={110}
							fill="#06b6d4"
							dataKey="value"
						>
							{languages.map((_, index) => (
								<Cell key={`cell-${index}`} fill={["#06b6d4", "#10b981", "#f59e0b", "#a78bfa", "#ef4444", "#38bdf8"][index % 6]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
							labelStyle={{ color: "#e2e8f0" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			)}
		</div>
	);
}
