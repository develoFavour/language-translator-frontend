"use client";

import { useState, useEffect } from "react";
import { Users, Globe, MessageSquare, TrendingUp } from "lucide-react";
import StatCard from "@/components/admin/stat-card";
import UserGrowthChart from "@/components/admin/charts/user-growth-chart";
import TranslationVolumeChart from "@/components/admin/charts/translation-volume-chart";
import FeedbackRatingsChart from "@/components/admin/charts/feedback-ratings-chart";
import { api } from "@/lib/api-client";

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		totalUsers: 0,
		activeUsers: 0,
		totalTranslations: 0,
		avgFeedbackRating: 0,
	});

	const [loading, setLoading] = useState(false);
	const [userGrowth, setUserGrowth] = useState<{ date: string; count: number }[]>([]);
	const [translationLanguages, setTranslationLanguages] = useState<{ language: string; count: number }[]>([]);
	const [feedbackDist, setFeedbackDist] = useState<{ rating: number; count: number }[]>([]);

	useEffect(() => {
		const fetchAll = async () => {
			setLoading(true);
			try {
				const [statsRes, growthRes, langsRes, distRes] = await Promise.all([
					api.admin.getStats(),
					api.admin.getUserGrowth({ range: "30d" }),
					api.admin.getTranslationByLanguage({ range: "30d" }),
					api.admin.getFeedbackDistribution({ range: "90d" }),
				]);
				setStats({
					totalUsers: statsRes.stats?.totalUsers ?? 0,
					activeUsers: statsRes.stats?.activeUsers ?? 0,
					totalTranslations: statsRes.stats?.totalTranslations ?? 0,
					avgFeedbackRating: statsRes.stats?.avgFeedbackRating ?? 0,
				});
				setUserGrowth(growthRes.series ?? []);
				setTranslationLanguages(langsRes.languages ?? []);
				setFeedbackDist(distRes.distribution ?? []);
			} catch (e) {
				console.error("Error fetching admin metrics", e);
			} finally {
				setLoading(false);
			}
		};
		fetchAll();
	}, []);

	return (
		<div className="p-8 bg-black min-h-full">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header */}
				<div className="animate-in fade-in slide-in-from-top-4 duration-500">
					<h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
					<p className="text-slate-400">
						Welcome back! Here&apos;s your platform overview.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
					<StatCard
						title="Total Users"
						value={stats.totalUsers.toLocaleString()}
						icon={Users}
						trend="+12.5%"
						trendUp={true}
					/>
					<StatCard
						title="Active Users"
						value={stats.activeUsers.toLocaleString()}
						icon={TrendingUp}
						trend="+8.2%"
						trendUp={true}
					/>
					<StatCard
						title="Total Translations"
						value={stats.totalTranslations.toLocaleString()}
						icon={Globe}
						trend="+23.1%"
						trendUp={true}
					/>
					<StatCard
						title="Avg Feedback Rating"
						value={stats.avgFeedbackRating.toFixed(1)}
						icon={MessageSquare}
						trend="+0.3"
						trendUp={true}
					/>
				</div>

				{/* Charts Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500 delay-200">
					<UserGrowthChart data={userGrowth} />
					<TranslationVolumeChart languages={translationLanguages} />
				</div>

				{/* Feedback Ratings */}
				<div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-300">
					<FeedbackRatingsChart distribution={feedbackDist} />
				</div>
			</div>
		</div>
	);
}
