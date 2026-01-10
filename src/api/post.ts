import api from "./axios";
import get from "./get";

export const bookAppointmentGuest = async (payload: any) => {
    const response = await api.post(`/api/Appointment/guest/appointment`, payload);
    return response.data;
};

export const bookAppointmentRegistered = async (payload: any) => {
    const response = await api.post(`/api/Appointment/registered/appointment`, payload);
    return response.data;
};

export const addAdditionalInformation = async (payload: any) => {
    const response = await api.post(`/api/additional-information`, payload);
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

export const addNewService = async (payload: any) => {
    const response = await api.post(`/api/Service/service`, payload);
    return response.data;
}

export const updatePhoto = async (file: File) =>{
    const { signature, timestamp, cloudName, apiKey } = await get.getCloudinarySignature();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );
    if (!response.ok) throw new Error("Cloudinary upload failed");
    const data = await response.json();
    return data.secure_url;
}
export const createNewWorkingHours = async (payload: any) => {
    const response = await api.post(`/api/time-blocks/working-hours`, payload);
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
    updatePhoto ,
    addNewService,
    createNewWorkingHours,
};
