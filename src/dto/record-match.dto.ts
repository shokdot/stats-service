export interface RecordMatchDTO {
	playerAId: string;
	playerBId: string;
	scoreA: number;
	scoreB: number;
	winnerId: string | null;
	duration: number;
	gameMode?: string; // "online" | "local" | "ai_easy" | "ai_medium" | "ai_hard"
}
