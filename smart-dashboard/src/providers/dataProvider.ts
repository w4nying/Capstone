import { DataProvider } from 'react-admin';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const httpClient = axios.create({
  baseURL: apiUrl,
});

const normalizeRecord = (record: any) => {
  if (!record || typeof record !== 'object') return record;

  return {
    ...record,
    id:
      record.id !== undefined && record.id !== null && record.id !== ''
        ? Number(record.id)
        : record.id,
  };
};

const toSearchableString = (value: unknown) =>
  String(value ?? '').toLowerCase().trim();

const applyUserFilters = (items: any[], filter: Record<string, any>) => {
  let filtered = [...items];

  if (filter.q) {
    const q = toSearchableString(filter.q);
    filtered = filtered.filter((item) =>
      [
        item.id,
        item.username,
        item.fullName,
        item.email,
        item.department,
        item.role,
        item.status,
      ]
        .filter(Boolean)
        .some((value) => toSearchableString(value).includes(q))
    );
  }

  if (filter.role) {
    filtered = filtered.filter(
      (item) => toSearchableString(item.role) === toSearchableString(filter.role)
    );
  }

  if (filter.status) {
    filtered = filtered.filter(
      (item) => toSearchableString(item.status) === toSearchableString(filter.status)
    );
  }

  if (filter.department) {
    filtered = filtered.filter(
      (item) =>
        toSearchableString(item.department) === toSearchableString(filter.department)
    );
  }

  return filtered;
};

const applyAnalyticsFilters = (items: any[], filter: Record<string, any>) => {
  let filtered = [...items];

  if (filter.q) {
    const q = toSearchableString(filter.q);
    filtered = filtered.filter((item) =>
      [
        item.id,
        item.name,
        item.category,
        item.status,
        item.trend,
        item.value,
        item.target,
        item.updatedAt,
      ]
        .filter((value) => value !== undefined && value !== null)
        .some((value) => toSearchableString(value).includes(q))
    );
  }

  if (filter.category) {
    filtered = filtered.filter(
      (item) =>
        toSearchableString(item.category) === toSearchableString(filter.category)
    );
  }

  if (filter.status) {
    filtered = filtered.filter(
      (item) => toSearchableString(item.status) === toSearchableString(filter.status)
    );
  }

  return filtered;
};

const applyReportsFilters = (items: any[], filter: Record<string, any>) => {
  let filtered = [...items];

  if (filter.q) {
    const q = toSearchableString(filter.q);
    filtered = filtered.filter((item) =>
      [
        item.id,
        item.title,
        item.type,
        item.status,
        item.author,
        item.department,
        item.date,
        item.summary,
      ]
        .filter((value) => value !== undefined && value !== null)
        .some((value) => toSearchableString(value).includes(q))
    );
  }

  if (filter.type) {
    filtered = filtered.filter(
      (item) => toSearchableString(item.type) === toSearchableString(filter.type)
    );
  }

  if (filter.status) {
    filtered = filtered.filter(
      (item) => toSearchableString(item.status) === toSearchableString(filter.status)
    );
  }

  if (filter.department) {
    filtered = filtered.filter(
      (item) =>
        toSearchableString(item.department) === toSearchableString(filter.department)
    );
  }

  return filtered;
};

const applyGenericFilters = (items: any[], filter: Record<string, any>) => {
  let filtered = [...items];

  Object.entries(filter).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (key === 'q') {
      const q = toSearchableString(value);
      filtered = filtered.filter((item) =>
        Object.values(item).some((fieldValue) =>
          toSearchableString(fieldValue).includes(q)
        )
      );
      return;
    }

    filtered = filtered.filter(
      (item) => toSearchableString(item[key]) === toSearchableString(value)
    );
  });

  return filtered;
};

const applyResourceFilters = (
  resource: string,
  items: any[],
  filter: Record<string, any>
) => {
  switch (resource) {
    case 'users':
      return applyUserFilters(items, filter);
    case 'analytics':
      return applyAnalyticsFilters(items, filter);
    case 'reports':
      return applyReportsFilters(items, filter);
    default:
      return applyGenericFilters(items, filter);
  }
};

const compareValues = (aVal: any, bVal: any, order: 'ASC' | 'DESC') => {
  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return order === 'ASC' ? -1 : 1;
  if (bVal == null) return order === 'ASC' ? 1 : -1;

  const aDate = Date.parse(String(aVal));
  const bDate = Date.parse(String(bVal));
  const aLooksLikeDate = !Number.isNaN(aDate);
  const bLooksLikeDate = !Number.isNaN(bDate);

  if (aLooksLikeDate && bLooksLikeDate) {
    return order === 'ASC' ? aDate - bDate : bDate - aDate;
  }

  const aNum = Number(aVal);
  const bNum = Number(bVal);
  const aLooksLikeNumber =
    aVal !== '' && aVal !== null && aVal !== undefined && !Number.isNaN(aNum);
  const bLooksLikeNumber =
    bVal !== '' && bVal !== null && bVal !== undefined && !Number.isNaN(bNum);

  if (aLooksLikeNumber && bLooksLikeNumber) {
    return order === 'ASC' ? aNum - bNum : bNum - aNum;
  }

  const aStr = toSearchableString(aVal);
  const bStr = toSearchableString(bVal);

  if (aStr < bStr) return order === 'ASC' ? -1 : 1;
  if (aStr > bStr) return order === 'ASC' ? 1 : -1;
  return 0;
};

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    try {
      const allResponse = await httpClient.get(`/${resource}`);
      const allItems = allResponse.data ?? [];

      const filter = params.filter || {};
      const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
      const { field, order } = params.sort || { field: 'id', order: 'ASC' };

      let filteredData = applyResourceFilters(resource, [...allItems], filter);

      const total = filteredData.length;

      filteredData.sort((a, b) => compareValues(a[field], b[field], order));

      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedData = filteredData.slice(start, end);

      return {
        data: paginatedData,
        total,
      };
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
    const filtered = data.filter((item: any) => item[params.target] === params.id);
    return { data: filtered, total: filtered.length };
  },

  create: async (resource, params) => {
    const payload = normalizeRecord(params.data);
    const { data } = await httpClient.post(`/${resource}`, payload);
    return { data };
  },

  update: async (resource, params) => {
    const payload = normalizeRecord(params.data);
    const { data } = await httpClient.put(`/${resource}/${params.id}`, payload);
    return { data };
  },

  updateMany: async (resource, params) => {
    const payload = normalizeRecord(params.data);
    await Promise.all(
      params.ids.map((id) => httpClient.put(`/${resource}/${id}`, payload))
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