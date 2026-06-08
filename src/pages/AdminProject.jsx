// FILE: src/pages/AdminProject.jsx

import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  FolderKanban,
  FileText,
  Globe,
  Eye,
} from "lucide-react";

import {
  addProject,
  deleteProject,
  updateProject,
  getAllProjects,
} from "../api/projectdb";

import {
  getAllCategories,
} from "../api/categorydb";

/* =========================================
   DEFAULT IMAGE
========================================= */

const DEFAULT_IMAGE =
  "https://ibps-so-it.web.app/static/media/course.224cfb65f934c2d40a3a.jpg";

/* =========================================
   MODAL
========================================= */

function ProjectModal({
  open,
  onClose,
  onSave,
  editData,
  categories,
}) {
  const [form, setForm] =
    useState({
      title: "",
      description: "",
      image: "",
      category: "",
      techStack: "",
      github: "",
      live: "",
      documentation: "",
      status: "In Progress",
    });

  /*
  |--------------------------------------------------------------------------
  | EDIT DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (editData) {
      setForm({
        title:
          editData.title || "",

        description:
          editData.description ||
          "",

        image:
          editData.image || "",

        category:
          editData.category ||
          "",

        techStack:
          editData.techStack ||
          "",

        github:
          editData.github || "",

        live:
          editData.live || "",

        documentation:
          editData.documentation ||
          "",

        status:
          editData.status ||
          "In Progress",
      });
    } else {
      setForm({
        title: "",
        description: "",
        image: "",
        category: "",
        techStack: "",
        github: "",
        live: "",
        documentation: "",
        status: "In Progress",
      });
    }
  }, [editData, open]);

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert(
        "Project title required"
      );

      return;
    }

    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 overflow-y-auto">

      <div className="min-h-screen flex items-start justify-center p-6">

        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl my-10">

          {/* HEADER */}

          <div className="sticky top-0 bg-white z-10 border-b px-6 py-5 flex items-center justify-between rounded-t-3xl">

            <h2 className="text-3xl font-black text-slate-800">

              {editData
                ? "Edit Project"
                : "Add Project"}

            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100"
            >
              <X />
            </button>

          </div>

          {/* BODY */}

          <div className="p-6 space-y-6">

            {/* TITLE */}

            <div>

              <label className="block mb-2 font-medium text-slate-700">
                Project Title
              </label>

              <input
                type="text"
                placeholder="Enter project title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="block mb-2 font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows="5"
                placeholder="Enter project description"
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none resize-none"
              />

            </div>

            {/* IMAGE */}

            <div>

              <label className="block mb-2 font-medium text-slate-700">
                Image URL
              </label>

              <input
                type="text"
                placeholder="Enter image url"
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              />

              <img
                src={
                  form.image ||
                  DEFAULT_IMAGE
                }
                onError={(e) => {
                  e.currentTarget.src =
                    DEFAULT_IMAGE;
                }}
                alt="preview"
                className="w-full h-64 object-cover rounded-3xl mt-5 border border-slate-200"
              />

            </div>

            {/* CATEGORY */}

            <div>

              <label className="block mb-2 font-medium text-slate-700">
                Category
              </label>

              <select
                value={
                  form.category
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    category:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              >

                <option value="">
                  Select Category
                </option>

                {categories.map(
                  (
                    category
                  ) => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.categoryName
                      }
                    </option>
                  )
                )}

              </select>

            </div>

            {/* TECH STACK */}

            <div>

              <label className="block mb-2 font-medium text-slate-700">
                Tech Stack
              </label>

              <input
                type="text"
                placeholder="React, Node, MongoDB"
                value={
                  form.techStack
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    techStack:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              />

            </div>

            {/* LINKS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block mb-2 font-medium text-slate-700">
                  Github URL
                </label>

                <input
                  type="text"
                  placeholder="Github link"
                  value={
                    form.github
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      github:
                        e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium text-slate-700">
                  Live URL
                </label>

                <input
                  type="text"
                  placeholder="Live project link"
                  value={form.live}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      live:
                        e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
                />

              </div>

            </div>

            {/* DOC */}

            <div>

              <label className="block mb-2 font-medium text-slate-700">
                Documentation
              </label>

              <textarea
                rows="6"
                placeholder="Write documentation..."
                value={
                  form.documentation
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    documentation:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none resize-none"
              />

            </div>

            {/* STATUS */}

            <div>

              <label className="block mb-2 font-medium text-slate-700">
                Project Status
              </label>

              <select
                value={
                  form.status
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    status:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              >

                <option>
                  In Progress
                </option>

                <option>
                  Completed
                </option>

                <option>
                  Pending
                </option>

              </select>

            </div>

          </div>

          {/* FOOTER */}

          <div className="sticky bottom-0 bg-white border-t px-6 py-5 flex justify-end gap-3 rounded-b-3xl">

            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-slate-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-5 py-3 rounded-2xl bg-slate-900 text-white"
            >

              {editData
                ? "Update"
                : "Save"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================
   MAIN COMPONENT
========================================= */

export default function AdminProject() {
  const [projects, setProjects] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filterCategory, setFilterCategory] =
    useState("all");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | FETCH PROJECTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects =
    async () => {
      try {
        setLoading(true);

        const response =
          await getAllProjects();

        if (
          response.success
        ) {
          setProjects(
            response.data || []
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | FETCH CATEGORIES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories =
    async () => {
      try {
        const response =
          await getAllCategories();

        if (response.success) {
          const activeCategories =
            response.data.filter(
              (item) =>
                item.status ===
                "active"
            );

          setCategories(
            activeCategories
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | CATEGORY MAP
  |--------------------------------------------------------------------------
  */

  const categoryMap = useMemo(
    () =>
      categories.reduce(
        (acc, category) => {
          acc[category.id] =
            category.categoryName;

          return acc;
        },
        {}
      ),
    [categories]
  );

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredProjects =
    useMemo(() => {
      return projects.filter(
        (item) => {
          const matchSearch =
            (
              item.title || ""
            )
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchCategory =
            filterCategory ===
            "all"
              ? true
              : item.category ===
                filterCategory;

          return (
            matchSearch &&
            matchCategory
          );
        }
      );
    }, [
      projects,
      search,
      filterCategory,
    ]);

  /*
  |--------------------------------------------------------------------------
  | SAVE
  |--------------------------------------------------------------------------
  */

  const handleSave =
    async (data) => {
      try {
        if (
          selectedProject
        ) {
          const response =
            await updateProject(
              selectedProject.id,
              data
            );

          if (
            response.success
          ) {
            setProjects(
              (prev) =>
                prev.map(
                  (item) =>
                    item.id ===
                    selectedProject.id
                      ? response.data
                      : item
                )
            );
          }
        } else {
          const response =
            await addProject(
              data
            );

          if (
            response.success
          ) {
            setProjects(
              (prev) => [
                response.data,
                ...prev,
              ]
            );
          }
        }

        setModalOpen(false);

        setSelectedProject(
          null
        );
      } catch (error) {
        alert(
          error.message ||
            "Project save failed"
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete =
    async (item) => {
      const confirmDelete =
        window.confirm(
          `Delete "${item.title}" project ?`
        );

      if (
        !confirmDelete
      ) {
        return;
      }

      try {
        const response =
          await deleteProject(
            item.id
          );

        if (
          response.success
        ) {
          setProjects(
            (prev) =>
              prev.filter(
                (project) =>
                  project.id !==
                  item.id
              )
          );
        }
      } catch (error) {
        alert(
          error.message ||
            "Delete failed"
        );
      }
    };

  return (
    <div className="p-6">

      {/* TOPBAR */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-4xl font-black text-slate-800">
            Projects
          </h1>

          <p className="text-slate-500 mt-2">
            Manage projects &
            documentation
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="pl-10 pr-4 py-3 rounded-2xl border border-slate-300 outline-none"
            />

          </div>

          {/* FILTER */}

          <select
            value={
              filterCategory
            }
            onChange={(e) =>
              setFilterCategory(
                e.target.value
              )
            }
            className="px-4 py-3 rounded-2xl border border-slate-300"
          >

            <option value="all">
              All Categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {
                    category.categoryName
                  }
                </option>
              )
            )}

          </select>

          {/* BUTTON */}

          <button
            onClick={() => {
              setSelectedProject(
                null
              );

              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl"
          >

            <Plus size={20} />

            Add Project

          </button>

        </div>

      </div>

      {/* LOADING */}

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center">

          <h2 className="text-3xl font-black text-slate-700">
            Loading...
          </h2>

        </div>
      ) : filteredProjects.length ===
        0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center">

          <h2 className="text-3xl font-black text-slate-700">
            No Projects Found
          </h2>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredProjects.map(
            (item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
              >

                <img
                  src={
                    item.image ||
                    DEFAULT_IMAGE
                  }
                  onError={(e) => {
                    e.currentTarget.src =
                      DEFAULT_IMAGE;
                  }}
                  alt={item.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <h2 className="text-2xl font-black text-slate-800">
                      {item.title}
                    </h2>

                    <FolderKanban
                      size={24}
                    />

                  </div>

                  <p className="text-slate-500 mt-3 line-clamp-3">
                    {
                      item.description
                    }
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">

                    <span className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
                      {categoryMap[
                        item.category
                      ] ||
                        "Category"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status ===
                        "Completed"
                          ? "bg-green-100 text-green-700"
                          : item.status ===
                            "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {
                        item.status
                      }
                    </span>

                  </div>

                  <div className="mt-5">

                    <h3 className="font-semibold text-slate-800 mb-2">
                      Tech Stack
                    </h3>

                    <p className="text-slate-500 text-sm">
                      {
                        item.techStack
                      }
                    </p>

                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">

                    <a
                      href={
                        item.live
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl"
                    >

                      <Globe
                        size={18}
                      />

                      Live

                    </a>

                    <a
                      href={
                        item.github
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 rounded-2xl"
                    >

                      <Globe
                        size={18}
                      />

                      Github

                    </a>

                  </div>

                  <button className="w-full mt-3 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-3 rounded-2xl">

                    <FileText
                      size={18}
                    />

                    Documentation

                  </button>

                  <button className="w-full mt-3 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-3 rounded-2xl">

                    <Eye size={18} />

                    Preview Details

                  </button>

                  <div className="flex items-center gap-3 mt-3">

                    <button
                      onClick={() => {
                        setSelectedProject(
                          item
                        );

                        setModalOpen(
                          true
                        );
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 py-3 rounded-2xl"
                    >

                      <Pencil
                        size={18}
                      />

                      Edit

                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          item
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-3 rounded-2xl"
                    >

                      <Trash2
                        size={18}
                      />

                      Delete

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

      <ProjectModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);

          setSelectedProject(
            null
          );
        }}
        onSave={handleSave}
        editData={
          selectedProject
        }
        categories={categories}
      />

    </div>
  );
}