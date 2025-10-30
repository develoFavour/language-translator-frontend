"use client";

import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2 } from "lucide-react";

interface Language {
	code: string;
	name: string;
	flag: string;
}

interface SourceTextareaProps {
	sourceLang: string;
	sourceText: string;
	onTextChange: (text: string) => void;
	onSpeak: (text: string, lang: string) => void;
	speaking: boolean;
	languages: Language[];
	ttsEnabled: boolean;
}

export function SourceTextarea({
	sourceLang,
	sourceText,
	onTextChange,
	onSpeak,
	speaking,
	languages,
	ttsEnabled,
}: SourceTextareaProps) {
	const currentLanguage = languages.find((l) => l.code === sourceLang);

	return (
		<Card className="p-6 space-y-4 hover:shadow-lg transition-shadow duration-300 border-border/20">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
					<span className="text-lg">{currentLanguage?.flag}</span>
					{currentLanguage?.name}
				</h3>
				{sourceText && ttsEnabled && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onSpeak(sourceText, sourceLang)}
						disabled={speaking}
						className="hover:bg-primary/10 hover:text-primary transition-colors"
					>
						{speaking ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Volume2 className="h-4 w-4" />
						)}
					</Button>
				)}
			</div>
			<Textarea
				value={sourceText}
				onChange={(e) => onTextChange(e.target.value)}
				placeholder="Enter text to translate..."
				className="min-h-[200px] resize-none border-0 focus-visible:ring-0 text-lg p-6"
			/>
			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<span>{sourceText.length} characters</span>
				{sourceText.length > 0 && (
					<span className="text-primary font-medium animate-in fade-in duration-300">
						Ready to translate
					</span>
				)}
			</div>
		</Card>
	);
}
