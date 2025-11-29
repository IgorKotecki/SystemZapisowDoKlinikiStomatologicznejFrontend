export interface FreeTime {
    id: string;
    start: string;
    end: string;
    type: "dayOff" | "break";
    reason?: string;
}