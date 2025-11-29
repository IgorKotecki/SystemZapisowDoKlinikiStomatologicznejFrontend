import type { User } from "./User";
import type { TimeBlock } from "./TimeBlock";
import type { Service } from "./Service";

export interface Appointment {
  id: number;
    user: User;
    doctorBlock: TimeBlock;
    services: Service[];
    status: string;
}
