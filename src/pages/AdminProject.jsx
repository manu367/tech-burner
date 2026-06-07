import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  FolderKanban,
  FileText,
  Github,
  Globe,
  Eye,
} from "lucide-react";

/* =========================================
   DEFAULT IMAGE
========================================= */

const DEFAULT_IMAGE =
  "https://ibps-so-it.web.app/static/media/course.224cfb65f934c2d40a3a.jpg";

/* =========================================
   CATEGORY OPTIONS
========================================= */

const categoryOptions = [
  "Frontend",
  "Backend",
  "Full Stack",
  "AI",
  "Mobile App",
  "UI/UX",
];

/* =========================================
   ADD / EDIT PROJECT MODAL
========================================= */

function ProjectModal({
  open,
  onClose,
  onSave,
  editData,
}) {

  const [form, setForm] = useState({
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

  /* LOAD EDIT DATA */
  useEffect(() => {

    if (editData) {

      setForm({
        title: editData.title,
        description:
          editData.description,
        image: editData.image,
        category:
          editData.category,
        techStack:
          editData.techStack,
        github: editData.github,
        live: editData.live,
        documentation:
          editData.documentation,
        status: editData.status,
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

  }, [editData]);

  /* SAVE */
  const handleSubmit = () => {

    if (!form.title.trim()) return;

    onSave({
      id: editData
        ? editData.id
        : Date.now(),

      createdAt: editData
        ? editData.createdAt
        : new Date(),

      ...form,
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/40
        overflow-y-auto
        p-4
      "
    >

      <div
        className="
          min-h-full
          flex items-start justify-center
          py-10
        "
      >

        <div
          className="
            bg-white
            w-full max-w-3xl
            rounded-3xl shadow-xl
          "
        >

          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b">

            <h2 className="text-2xl font-bold text-slate-800">

              {editData
                ? "Edit Project"
                : "Add Project"}

            </h2>

            <button onClick={onClose}>
              <X />
            </button>

          </div>

          {/* BODY */}
          <div className="p-6 space-y-6">

            {/* TITLE */}
            <div>

              <label className="block mb-2 font-medium">
                Project Title
              </label>

              <input
                type="text"
                placeholder="Enter project title"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none
                "
              />

            </div>

            {/* DESCRIPTION */}
            <div>

              <label className="block mb-2 font-medium">
                Description
              </label>

              <textarea
                rows="4"
                placeholder="Enter project description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none resize-none
                "
              />

            </div>

            {/* IMAGE */}
            <div>

              <label className="block mb-2 font-medium">
                Image URL
              </label>

              <input
                type="text"
                placeholder="Enter image url"
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value,
                  })
                }
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none
                "
              />

              <img
                src={
                  form.image ||
                  DEFAULT_IMAGE
                }

                onError={(e) => {
                  e.target.src =
                    DEFAULT_IMAGE;
                }}

                alt="preview"

                className="
                  w-full h-56 object-cover
                  rounded-2xl mt-4
                "
              />

            </div>

            {/* CATEGORY */}
            <div>

              <label className="block mb-2 font-medium">
                Category
              </label>

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category:
                      e.target.value,
                  })
                }
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none
                "
              >

                <option value="">
                  Select Category
                </option>

                {categoryOptions.map(
                  (category, index) => (

                    <option
                      key={index}
                      value={category}
                    >

                      {category}

                    </option>
                  )
                )}

              </select>

            </div>

            {/* TECH STACK */}
            <div>

              <label className="block mb-2 font-medium">
                Tech Stack
              </label>

              <input
                type="text"
                placeholder="React, Node, MongoDB"
                value={form.techStack}
                onChange={(e) =>
                  setForm({
                    ...form,
                    techStack:
                      e.target.value,
                  })
                }
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none
                "
              />

            </div>

            {/* GITHUB */}
            <div>

              <label className="block mb-2 font-medium">
                Github URL
              </label>

              <input
                type="text"
                placeholder="Github link"
                value={form.github}
                onChange={(e) =>
                  setForm({
                    ...form,
                    github:
                      e.target.value,
                  })
                }
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none
                "
              />

            </div>

            {/* LIVE */}
            <div>

              <label className="block mb-2 font-medium">
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
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none
                "
              />

            </div>

            {/* DOCS */}
            <div>

              <label className="block mb-2 font-medium">
                Documentation
              </label>

              <textarea
                rows="5"
                placeholder="Write documentation..."
                value={form.documentation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    documentation:
                      e.target.value,
                  })
                }
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none resize-none
                "
              />

            </div>

            {/* STATUS */}
            <div>

              <label className="block mb-2 font-medium">
                Project Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status:
                      e.target.value,
                  })
                }
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none
                "
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
          <div className="p-6 border-t flex justify-end gap-3">

            <button
              onClick={onClose}
              className="
                px-5 py-3 rounded-xl
                border border-slate-300
              "
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="
                px-5 py-3 rounded-xl
                bg-slate-900 text-white
              "
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
   DELETE MODAL
