import http from "../utils/http";

const createRawMaterial = async (data) => {
  const response = await http.post("/materials", data);
  return {
    id: response.data.data.id,
    name: response.data.data.name,
    quantity: response.data.data.quantity,
    importPrice: response.data.data.importPrice
  }
}

const getListRawMaterials = async () => {
    const response = await http.get("/materials");
    return response.data.data.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        importPrice: item.importPrice
    }));
}

const getRawMaterialById = async (id) => {
    const response = await http.get(`/materials/${id}`);
    return {
        id: response.data.data.id,
        name: response.data.data.name,
        quantity: response.data.data.quantity,
        importPrice: response.data.data.importPrice
    }
}
export const rawMaterialApi = { createRawMaterial, getListRawMaterials, getRawMaterialById };