import { useEffect, useMemo, useState } from "react";
import { onValue, push, ref, set, update } from "firebase/database";
import {
  Briefcase,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { db } from "../firebase";

const DEFAULT_IMAGE =
  "https://ibps-so-it.web.app/static/media/course.224cfb65f934c2d40a3a.jpg";

function CodingModal({ open, onClose, onSave, editData, categories, courses }) {
  const [form, setForm] = useState({
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
      title: editData?.title || "",
      question: editData?.question || "",
      imageUrl: editData?.imageUrl || "",
      categoryId: editData?.categoryId || "",
      courseId: editData?.courseId || "",
      difficulty: editData?.difficulty || "easy",
      status: editData?.status || "active",
    });
  }, [editData, open]);

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto p-4">
      <div className="min-h-full flex items-start justify-center py-10">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-slate-800">
              {editData ? "Edit Coding Question" : "Add Coding Question"}
            </h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <input
              type="text"
              placeholder="Question title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none"
            />

            <textarea
              rows="5"
              placeholder="Question content"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none resize-none"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none"
            />

            <img
              src={form.imageUrl || DEFAULT_IMAGE}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
              alt="preview"
              className="w-full h-56 object-cover rounded-2xl"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>

              <select
                value={form.courseId}
                onChange={(e) =>
                  setForm({ ...form, courseId: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none"
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={form.difficulty}
                onChange={(e) =>
                  setForm({ ...form, difficulty: e.target.value })
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <label className="flex items-center gap-3 px-4 py-3 border border-slate-300 rounded-xl">
                <input
                  type="checkbox"
                  checked={form.status === "active"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.checked ? "active" : "inactive",
                    })
                  }
                />
                Active
              </label>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-3">
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
    </div>
  );
}

export default function AdminCoidng() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  useEffect(() => {
    return onValue(ref(db, "codingQuestions"), (snapshot) => {
      const data = snapshot.val() || {};
      setQuestions(
        Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }))
      );
    });
  }, []);

  useEffect(() => {
    return onValue(ref(db, "categories"), (snapshot) => {
      const data = snapshot.val() || {};
      setCategories(
        Object.entries(data)
          .map(([id, value]) => ({ id, ...value }))
          .filter((category) => category.status === "active")
      );
    });
  }, []);

  useEffect(() => {
    return onValue(ref(db, "courses"), (snapshot) => {
      const data = snapshot.val() || {};
      setCourses(
        Object.entries(data)
          .map(([id, value]) => ({ id, ...value }))
          .filter((course) => course.status === "active")
      );
    });
  }, []);

  const categoryMap = useMemo(
    () =>
      categories.reduce((acc, category) => {
        acc[category.id] = category.categoryName;
        return acc;
      }, {}),
    [categories]
  );

  const courseMap = useMemo(
    () =>
      courses.reduce((acc, course) => {
        acc[course.id] = course.courseName;
        return acc;
      }, {}),
    [courses]
  );

  const filteredQuestions = useMemo(() => {
    return questions
      .filter((item) => item.status === "active")
      .filter((item) =>
        (item.title || "").toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) =>
        filterCategory === "all" ? true : item.categoryId === filterCategory
      )
      .filter((item) =>
        filterCourse === "all" ? true : item.courseId === filterCourse
      );
  }, [questions, search, filterCategory, filterCourse]);

  const handleSave = async (data) => {
    try {
      if (selectedQuestion) {
        await update(ref(db, `codingQuestions/${selectedQuestion.id}`), {
          ...data,
          updatedAt: Date.now(),
        });
      } else {
        const questionRef = push(ref(db, "codingQuestions"));
        await set(questionRef, {
          ...data,
          answers: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }

      setModalOpen(false);
      setSelectedQuestion(null);
    } catch (error) {
      alert(error.message || "Coding question save failed");
    }
  };

  const handleDelete = async (item) => {
    try {
      await update(ref(db, `codingQuestions/${item.id}`), {
        status: "inactive",
        deletedAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (error) {
      alert(error.message || "Coding question delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Coding Questions
          </h1>
          <p className="text-slate-500 mt-1">Manage coding questions</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>

          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSelectedQuestion(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl"
          >
            <Plus size={20} />
            Add Question
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQuestions.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
          >
            <img
              src={item.imageUrl || DEFAULT_IMAGE}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
              alt={item.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-bold text-slate-800">
                  {item.title}
                </h2>
                <Briefcase size={22} />
              </div>

              <p className="text-slate-500 mt-3 line-clamp-3">
                {item.question}
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700">
                  {categoryMap[item.categoryId] || "Category"}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-sm text-blue-700">
                  {courseMap[item.courseId] || "Course"}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-sm text-amber-700">
                  {item.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedQuestion(item);
                    setModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 py-3 rounded-xl"
                >
                  <Pencil size={18} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-3 rounded-xl"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center mt-6">
          <h2 className="text-2xl font-bold text-slate-700">
            No Coding Questions Found
          </h2>
        </div>
      )}

      <CodingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedQuestion(null);
        }}
        onSave={handleSave}
        editData={selectedQuestion}
        categories={categories}
        courses={courses}
      />
    </div>
  );
}
