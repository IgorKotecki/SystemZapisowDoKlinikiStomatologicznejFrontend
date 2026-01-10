import type { User } from "./User";
import type { Service } from "./Service";
import type { AddInfo } from "./AddInfo";

export interface Appointment {
  user: User;
  startTime: string;
  appointmentGroupId: string;
  endTime: string;
  doctor: User;
  services: Service[];
  status: string;
  additionalInformation: AddInfo[];
}
