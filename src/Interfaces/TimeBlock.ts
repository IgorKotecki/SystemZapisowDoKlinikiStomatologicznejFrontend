import type { User } from "./User";
export interface TimeBlock {
    doctorBlockId: number;
    timeStart: string;
    timeEnd: string;
    isAvailable: boolean;
    user: User;
}
