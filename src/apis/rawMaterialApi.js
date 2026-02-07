import http from "../utils/http";

const createRawMaterial = async (data) => {
  const response = await http.post("/material", data);
  return {
    id: response.data.id,
    name: response.data.name,
    quantity: response.data.quantity,
    importPrice: response.data.importPrice
  }
}

const getListRawMaterials = async (param) => {
  const response = await http.get("/material", {
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
    quantity: item.quantity ?? 0,
    importPrice: item.importPrice ?? 0,
  }));
};


const getRawMaterialById = async (id) => {
    const response = await http.get(`/material/${id}`);
    return {
      id: response.data.id,
      name: response.data.name,
      quantity: response.data.quantity,
      importPrice: response.data.importPrice
    }
}

const updateRawMaterial = async (id, data) => {
    const response = await http.put(`/material/${id}`, data);
    return {
      id: response.data.id,
      name: response.data.name,
      quantity: response.data.quantity,
      importPrice: response.data.importPrice
    }
}

const deleteRawMaterial = async (id) => await http.delete(`/material/${id}`);

export const rawMaterialApi = { createRawMaterial, getListRawMaterials, getRawMaterialById, updateRawMaterial, deleteRawMaterial };