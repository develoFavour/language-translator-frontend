"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, Star } from "lucide-react";
import type { Translation, Feedback } from "@/app/page";

interface FeedbackModalProps {
	translation: Translation;
	onSubmit: (feedback: Feedback) => void;
	onClose: () => void;
}

export function FeedbackModal({
	translation,
	onSubmit,
	onClose,
}: FeedbackModalProps) {
	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [suggestedText, setSuggestedText] = useState("");

	const handleSubmit = () => {
		if (rating === 0) return;

		onSubmit({
			translationId: translation.id,
			rating,
			suggestedText: suggestedText.trim() || undefined,
		});
	};

	return (
		<>
			<div
				className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300"
				onClick={onClose}
			/>

			<div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
				<Card className="w-full max-w-lg p-6 space-y-6 glass-card border-border/50 animate-in zoom-in-95 fade-in duration-300">
					{/* Header */}
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold text-gradient">
							Rate Translation
						</h2>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="hover:bg-muted/50 hover:scale-110 transition-all duration-300"
						>
							<X className="h-5 w-5" />
						</Button>
					</div>

					{/* Translation Preview */}
					<div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border/30 animate-in fade-in slide-in-from-top-2 duration-500 delay-100">
						<div>
							<p className="text-xs text-muted-foreground uppercase font-medium mb-1">
								Original ({translation.sourceLang})
							</p>
							<p className="text-sm text-foreground">
								{translation.sourceText}
							</p>
						</div>
						<div className="border-t border-border/30 pt-3">
							<p className="text-xs text-muted-foreground uppercase font-medium mb-1">
								Translation ({translation.targetLang})
							</p>
							<p className="text-sm font-medium text-primary">
								{translation.translatedText}
							</p>
						</div>
					</div>

					{/* Rating */}
					<div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500 delay-200">
						<label className="text-sm font-medium">
							How accurate is this translation?
						</label>
						<div className="flex gap-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoveredRating(star)}
									onMouseLeave={() => setHoveredRating(0)}
									className="transition-all duration-200 hover:scale-125"
								>
									<Star
										className={`h-8 w-8 transition-all duration-200 ${
											star <= (hoveredRating || rating)
												? "fill-rose-500 text-rose-500 scale-110"
												: "text-muted-foreground hover:text-rose-400"
										}`}
									/>
								</button>
							))}
						</div>
					</div>

					{/* Suggestion */}
					<div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-500 delay-300">
						<label className="text-sm font-medium">
							Suggest a better translation (optional)
						</label>
						<Textarea
							value={suggestedText}
							onChange={(e) => setSuggestedText(e.target.value)}
							placeholder="Enter your suggested translation..."
							className="min-h-[100px] bg-card/50 border-border/50 hover:border-border transition-colors duration-300 focus:border-primary"
						/>
					</div>

					{/* Actions */}
					<div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
						<Button
							variant="outline"
							onClick={onClose}
							className="flex-1 bg-transparent hover:bg-muted/50 transition-all duration-300"
						>
							Cancel
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={rating === 0}
							className="flex-1 bg-gradient-to-r border-2 border-white from-primary to-accent hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
						>
							Submit Feedback
						</Button>
					</div>
				</Card>
			</div>
		</>
	);
}
