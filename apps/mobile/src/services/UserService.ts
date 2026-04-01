import axiosClient from "@/api/axiosClient";

const UserService = {
  async findById(id: string) {
    const { data } = await axiosClient.get(`/users/${id}`);
    return data;
  },

  async findByCode(code: string) {
    const { data } = await axiosClient.get(`/users/code/${code}`);
    return data;
  },

  async update(id: string, payload: any) {
    const { data } = await axiosClient.put(`/users/${id}`, payload);
    return data;
  },
};

export default UserService;
