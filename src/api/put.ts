import api from "./axios";

export const updateAditianalInformationToAppointment = async (payload: any) => {
    const response = await api.put(`/api/Appointment/doctor/additional-information`, payload);
    return response.data;
};

export const updateDoctorWeekSchedule = async (payload: any) => {
    const response = await api.put(`/api/Doctor/week-scheme`, payload);
    return response.data;
}

export const updateTeethModel = async (payload: any) => {
    const response = await api.put(`/api/Tooth/teeth-model`, payload);
    return response.data;
}

export  const updateUserDetails = async (payload: any) => {
    const response = await api.put(`/api/User/edit`, payload);
    return response.data;
}

export const updateAppointmentStatus = async (payload: any) => {
    const response = await api.put(`/api/Appointment/appointment-status`, payload);
    return response.data;
}

export const updateService = async (payload: any, serviceId: number) => {
    const response = await api.put(`/api/Service/editService/${serviceId}`, payload);
    return response.data;
}

export default {
    updateAditianalInformationToAppointment,
    updateDoctorWeekSchedule,
    updateTeethModel,
    updateUserDetails,
    updateAppointmentStatus,
    updateService,
};