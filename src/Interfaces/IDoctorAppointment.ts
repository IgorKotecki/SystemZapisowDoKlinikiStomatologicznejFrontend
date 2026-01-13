import type {AddInfo}  from "./AddInfo";
import type { Service } from "./Service";
import type { User } from "./User";

export interface IDoctorAppointment {

    id: string;
    patientId: number;
    patientFirstName: string;
    patientLastName: string;
    services: Service[];
    date: string;
    timeStart: string;
    timeEnd: string;
    patientEmail: string;
    patientPhoneNumber: string;
    additionalInformation: AddInfo[];
    status: string;
    doctor: User;
    cancellationReason?: string;
}