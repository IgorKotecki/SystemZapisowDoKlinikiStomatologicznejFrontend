export interface IDoctorAppointment {

    id: string;
    patientFirstName: string;
    patientLastName: string;
    servicesName: string[];
    date: string;
    timeStart: string;
    timeEnd: string;
    patientEmail: string;
    patienPhoneNumber: string;
}