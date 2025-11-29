export interface IApiAppointment {
    id: number;
    user: {
        id: number;
        name: string;
        surname: string;
        email: string;
        phoneNumber: string;
    };
    doctorBlock: {
        user: {
            id: number;
            name: string;
            surname: string;
            email: string;
            phoneNumber: string;
        },
        doctorBlockId: number;
        timeStart: string;
        timeEnd: string;
        isAvailable: boolean;
    }
    services: {
        id: number;
        lowPrice: number| null;
        highPrice: number| null;
        minTime: number;
        languageCode: string;
        name: string;
        description: string | null;
    }[]
    status: string;
}