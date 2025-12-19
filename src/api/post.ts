import api from "./axios";

export const bookAppointmentGuest = async (payload: any) => {
    const response = await api.post(`/api/Appointment/guest/appointment`, payload);
    return response.data;
};

export const bookAppointmentRegistered = async (payload: any) => {
    const response = await api.post(`/api/Appointment/registered/appointment`, payload);
    return response.data;
};

export const addAdditionalInformation = async (payload: any) => {
    const response = await api.post(`/api/Appointment/doctor/additional-information`, payload);
    return response.data;
};

export const registerUser = async (payload: any) => {
    const response = await api.post(`/api/auth/register`, payload);
    return response.data;
}

export const loginUser = async (payload: any) => {
    const response = await api.post(`/api/auth/login`, payload);
    return response.data;
}

export const refreshToken = async (payload: any) => {
    const response = await api.post(`/api/auth/refresh`, payload);
    return response.data;
}

export const forgotPassword = async (payload: any) => {
    const response = await api.post(`/api/auth/forgot-password`, payload);
    return response.data;
}

export const resetPassword = async (payload: any) => {
    const response = await api.post(`/api/auth/reset-password`, payload);
    return response.data;
}

export const addDoctor = async (payload: any) => {
    const response = await api.post(`/api/Doctor/doctor`, payload);
    return response.data;
}

export const addService = async (payload: any) => {
    const response = await api.post(`/api/Service/service`, payload);
    return response.data;
}

export const bookAppointmentReceptionist = async (payload: any) => {
    const response = await api.post(`/api/Appointment/receptionist/appointment`, payload);
    return response.data;
}

export default {
    bookAppointmentGuest,
    bookAppointmentRegistered,
    addAdditionalInformation,
    registerUser,
    loginUser,
    refreshToken,
    forgotPassword,
    resetPassword,
    addDoctor,
    addService,
    bookAppointmentReceptionist,
};
