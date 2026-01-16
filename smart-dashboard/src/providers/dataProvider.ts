import { DataProvider } from 'react-admin';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const httpClient = axios.create({
  baseURL: apiUrl,
});

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    try {
      const allResponse = await httpClient.get(`/${resource}`);
      const allItems = allResponse.data;
      const total = allItems.length;

      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const { field, order } = params.sort || { field: 'id', order: 'ASC' };

      let sortedData = [...allItems];
      if (field) {
        sortedData.sort((a, b) => {
          const aVal = a[field];
          const bVal = b[field];
          if (aVal < bVal) return order === 'ASC' ? -1 : 1;
          if (aVal > bVal) return order === 'ASC' ? 1 : -1;
          return 0;
        });
      }

      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedData = sortedData.slice(start, end);

      return { data: paginatedData, total: total };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { data: [], total: 0 };
      }
      throw error;
    }
  },
  getOne: async (resource, params) => {
    const { data } = await httpClient.get(`/${resource}/${params.id}`);
    return { data };
  },
  getMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) => httpClient.get(`/${resource}/${id}`))
    );
    return { data: responses.map((response) => response.data) };
  },
  getManyReference: async (resource, params) => {
    const { data } = await httpClient.get(`/${resource}`);
    const filtered = data.filter(
      (item: any) => item[params.target] === params.id
    );
    return { data: filtered, total: filtered.length };
  },
  create: async (resource, params) => {
    const { data } = await httpClient.post(`/${resource}`, params.data);
    return { data };
  },
  update: async (resource, params) => {
    const { data } = await httpClient.put(`/${resource}/${params.id}`, params.data);
    return { data };
  },
  updateMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) => httpClient.put(`/${resource}/${id}`, params.data))
    );
    return { data: params.ids };
  },
  delete: async (resource, params) => {
    await httpClient.delete(`/${resource}/${params.id}`);
    return { data: params.previousData as any };
  },
  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) => httpClient.delete(`/${resource}/${id}`))
    );
    return { data: params.ids };
  },
};

export { httpClient };