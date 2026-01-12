import api from "./axios";
import type { Cancellation } from "../Interfaces/Cancellation";

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

export const updateUserById = async(userId: number, dto: any) => {
    const response = await api.put(`/api/User/edit/${userId}`, dto);
    return response.data;
}

export const cancellation = async(payload: Cancellation) => {
    const response = await api.put(`/api/Appointment/cancel-appointment`,payload);
    return response.data;
}
export const completeAppointment = async(payload: any) => {
    const response = await api.put(`/api/Appointment/complete-appointment`, payload);
    return response.data;
}

export default {
    updateAditianalInformationToAppointment,
    updateDoctorWeekSchedule,
    updateTeethModel,
    updateUserDetails,
    updateAppointmentStatus,
    updateService,
    updateUserById,
    cancellation,
    completeAppointment
};