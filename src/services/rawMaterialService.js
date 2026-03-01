import { rawMaterialApi } from "../apis/rawMaterialApi";
import api from "../apis/axiosClient";
const createRawMaterial = async ({ name, quantity, importPrice }) => {
  return await rawMaterialApi.createRawMaterial({
    name,
    quantity,
    importPrice,
  });
};

const getListRawMaterials = async (params) => {
  return await rawMaterialApi.getListRawMaterials(params);
};

const getRawMaterialById = async (id) => {
  return await rawMaterialApi.getRawMaterialById(id);
};

const updateRawMaterial = async (id, { name, quantity, importPrice }) => {
  return await rawMaterialApi.updateRawMaterial(id, {
    name,
    quantity,
    importPrice,
  });
};

export const getAllRawMaterial = () =>
  api.get("/material", {
    params: {
      page: 0,
      size: 100,
      sort: "createdAt,desc",
    },
  });

const deleteRawMaterial = async (id) =>
  await rawMaterialApi.deleteRawMaterial(id);

export const rawMaterialService = {
  createRawMaterial,
  getListRawMaterials,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
};
