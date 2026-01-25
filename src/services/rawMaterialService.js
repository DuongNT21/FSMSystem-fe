import { rawMaterialApi } from "../apis/rawMaterialApi";

const createRawMaterial = async ({name, quantity, importPrice}) => {
  return await rawMaterialApi.createRawMaterial({name, quantity, importPrice});
}

const getListRawMaterials = async () => {
    return await rawMaterialApi.getListRawMaterials();
}

const getRawMaterialById = async (id) => {
    return await rawMaterialApi.getRawMaterialById(id);
}

export const rawMaterialService = { createRawMaterial, getListRawMaterials, getRawMaterialById };