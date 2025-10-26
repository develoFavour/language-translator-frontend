import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	trend?: string;
	trendUp?: boolean;
}

export default function StatCard({
	title,
	value,
	icon: Icon,
	trend,
	trendUp,
}: StatCardProps) {
	return (
		<div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
			{/* Gradient overlay on hover */}
			<div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-cyan-500/5 rounded-lg transition-all duration-300" />

			<div className="relative space-y-4">
				<div className="flex items-start justify-between">
					<div>
						<p className="text-sm font-medium text-slate-400">{title}</p>
						<p className="text-3xl font-bold text-white mt-2">{value}</p>
					</div>
					<div className="p-3 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-300">
						<Icon size={24} className="text-cyan-500" />
					</div>
				</div>

				{trend && (
					<div className="flex items-center gap-1">
						<span
							className={`text-sm font-semibold ${
								trendUp ? "text-green-500" : "text-red-500"
							}`}
						>
							{trend}
						</span>
						<span className="text-xs text-slate-500">from last month</span>
					</div>
				)}
			</div>
		</div>
	);
}
