"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Clock, Trash2 } from "lucide-react";
import type { Translation } from "@/app/page";
import { format } from "date-fns";

interface HistoryPanelProps {
	translations: Translation[];
	isOpen: boolean;
	onClose: () => void;
	onSelectTranslation: (translation: Translation) => void;
}

export function HistoryPanel({
	translations,
	isOpen,
	onClose,
	onSelectTranslation,
}: HistoryPanelProps) {
	if (!isOpen) return null;

	return (
		<>
			<div
				className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300"
				onClick={onClose}
			/>

			<div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-sidebar border-l border-sidebar-border z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
				{/* Header */}
				<div className="p-6 border-b border-sidebar-border flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Clock className="h-5 w-5 text-sidebar-foreground" />
						<h2 className="text-lg font-semibold text-sidebar-foreground">
							Translation History
						</h2>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="text-sidebar-foreground hover:bg-sidebar-accent hover:scale-110 transition-all duration-300"
					>
						<X className="h-5 w-5" />
					</Button>
				</div>

				{/* History List */}
				<ScrollArea className="flex-1 h-full p-4 overscroll-contain">
					{translations.length === 0 ? (
						<div className="text-center py-12 animate-in fade-in duration-500">
							<Clock className="h-12 w-12 text-sidebar-foreground/30 mx-auto mb-4" />
							<p className="text-sidebar-foreground/60">No translations yet</p>
							<p className="text-sm text-sidebar-foreground/40 mt-2">
								Your translation history will appear here
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{translations.map((translation, index) => (
								<Card
									key={translation.id}
									className="p-4 cursor-pointer hover:bg-sidebar-accent transition-all hover:scale-105 hover:shadow-lg  bg-sidebar-accent/50 border-sidebar-border animate-in fade-in slide-in-from-left duration-300"
									style={{ animationDelay: `${index * 50}ms` }}
									onClick={() => {
										onSelectTranslation(translation);
										onClose();
									}}
								>
									<div className="space-y-2">
										<div className="flex items-center justify-between text-xs text-sidebar-foreground/60">
											<span className="uppercase font-medium">
												{translation.sourceLang} → {translation.targetLang}
											</span>
											<span>
												{format(translation.timestamp, "MMM d, h:mm a")}
											</span>
										</div>
										<p className="text-sm text-sidebar-foreground font-medium line-clamp-2">
											{translation.sourceText}
										</p>
										<p className="text-sm text-sidebar-foreground/70 line-clamp-2">
											{translation.translatedText}
										</p>
									</div>
								</Card>
							))}
						</div>
					)}
				</ScrollArea>

				{/* Footer */}
				{translations.length > 0 && (
					<div className="p-4 border-t border-sidebar-border animate-in fade-in slide-in-from-bottom duration-300">
						<Button
							variant="outline"
							className="w-full text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent hover:scale-105 bg-transparent transition-all duration-300"
							onClick={() => {
								console.log("[v0] Clear history");
							}}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Clear History
						</Button>
					</div>
				)}
			</div>
		</>
	);
}
