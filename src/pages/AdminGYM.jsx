import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Code2,
  Dumbbell,
} from "lucide-react";

/* =========================================
   DEFAULT IMAGE
========================================= */

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop";

/* =========================================
   CATEGORY OPTIONS
========================================= */

const categoryOptions = [
  "Chest",
  "Back",
  "Shoulder",
  "Leg",
  "Biceps",
  "Triceps",
  "Abs",
  "Cardio",
];

/* =========================================
   ADD / EDIT QUESTION MODAL
========================================= */

function QuestionModal({
  open,
  onClose,
  onSave,
  editData,
}) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    image: "",
    active: "Active",
  });

  /* LOAD EDIT DATA */
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        category: editData.category,
        image: editData.image,
        active: editData.active,
      });
    } else {
      setForm({
        name: "",
        category: "",
        image: "",
        active: "Active",
      });
    }
  }, [editData]);

  /* SAVE */
  const handleSubmit = () => {
    if (!form.name.trim()) return;

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
        bg-black/50
        overflow-y-auto
        p-4
      "
    >
      <div
        className="
          min-h-full
          flex items-center justify-center
        "
      >
        <div
          className="
            bg-white
            w-full max-w-2xl
            rounded-3xl
            shadow-2xl
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-slate-800">
              {editData
                ? "Edit Question"
                : "Add Question"}
            </h2>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* BODY */}
          <div className="p-6 space-y-6">
            {/* NAME */}
            <div>
              <label className="block mb-2 font-medium">
                Question Name
              </label>

              <input
                type="text"
                placeholder="Enter question name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="
                  w-full border border-slate-300
                  rounded-xl px-4 py-3
                  outline-none
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

            {/* ACTIVE */}
            <div>
              <label className="block mb-2 font-medium">
                Status
              </label>

              <select
                value={form.active}
                onChange={(e) =>
                  setForm({
                    ...form,
                    active:
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
                  Active
                </option>

                <option>
                  Inactive
                </option>
              </select>
            </div>

            {/* IMAGE URL */}
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

              {/* PREVIEW */}
              <img
                src={
                  form.image ||
                  DEFAULT_IMAGE
                }
                alt="preview"
                onError={(e) => {
                  e.target.src =
                    DEFAULT_IMAGE;
                }}
                className="
                  w-full h-64 object-cover
                  rounded-2xl mt-4
                "
              />
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
      <div className="bg-white w-full max-w-md rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Delete Question
        </h2>

        <p className="text-slate-500 mb-6">
          Are you sure you want to delete
          this question?
        </p>

        <div className="flex justify-end gap-3">
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
            onClick={onDelete}
            className="
              px-5 py-3 rounded-xl
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

export default function AdminGYM() {
  const navigate = useNavigate();

  const [questions, setQuestions] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filterCategory, setFilterCategory] =
    useState("all");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  /* FILTER */
  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      const matchSearch =
        item.name
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
    questions,
    search,
    filterCategory,
  ]);

  /* SAVE */
  const handleSave = (data) => {
    const exists = questions.find(
      (item) => item.id === data.id
    );

    if (exists) {
      setQuestions(
        questions.map((item) =>
          item.id === data.id
            ? data
            : item
        )
      );
    } else {
      setQuestions([
        data,
        ...questions,
      ]);
    }
  };

  /* EDIT */
  const handleEdit = (item) => {
    setSelectedQuestion(item);

    setModalOpen(true);
  };

  /* DELETE */
  const handleDeleteClick = (
    item
  ) => {
    setSelectedQuestion(item);

    setDeleteModal(true);
  };

  const handleDelete = () => {
    setQuestions(
      questions.filter(
        (item) =>
          item.id !==
          selectedQuestion.id
      )
    );

    setDeleteModal(false);
  };

  return (
    <div className="p-6">
      {/* TOPBAR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Gym Section
          </h1>

          <p className="text-slate-500 mt-2">
            Manage gym questions &
            coding exercises
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
              placeholder="Search Question..."
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
              setSelectedQuestion(null);
              setModalOpen(true);
            }}
            className="
              flex items-center gap-2
              bg-slate-900 text-white
              px-5 py-3 rounded-xl
            "
          >
            <Plus size={20} />

            Add Question
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQuestions.map(
          (item) => (
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
                alt={item.name}
                onError={(e) => {
                  e.target.src =
                    DEFAULT_IMAGE;
                }}
                className="
                  w-full h-56 object-cover
                "
              />

              {/* BODY */}
              <div className="p-5">
                {/* TITLE */}
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {item.name}
                  </h2>

                  <Dumbbell size={24} />
                </div>

                {/* TAGS */}
                <div className="flex gap-2 mt-5 flex-wrap">
                  <span
                    className="
                      px-3 py-1 rounded-full
                      bg-slate-100
                      text-sm
                    "
                  >
                    {item.category}
                  </span>

                  <span
                    className={`
                    px-3 py-1 rounded-full
                    text-sm
                    ${
                      item.active ===
                      "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                  >
                    {item.active}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-3 mt-6">
                  {/* CODING */}
                  <button
                    onClick={() =>
                      navigate(
                        "/coding-section"
                      )
                    }
                    className="
                      w-full flex items-center justify-center gap-2
                      bg-slate-900 text-white
                      py-3 rounded-xl
                    "
                  >
                    <Code2 size={18} />

                    Coding Section
                  </button>

                  {/* EDIT DELETE */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="
                        flex items-center justify-center gap-2
                        bg-blue-100 text-blue-700
                        py-3 rounded-xl
                      "
                    >
                      <Pencil size={18} />

                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteClick(
                          item
                        )
                      }
                      className="
                        flex items-center justify-center gap-2
                        bg-red-100 text-red-700
                        py-3 rounded-xl
                      "
                    >
                      <Trash2 size={18} />

                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* EMPTY */}
      {filteredQuestions.length ===
        0 && (
        <div
          className="
            bg-white rounded-3xl
            border border-slate-200
            p-16 text-center mt-6
          "
        >
          <h2 className="text-2xl font-bold text-slate-700">
            No Questions Found
          </h2>
        </div>
      )}

      {/* MODALS */}
      <QuestionModal
        open={modalOpen}
        onClose={() =>
          setModalOpen(false)
        }
        onSave={handleSave}
        editData={selectedQuestion}
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