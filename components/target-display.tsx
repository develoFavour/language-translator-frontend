import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Volume2,
	Copy,
	ThumbsUp,
	Sparkles,
	Loader2,
	AlertTriangle,
} from "lucide-react";
import type { Translation } from "@/app/page";

interface Language {
	code: string;
	name: string;
	flag: string;
}

interface TargetDisplayProps {
	targetLang: string;
	translatedText: string;
	currentTranslation: Translation | null;
	copied: boolean;
	onSpeak: (text: string, lang: string) => void;
	onCopy: () => void;
	onRequestFeedback: (translation: Translation) => void;
	speaking: boolean;
	languages: Language[];
	ttsEnabled: boolean;
	isClarifying?: boolean;
	onClarify?: (option: string) => void;
	canRate?: boolean;
}

export function TargetDisplay({
	targetLang,
	translatedText,
	currentTranslation,
	copied,
	onSpeak,
	onCopy,
	onRequestFeedback,
	speaking,
	languages,
	ttsEnabled,
	isClarifying = false,
	onClarify,
	canRate = true,
}: TargetDisplayProps) {
	const currentLanguage = languages.find((l) => l.code === targetLang);

	return (
		<Card className="p-6 space-y-4 bg-gradient-to-br from-muted/30 to-muted/10 hover:shadow-lg transition-all duration-300 border-border/50 ">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
					<span className="text-lg">{currentLanguage?.flag}</span>
					{currentLanguage?.name}
				</h3>
				{translatedText && (
					<div className="flex gap-2">
						{ttsEnabled && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onSpeak(translatedText, targetLang)}
								disabled={speaking}
								className="hover:bg-accent/10 hover:text-accent transition-colors"
							>
								{speaking ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Volume2 className="h-4 w-4" />
								)}
							</Button>
						)}
						<Button
							variant="ghost"
							size="sm"
							onClick={onCopy}
							className="hover:bg-primary/10 hover:text-primary transition-colors"
						>
							<Copy className="h-4 w-4" />
							{copied && (
								<span className="ml-2 text-xs animate-in fade-in duration-200">
									Copied!
								</span>
							)}
						</Button>
					</div>
				)}
			</div>
			<div className="min-h-[200px] text-lg">
				{translatedText ? (
					<div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
						<p>{translatedText}</p>
						{currentTranslation?.needsClarification && (
							<div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
								<div className="flex items-start gap-2 text-sm text-amber-200">
									<AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
									<p>
										This short term may need more context for the most accurate
										translation.
									</p>
								</div>
								{currentTranslation.note && (
									<p className="text-sm text-muted-foreground">
										{currentTranslation.note}
									</p>
								)}
								{currentTranslation.clarificationOptions &&
									currentTranslation.clarificationOptions.length > 0 && (
										<div className="flex flex-wrap gap-2">
											{currentTranslation.clarificationOptions.map((option) => (
												<Button
													key={option}
													type="button"
													variant="outline"
													size="sm"
													disabled={isClarifying}
													onClick={() => onClarify?.(option)}
													className="rounded-full text-xs"
												>
													{option}
												</Button>
											))}
										</div>
									)}
							</div>
						)}
					</div>
				) : (
					<p className="text-gray-500 flex items-center gap-2">
						<Sparkles className="h-4 w-4" />
						Translation will appear here...
					</p>
				)}
			</div>
			{translatedText && currentTranslation && canRate && (
				<Button
					variant="outline"
					size="sm"
					onClick={() => onRequestFeedback(currentTranslation)}
					className="w-full cursor-pointer hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
				>
					<ThumbsUp className="h-4 w-4 mr-2" />
					Rate Translation
				</Button>
			)}
		</Card>
	);
}
