// src/services/category.service.js

import {
  ref,
  push,
  set,
  get,
  update,
  remove,
} from "firebase/database";

import { db } from "../firebase";

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export const createCategory = async (category) => {
  try {
    const categoryRef = push(ref(db, "categories"));

    const newCategory = {
      id: categoryRef.key,
      categoryName: category.categoryName || "",
      description: category.description || "",
      categoryImage: category.categoryImage || "",
      status: category.status || "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(categoryRef, newCategory);

    return {
      success: true,
      message: "Category created successfully",
      data: newCategory,
    };
  } catch (error) {
    console.error("Create Category Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/*
|--------------------------------------------------------------------------
| Get All Categories
|--------------------------------------------------------------------------
*/

export const getAllCategories = async () => {
  try {
    const snapshot = await get(ref(db, "categories"));

    if (!snapshot.exists()) {
      return {
        success: true,
        data: [],
      };
    }

    const data = snapshot.val();

    const categories = Object.values(data);

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Get Categories Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/*
|--------------------------------------------------------------------------
| Get Category By Id
|--------------------------------------------------------------------------
*/

export const getCategoryById = async (id) => {
  try {
    const snapshot = await get(ref(db, `categories/${id}`));

    if (!snapshot.exists()) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    return {
      success: true,
      data: snapshot.val(),
    };
  } catch (error) {
    console.error("Get Category Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/

export const updateCategory = async (id, updatedCategory) => {
  try {
    const categoryRef = ref(db, `categories/${id}`);

    const snapshot = await get(categoryRef);

    if (!snapshot.exists()) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    const updatedData = {
      ...snapshot.val(),
      ...updatedCategory,
      updatedAt: Date.now(),
    };

    await update(categoryRef, updatedData);

    return {
      success: true,
      message: "Category updated successfully",
      data: updatedData,
    };
  } catch (error) {
    console.error("Update Category Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
*/

export const deleteCategory = async (id) => {
  try {
    const categoryRef = ref(db, `categories/${id}`);

    const snapshot = await get(categoryRef);

    if (!snapshot.exists()) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    await remove(categoryRef);

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error) {
    console.error("Delete Category Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/*
|--------------------------------------------------------------------------
| Search Categories
|--------------------------------------------------------------------------
*/

export const searchCategories = async (keyword) => {
  try {
    const snapshot = await get(ref(db, "categories"));

    if (!snapshot.exists()) {
      return {
        success: true,
        data: [],
      };
    }

    const data = snapshot.val();

    const categories = Object.values(data);

    const filtered = categories.filter((item) =>
      item.categoryName
        ?.toLowerCase()
        .includes(keyword.toLowerCase())
    );

    return {
      success: true,
      data: filtered,
    };
  } catch (error) {
    console.error("Search Category Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/*
|--------------------------------------------------------------------------
| Change Category Status
|--------------------------------------------------------------------------
*/

export const changeCategoryStatus = async (
  id,
  status
) => {
  try {
    const categoryRef = ref(db, `categories/${id}`);

    await update(categoryRef, {
      status,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: "Status updated successfully",
    };
  } catch (error) {
    console.error("Status Update Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};