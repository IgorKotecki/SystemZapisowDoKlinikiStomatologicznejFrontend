import api from "./axios";

export const deleteService = async (serviceId: any) => {
    const response = await api.delete(`/api/Service/service/${serviceId}`) ;
    return response.data;
}

export const deleteUser = async (userId: any) =>{
    const response = await api.delete(`/api/User/delete/${userId}`);
    return response.data;
}
export const deleteWorkingHours = async (date: string) => {
    const response = await api.delete(`/api/time-blocks/working-hours`, {
        params: {
            date: date,
        },
    });
    return response.data;
}
export const deleteAdditionalInformation = async (infoId: number) => {
    const response = await api.delete(`/api/additional-information/${infoId}`);
    return response.data;
}

export default {
    deleteService,
    deleteUser,
    deleteWorkingHours,
    deleteAdditionalInformation
};