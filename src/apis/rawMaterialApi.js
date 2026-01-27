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

const getListRawMaterials = async () => {
    const response = await http.get("/material");
    return response.data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        importPrice: item.importPrice
    }));
}

const getRawMaterialById = async (id) => {
    const response = await http.get(`/material/${id}`);
    return {
        id: response.data.id,
        name: response.data.name,
        quantity: response.data.quantity,
        importPrice: response.data.importPrice
    }
}
export const rawMaterialApi = { createRawMaterial, getListRawMaterials, getRawMaterialById };