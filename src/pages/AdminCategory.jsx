import { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../api/categorydb";

function CategoryModal({
  open,
  onClose,
  onSave,
  editData,
}) {
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
    categoryImage: "",
    status: "active",
  });

  useEffect(() => {
    setForm({
      categoryName: editData?.categoryName || "",
      description: editData?.description || "",
      categoryImage: editData?.categoryImage || "",
      status: editData?.status || "active",
    });
  }, [editData, open]);

  const handleSubmit = () => {
    if (!form.categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-2xl font-bold text-slate-800">
            {editData
              ? "Edit Category"
              : "Add Category"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name"
              value={form.categoryName}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoryName: e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Enter description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Image URL
            </label>

            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={form.categoryImage}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoryImage: e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.status === "active"}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.checked
                    ? "active"
                    : "inactive",
                })
              }
            />

            <span className="text-slate-700 font-medium">
              Active
            </span>
          </div>
        </div>

        <div className="p-5 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-slate-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white"
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [sortOrder, setSortOrder] =
    useState("latest");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedRows, setSelectedRows] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;

  /*
  |--------------------------------------------------------------------------
  | Fetch Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await getAllCategories();

      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Filter Categories
  |--------------------------------------------------------------------------
  */

  const filteredCategories = useMemo(() => {
    const searchValue = search.toLowerCase();

    return categories
      .filter((item) =>
        (item.categoryName || "")
          .toLowerCase()
          .includes(searchValue)
      )

      .filter((item) =>
        statusFilter === "all"
          ? true
          : item.status === statusFilter
      )

      .sort((a, b) => {
        const first = Number(a.createdAt || 0);

        const second = Number(b.createdAt || 0);

        return sortOrder === "latest"
          ? second - first
          : first - second;
      });
  }, [
    categories,
    search,
    statusFilter,
    sortOrder,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCategories.length / itemsPerPage
    )
  );

  const paginatedCategories =
    filteredCategories.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  /*
  |--------------------------------------------------------------------------
  | Save Category
  |--------------------------------------------------------------------------
  */

  const handleSave = async (data) => {
    try {
      setLoading(true);

      if (selectedCategory) {
        const response = await updateCategory(
          selectedCategory.id,
          data
        );

        if (response.success) {
          setCategories((prev) =>
            prev.map((item) =>
              item.id === selectedCategory.id
                ? response.data
                : item
            )
          );
        }
      } else {
        const response = await createCategory(
          data
        );

        if (response.success) {
          setCategories((prev) => [
            response.data,
            ...prev,
          ]);
        }
      }

      setModalOpen(false);

      setSelectedCategory(null);
    } catch (error) {
      console.error(error);

      alert("Category save failed");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Category
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (category) => {
    try {
      const response = await deleteCategory(
        category.id
      );

      if (response.success) {
        setCategories((prev) =>
          prev.filter(
            (item) => item.id !== category.id
          )
        );
      }
    } catch (error) {
      console.error(error);

      alert("Delete failed");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Bulk Delete
  |--------------------------------------------------------------------------
  */

  const handleBulkDelete = async () => {
    try {
      setLoading(true);

      for (const id of selectedRows) {
        await deleteCategory(id);
      }

      setCategories((prev) =>
        prev.filter(
          (item) =>
            !selectedRows.includes(item.id)
        )
      );

      setSelectedRows([]);
    } catch (error) {
      console.error(error);

      alert("Bulk delete failed");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Row Selection
  |--------------------------------------------------------------------------
  */

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows((prev) =>
      prev.length ===
      paginatedCategories.length
        ? []
        : paginatedCategories.map(
            (item) => item.id
          )
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Categories
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your categories
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="px-4 py-3 rounded-xl border border-slate-300"
          >
            <option value="all">All</option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
            className="px-4 py-3 rounded-xl border border-slate-300"
          >
            <option value="latest">
              Latest
            </option>

            <option value="oldest">
              Oldest
            </option>
          </select>

          {selectedRows.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-5 py-3 rounded-xl bg-red-500 text-white"
            >
              Delete Selected
            </button>
          )}

          <button
            onClick={() => {
              setSelectedCategory(null);

              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl"
          >
            <Plus size={20} />

            Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length ===
                        paginatedCategories.length &&
                      paginatedCategories.length >
                        0
                    }
                    onChange={toggleSelectAll}
                  />
                </th>

                <th className="text-left p-4">
                  Image
                </th>

                <th className="text-left p-4">
                  Name
                </th>

                <th className="text-left p-4">
                  Status
                </th>

                <th className="text-left p-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-10"
                  >
                    Loading...
                  </td>
                </tr>
              ) : paginatedCategories.length >
                0 ? (
                paginatedCategories.map(
                  (category) => (
                    <tr
                      key={category.id}
                      className="border-t"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(
                            category.id
                          )}
                          onChange={() =>
                            toggleRowSelection(
                              category.id
                            )
                          }
                        />
                      </td>

                      <td className="p-4">
                        <img
                          src={
                            category.categoryImage ||
                            "https://via.placeholder.com/60"
                          }
                          alt={
                            category.categoryName
                          }
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      </td>

                      <td className="p-4">
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {
                              category.categoryName
                            }
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            {
                              category.description
                            }
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            category.status ===
                            "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {category.status ===
                          "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedCategory(
                                category
                              );

                              setModalOpen(
                                true
                              );
                            }}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                category
                              )
                            }
                            className="p-2 rounded-lg bg-red-100 text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-10 text-slate-500"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <p className="text-slate-500">
          Page {currentPage} of {totalPages}
        </p>

        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                (prev) => prev - 1
              )
            }
            className="p-3 rounded-xl border disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev + 1
              )
            }
            className="p-3 rounded-xl border disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);

          setSelectedCategory(null);
        }}
        onSave={handleSave}
        editData={selectedCategory}
      />
    </div>
  );
}