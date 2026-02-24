import http from "../utils/http";

const createCategory = async (data) => {
    const response = await http.post("/category", data);
    return {
      id: response.data.id,
      name: response.data.name,
      description: response.data.description
    }
}

const getListCategories = async (param) => {
    const response = await http.get("/category", {
      params: param,
    });

    const payload = response.data;
    const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data?.items)
        ? payload.data.items
        : Array.isArray(payload?.data)
        ? payload.data
        : [];
    return list.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description
    }));
}

const getCategoryById = async (id) => {
    const response = await http.get(`/category/${id}`);
    return {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description
    }
}

const updateCategory = async (id, data) => {
    const response = await http.put(`/category/${id}`, data);
    return {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description
    }
}

const deleteCategory = async (id) => await http.delete(`/category/${id}`);

export const categoryApi = { createCategory, getListCategories, getCategoryById, updateCategory, deleteCategory };