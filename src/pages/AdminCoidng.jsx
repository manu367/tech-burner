import { useEffect, useMemo, useState } from "react";

import {
  Briefcase,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";

import { db } from "../firebase";

const DEFAULT_IMAGE =
  "https://ibps-so-it.web.app/static/media/course.224cfb65f934c2d40a3a.jpg";

function CodingModal({
  open,
  onClose,
  onSave,
  editData,
  categories,
  courses,
}) {
  const [form, setForm] =
    useState({
      title: "",
      question: "",
      imageUrl: "",
      categoryId: "",
      courseId: "",
      difficulty: "easy",
      status: "active",
    });

  useEffect(() => {
    setForm({
      title:
        editData?.title || "",

      question:
        editData?.question || "",

      imageUrl:
        editData?.imageUrl ||
        "",

      categoryId:
        editData?.categoryId ||
        "",

      courseId:
        editData?.courseId ||
        "",

      difficulty:
        editData?.difficulty ||
        "easy",

      status:
        editData?.status ||
        "active",
    });
  }, [editData, open]);

  const handleSubmit = () => {
    if (!form.title.trim()) {
      alert(
        "Question title required"
      );

      return;
    }

    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-6">
        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl my-10">

          {/* HEADER */}

          <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between rounded-t-3xl z-10">
            <h2 className="text-3xl font-black text-slate-800">
              {editData
                ? "Edit Coding Question"
                : "Add Coding Question"}
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
                Question Title
              </label>

              <input
                type="text"
                placeholder="Question title"
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

            {/* QUESTION */}

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Question Content
              </label>

              <textarea
                rows="6"
                placeholder="Question content"
                value={form.question}
                onChange={(e) =>
                  setForm({
                    ...form,
                    question:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none resize-none"
              />
            </div>

            {/* IMAGE URL */}

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Image URL
              </label>

              <input
                type="text"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({
                    ...form,
                    imageUrl:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              />
            </div>

            {/* PREVIEW */}

            <img
              src={
                form.imageUrl ||
                DEFAULT_IMAGE
              }
              onError={(e) => {
                e.currentTarget.src =
                  DEFAULT_IMAGE;
              }}
              alt="preview"
              className="w-full h-64 object-cover rounded-3xl border border-slate-200"
            />

            {/* SELECT */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={
                    form.categoryId
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoryId:
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

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Course
                </label>

                <select
                  value={
                    form.courseId
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      courseId:
                        e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
                >
                  <option value="">
                    Select Course
                  </option>

                  {courses.map(
                    (
                      course
                    ) => (
                      <option
                        key={
                          course.id
                        }
                        value={
                          course.id
                        }
                      >
                        {
                          course.courseName
                        }
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* LEVEL */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Difficulty
                </label>

                <select
                  value={
                    form.difficulty
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      difficulty:
                        e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
                >
                  <option value="easy">
                    Easy
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="hard">
                    Hard
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 border border-slate-300 rounded-2xl px-4 py-3 w-full">
                  <input
                    type="checkbox"
                    checked={
                      form.status ===
                      "active"
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,
                        status:
                          e.target
                            .checked
                            ? "active"
                            : "inactive",
                      })
                    }
                  />

                  Active
                </label>
              </div>
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

export default function AdminCoidng() {
  const navigate =
    useNavigate();

  const [questions, setQuestions] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filterCategory, setFilterCategory] =
    useState("all");

  const [filterCourse, setFilterCourse] =
    useState("all");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Questions
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return onValue(
      ref(db, "codingQuestions"),
      (snapshot) => {
        const data =
          snapshot.val() || {};

        setQuestions(
          Object.entries(
            data
          ).map(
            ([
              id,
              value,
            ]) => ({
              id,
              ...value,
            })
          )
        );
      }
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Fetch Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return onValue(
      ref(db, "categories"),
      (snapshot) => {
        const data =
          snapshot.val() || {};

        setCategories(
          Object.entries(
            data
          )
            .map(
              ([
                id,
                value,
              ]) => ({
                id,
                ...value,
              })
            )
            .filter(
              (
                category
              ) =>
                category.status ===
                "active"
            )
        );
      }
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Fetch Courses
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return onValue(
      ref(db, "courses"),
      (snapshot) => {
        const data =
          snapshot.val() || {};

        setCourses(
          Object.entries(
            data
          )
            .map(
              ([
                id,
                value,
              ]) => ({
                id,
                ...value,
              })
            )
            .filter(
              (
                course
              ) =>
                course.status ===
                "active"
            )
        );
      }
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Category Map
  |--------------------------------------------------------------------------
  */

  const categoryMap =
    useMemo(
      () =>
        categories.reduce(
          (
            acc,
            category
          ) => {
            acc[
              category.id
            ] =
              category.categoryName;

            return acc;
          },
          {}
        ),
      [categories]
    );

  /*
  |--------------------------------------------------------------------------
  | Course Map
  |--------------------------------------------------------------------------
  */

  const courseMap =
    useMemo(
      () =>
        courses.reduce(
          (
            acc,
            course
          ) => {
            acc[
              course.id
            ] =
              course.courseName;

            return acc;
          },
          {}
        ),
      [courses]
    );

  /*
  |--------------------------------------------------------------------------
  | Filter Questions
  |--------------------------------------------------------------------------
  */

  const filteredQuestions =
    useMemo(() => {
      return questions

        .filter(
          (item) =>
            item.status ===
            "active"
        )

        .filter((item) =>
          (
            item.title || ""
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )

        .filter((item) =>
          filterCategory ===
          "all"
            ? true
            : item.categoryId ===
              filterCategory
        )

        .filter((item) =>
          filterCourse ===
          "all"
            ? true
            : item.courseId ===
              filterCourse
        );
    }, [
      questions,
      search,
      filterCategory,
      filterCourse,
    ]);

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave =
    async (data) => {
      try {
        if (
          selectedQuestion
        ) {
          await update(
            ref(
              db,
              `codingQuestions/${selectedQuestion.id}`
            ),
            {
              ...data,
              updatedAt:
                Date.now(),
            }
          );
        } else {
          const questionRef =
            push(
              ref(
                db,
                "codingQuestions"
              )
            );

          await set(
            questionRef,
            {
              ...data,

              answers: [],

              createdAt:
                Date.now(),

              updatedAt:
                Date.now(),
            }
          );
        }

        setModalOpen(false);

        setSelectedQuestion(
          null
        );
      } catch (error) {
        alert(
          error.message ||
            "Coding question save failed"
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete =
    async (item) => {
      const confirmDelete =
        window.confirm(
          `Are you sure you want to delete "${item.title}" ?`
        );

      if (
        !confirmDelete
      ) {
        return;
      }

      try {
        await remove(
          ref(
            db,
            `codingQuestions/${item.id}`
          )
        );
      } catch (error) {
        alert(
          error.message ||
            "Delete failed"
        );
      }
    };

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-black text-slate-800">
            Coding Questions
          </h1>

          <p className="text-slate-500 mt-2">
            Manage coding
            questions
          </p>
        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-3">

          {/* SEARCH */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="pl-10 pr-4 py-3 rounded-2xl border border-slate-300 outline-none"
            />
          </div>

          {/* CATEGORY */}

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

          {/* COURSE */}

          <select
            value={
              filterCourse
            }
            onChange={(e) =>
              setFilterCourse(
                e.target.value
              )
            }
            className="px-4 py-3 rounded-2xl border border-slate-300"
          >
            <option value="all">
              All Courses
            </option>

            {courses.map(
              (course) => (
                <option
                  key={
                    course.id
                  }
                  value={
                    course.id
                  }
                >
                  {
                    course.courseName
                  }
                </option>
              )
            )}
          </select>

          {/* BUTTON */}

          <button
            onClick={() => {
              setSelectedQuestion(
                null
              );

              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl"
          >
            <Plus size={20} />
            Add Question
          </button>
        </div>
      </div>

      {/* QUESTIONS */}

      {filteredQuestions.length ===
      0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center">
          <h2 className="text-3xl font-black text-slate-700">
            No Coding Questions
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredQuestions.map(
            (item) => (
              <div
                key={
                  item.id
                }
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
              >

                {/* IMAGE */}

                <img
                  src={
                    item.imageUrl ||
                    DEFAULT_IMAGE
                  }
                  onError={(
                    e
                  ) => {
                    e.currentTarget.src =
                      DEFAULT_IMAGE;
                  }}
                  alt={
                    item.title
                  }
                  className="w-full h-56 object-cover"
                />

                {/* CONTENT */}

                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-black text-slate-800">
                      {
                        item.title
                      }
                    </h2>

                    <Briefcase
                      size={22}
                    />
                  </div>

                  <p className="text-slate-500 mt-3 line-clamp-3">
                    {
                      item.question
                    }
                  </p>

                  {/* TAGS */}

                  <div className="flex flex-wrap gap-2 mt-5">

                    <span className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
                      {categoryMap[
                        item
                          .categoryId
                      ] ||
                        "Category"}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-sm text-blue-700">
                      {courseMap[
                        item
                          .courseId
                      ] ||
                        "Course"}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-amber-100 text-sm text-amber-700 capitalize">
                      {
                        item.difficulty
                      }
                    </span>
                  </div>

                  {/* ACTIONS */}

                  <div className="space-y-3 mt-6">

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() => {
                          setSelectedQuestion(
                            item
                          );

                          setModalOpen(
                            true
                          );
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 py-3 rounded-2xl"
                      >
                        <Pencil size={18} />
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
                        <Trash2 size={18} />
                        Delete
                      </button>
                    </div>

                    {/* ADD CODING */}

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/coding/${item.id}`
                        )
                      }
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl"
                    >
                      <Plus size={18} />
                      Add Coding
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* MODAL */}

      <CodingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);

          setSelectedQuestion(
            null
          );
        }}
        onSave={handleSave}
        editData={
          selectedQuestion
        }
        categories={categories}
        courses={courses}
      />
    </div>
  );
}