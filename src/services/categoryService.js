import { categoryApi } from "../apis/categoryApi";

const createCategory = async (name, description) => {
  return await categoryApi.createCategory({ name, description });
}

const getListCategories = async (params) => {
    return await categoryApi.getListCategories(params);
}

const getCategoryById = async (id) => {
    return await categoryApi.getCategoryById(id);
}

const updateCategory = async (id, {name, description}) => {
    return await categoryApi.updateCategory(id, {name, description});
}

const deleteCategory = async (id) => await categoryApi.deleteCategory(id)

export const categoryService = { createCategory, getListCategories, getCategoryById, updateCategory, deleteCategory };