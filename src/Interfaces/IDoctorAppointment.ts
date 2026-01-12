import type {AddInfo}  from "./AddInfo";
import type { User } from "./User";

export interface IDoctorAppointment {

    id: string;
    patientId: number;
    patientFirstName: string;
    patientLastName: string;
    servicesName: string[];
    date: string;
    timeStart: string;
    timeEnd: string;
    patientEmail: string;
    patienPhoneNumber: string;
    additionalInformation: AddInfo[];
    status: string;
    doctor: User;
    cancellatingReason?: string;
}