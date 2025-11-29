export interface IDoctorAppointment {
    
    id: number;
    patientFirstName: string;
    patientLastName: string;
    servicesName: string[];
    date: string;
    timeStart: string;
    timeEnd: string;

}