"use client";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ language: "Yoruba", volume: 3200 },
	{ language: "Igbo", volume: 2800 },
	{ language: "Hausa", volume: 2400 },
	{ language: "English", volume: 4100 },
	{ language: "Others", volume: 2920 },
];

export default function TranslationVolumeChart() {
	return (
		<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
			<h3 className="text-lg font-semibold text-white mb-6">
				Translation Volume by Language
			</h3>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" stroke="#334155" />
					<XAxis dataKey="language" stroke="#94a3b8" />
					<YAxis stroke="#94a3b8" />
					<Tooltip
						contentStyle={{
							backgroundColor: "#1e293b",
							border: "1px solid #475569",
							borderRadius: "8px",
						}}
						labelStyle={{ color: "#e2e8f0" }}
					/>
					<Bar dataKey="volume" fill="#06b6d4" radius={[8, 8, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