========================================= */

function DeleteModal({
  open,
  onClose,
  onDelete,
}) {

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/40
        flex items-center justify-center
        p-4
      "
    >

      <div className="bg-white w-full max-w-md rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-4">
          Delete Project
        </h2>

        <p className="text-slate-600 mb-6">
          Are you sure you want to delete this project?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="
              px-5 py-2 rounded-xl
              border border-slate-300
            "
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="
              px-5 py-2 rounded-xl
              bg-red-500 text-white
            "
          >
            Delete
          </button>

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

  const [search, setSearch] =
    useState("");

  const [filterCategory, setFilterCategory] =
    useState("all");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [selectedProject, setSelectedProject] =
    useState(null);

  /* FILTER */
  const filteredProjects = useMemo(() => {

    return projects.filter((item) => {

      const matchSearch =
        item.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchCategory =
        filterCategory === "all"
          ? true
          : item.category ===
            filterCategory;

      return (
        matchSearch &&
        matchCategory
      );
    });

  }, [
    projects,
    search,
    filterCategory,
  ]);

  /* SAVE */
  const handleSave = (data) => {

    const exists = projects.find(
      (item) => item.id === data.id
    );

    if (exists) {

      setProjects(
        projects.map((item) =>
          item.id === data.id
            ? data
            : item
        )
      );

    } else {

      setProjects([
        data,
        ...projects,
      ]);
    }
  };

  /* EDIT */
  const handleEdit = (item) => {

    setSelectedProject(item);

    setModalOpen(true);
  };

  /* DELETE */
  const handleDeleteClick = (item) => {

    setSelectedProject(item);

    setDeleteModal(true);
  };

  const handleDelete = () => {

    setProjects(
      projects.filter(
        (item) =>
          item.id !== selectedProject.id
      )
    );

    setDeleteModal(false);
  };

  return (
    <div>

      {/* TOPBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Projects
          </h1>

          <p className="text-slate-500 mt-1">
            Manage your projects & documentation
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          {/* SEARCH */}
          <div className="relative">

            <Search
              size={18}
              className="
                absolute left-3 top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                pl-10 pr-4 py-3 rounded-xl
                border border-slate-300
                outline-none
              "
            />

          </div>

          {/* FILTER */}
          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(
                e.target.value
              )
            }
            className="
              px-4 py-3 rounded-xl
              border border-slate-300
            "
          >

            <option value="all">
              All Categories
            </option>

            {categoryOptions.map(
              (category, index) => (

                <option
                  key={index}
                  value={category}
                >

                  {category}

                </option>
              )
            )}

          </select>

          {/* ADD BUTTON */}
          <button
            onClick={() => {
              setSelectedProject(null);
              setModalOpen(true);
            }}
            className="
              flex items-center gap-2
              bg-slate-900 text-white
              px-5 py-3 rounded-xl
            "
          >

            <Plus size={20} />

            Add Project

          </button>

        </div>

      </div>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredProjects.map((item) => (

          <div
            key={item.id}
            className="
              bg-white rounded-3xl
              overflow-hidden
              border border-slate-200
              shadow-sm
            "
          >

            {/* IMAGE */}
            <img
              src={
                item.image ||
                DEFAULT_IMAGE
              }

              onError={(e) => {
                e.target.src =
                  DEFAULT_IMAGE;
              }}

              alt={item.title}

              className="
                w-full h-56 object-cover
              "
            />

            {/* BODY */}
            <div className="p-5">

              {/* TITLE */}
              <div className="flex items-start justify-between gap-3">

                <h2 className="text-2xl font-bold text-slate-800">
                  {item.title}
                </h2>

                <FolderKanban size={24} />

              </div>

              {/* DESCRIPTION */}
              <p className="text-slate-500 mt-3 line-clamp-3">

                {item.description}

              </p>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 mt-5">

                <span
                  className="
                    px-3 py-1 rounded-full
                    bg-slate-100
                    text-sm text-slate-700
                  "
                >
                  {item.category}
                </span>

                <span
                  className={`
                    px-3 py-1 rounded-full
                    text-sm
                    ${
                      item.status ===
                      "Completed"
                        ? "bg-green-100 text-green-700"
                        : item.status ===
                          "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  `}
                >
                  {item.status}
                </span>

              </div>

              {/* TECH STACK */}
              <div className="mt-5">

                <h3 className="font-semibold text-slate-800 mb-2">
                  Tech Stack
                </h3>

                <p className="text-slate-500 text-sm">
                  {item.techStack}
                </p>

              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-2 gap-3 mt-6">

                {/* LIVE */}
                <a
                  href={item.live}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex items-center justify-center gap-2
                    bg-slate-900 text-white
                    py-3 rounded-xl
                  "
                >

                  <Globe size={18} />

                  Live

                </a>

                {/* GITHUB */}
                <a
                  href={item.github}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex items-center justify-center gap-2
                    bg-slate-100 text-slate-700
                    py-3 rounded-xl
                  "
                >

                  <Globe size={18} />

                  Github

                </a>

              </div>

              {/* DOCS */}
              <button
                className="
                  w-full mt-3
                  flex items-center justify-center gap-2
                  bg-blue-100 text-blue-700
                  py-3 rounded-xl
                "
              >

                <FileText size={18} />

                Documentation

              </button>

              {/* PREVIEW */}
              <button
                className="
                  w-full mt-3
                  flex items-center justify-center gap-2
                  bg-green-100 text-green-700
                  py-3 rounded-xl
                "
              >

                <Eye size={18} />

                Preview Details

              </button>

              {/* EDIT DELETE */}
              <div className="flex items-center gap-3 mt-3">

                <button
                  onClick={() =>
                    handleEdit(item)
                  }
                  className="
                    flex-1 flex items-center
                    justify-center gap-2
                    bg-blue-100 text-blue-600
                    py-3 rounded-xl
                  "
                >

                  <Pencil size={18} />

                  Edit

                </button>

                <button
                  onClick={() =>
                    handleDeleteClick(item)
                  }
                  className="
                    flex-1 flex items-center
                    justify-center gap-2
                    bg-red-100 text-red-600
                    py-3 rounded-xl
                  "
                >

                  <Trash2 size={18} />

                  Delete

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* EMPTY */}
      {filteredProjects.length === 0 && (

        <div
          className="
            bg-white rounded-3xl border
            border-slate-200 p-16
            text-center mt-6
          "
        >

          <h2 className="text-2xl font-bold text-slate-700">
            No Projects Found
          </h2>

        </div>

      )}

      {/* MODALS */}

      <ProjectModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSave={handleSave}
        editData={selectedProject}
      />

      <DeleteModal
        open={deleteModal}
        onClose={() =>
          setDeleteModal(false)
        }
        onDelete={handleDelete}
      />

    </div>
  );
}