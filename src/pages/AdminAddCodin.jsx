import { useEffect, useState } from "react";

import {
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  addCodingQuestion,
  deleteCodingQuestion,
  updateCodingQuestin,
  getAllCodingQuestion,
} from "../api/codingdb";

import {
  getAllCategories,
} from "../api/categorydb";

import {
  getCourseList,
} from "../api/coursedb";

function QuestionModal({
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
      categoryId: "",
      courseId: "",

      questionListJson: `[
  {
    "question": "",
    "description": ""
  }
]`,
    });

  useEffect(() => {
    setForm({
      title:
        editData?.title || "",

      categoryId:
        editData?.categoryId ||
        "",

      courseId:
        editData?.courseId ||
        "",

      questionListJson:
        JSON.stringify(
          editData?.questionList ||
            [
              {
                question: "",
                description:
                  "",
              },
            ],
          null,
          2
        ),
    });
  }, [editData, open]);

  const handleSubmit = () => {
    try {
      const parsed =
        JSON.parse(
          form.questionListJson
        );

      const finalData = {
        title: form.title,

        categoryId:
          form.categoryId,

        courseId:
          form.courseId,

        questionList:
          parsed,
      };

      onSave(finalData);
    } catch (error) {
      alert(
        "Invalid JSON Format"
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-6">
        <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl my-10">

          {/* HEADER */}

          <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-3xl font-black text-slate-800">
              {editData
                ? "Update Question"
                : "Add Question"}
            </h2>

            <button
              onClick={onClose}
            >
              <X />
            </button>
          </div>

          {/* BODY */}

          <div className="p-6 space-y-6">

            <input
              type="text"
              placeholder="Question Title"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* CATEGORY */}

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

              {/* COURSE */}

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

            {/* JSON */}

            <textarea
              rows="24"
              value={
                form.questionListJson
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  questionListJson:
                    e.target.value,
                })
              }
              className="w-full border border-slate-300 rounded-2xl px-4 py-4 outline-none resize-none font-mono text-sm"
            />
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
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAddCodingQuestion() {
  const [questions, setQuestions] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedQuestion, setSelectedQuestion] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [
      questionResponse,
      categoryResponse,
      courseResponse,
    ] = await Promise.all([
      getAllCodingQuestion(),

      getAllCategories(),

      getCourseList(),
    ]);

    if (
      questionResponse.success
    ) {
      setQuestions(
        questionResponse.data
      );
    }

    if (
      categoryResponse.success
    ) {
      setCategories(
        categoryResponse.data
      );
    }

    if (
      courseResponse.success
    ) {
      setCourses(
        courseResponse.data
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save
  |--------------------------------------------------------------------------
  */

  const handleSave =
    async (data) => {
      if (
        selectedQuestion
      ) {
        const response =
          await updateCodingQuestin(
            selectedQuestion.id,
            data
          );

        if (
          response.success
        ) {
          setQuestions(
            (prev) =>
              prev.map(
                (item) =>
                  item.id ===
                  selectedQuestion.id
                    ? response.data
                    : item
              )
          );
        }
      } else {
        const response =
          await addCodingQuestion(
            data
          );

        if (
          response.success
        ) {
          setQuestions(
            (prev) => [
              response.data,
              ...prev,
            ]
          );
        }
      }

      setModalOpen(false);

      setSelectedQuestion(
        null
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete =
    async (question) => {
      const confirmDelete =
        window.confirm(
          `Delete "${question.title}" ?`
        );

      if (
        !confirmDelete
      ) {
        return;
      }

      await deleteCodingQuestion(
        question.id
      );

      setQuestions((prev) =>
        prev.filter(
          (item) =>
            item.id !==
            question.id
        )
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredQuestions =
    questions.filter((item) =>
      (
        item.title || ""
      )
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="p-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-4xl font-black text-slate-800">
            Interview Questions
          </h1>

          <p className="text-slate-500 mt-2">
            Manage question banks
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

          {/* BUTTON */}

          <button
            onClick={() => {
              setSelectedQuestion(
                null
              );

              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl"
          >
            <Plus size={18} />

            Add Question
          </button>
        </div>
      </div>

      {/* LIST */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredQuestions.map(
          (question) => (
            <div
              key={question.id}
              className="bg-white rounded-3xl border border-slate-200 p-6"
            >
              <h2 className="text-2xl font-black text-slate-800">
                {question.title}
              </h2>

              <p className="text-slate-500 mt-3">
                {
                  question
                    ?.questionList
                    ?.length
                }{" "}
                Questions
              </p>

              {/* PREVIEW */}

              <div className="mt-5 bg-slate-50 rounded-2xl p-4">

                <p className="font-semibold text-slate-700">
                  First Question
                </p>

                <p className="text-slate-500 mt-2 line-clamp-2">
                  {
                    question
                      ?.questionList?.[0]
                      ?.question
                  }
                </p>
              </div>

              {/* ACTION */}

              <div className="flex items-center gap-3 mt-6">

                <button
                  onClick={() => {
                    setSelectedQuestion(
                      question
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
                      question
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-3 rounded-2xl"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* MODAL */}

      <QuestionModal
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