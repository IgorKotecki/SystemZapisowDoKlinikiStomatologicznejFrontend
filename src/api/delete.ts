import api from "./axios";

export const deleteService = async (serviceId: any) => {
    const response = await api.delete(`/api/Service/service/${serviceId}`) ;
    return response.data;
}

export const deleteUser = async (userId: any) =>{
    const response = await api.delete(`/api/User/delete/${userId}`);
    return response.data;
}

export default {
    deleteService,
    deleteUser,
};