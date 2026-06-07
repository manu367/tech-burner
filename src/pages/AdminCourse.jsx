import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BookOpen,
  FilePlus2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  addCourse,
  deleteCourse,
  updateCourse,
  getCourseList,
} from "../api/coursedb";

import { getAllCategories } from "../api/categorydb";

const DEFAULT_IMAGE =
  "https://ibps-so-it.web.app/static/media/course.224cfb65f934c2d40a3a.jpg";

function CourseModal({
  open,
  onClose,
  onSave,
  editData,
  categories,
}) {
  const [form, setForm] = useState({
    courseName: "",
    description: "",
    thumbnail: "",
    categoryIds: [],
    price: 0,
    level: "beginner",
    status: "active",
  });

  useEffect(() => {
    setForm({
      courseName: editData?.courseName || "",
      description: editData?.description || "",
      thumbnail: editData?.thumbnail || "",
      categoryIds: editData?.categoryIds || [],
      price: editData?.price || 0,
      level: editData?.level || "beginner",
      status: editData?.status || "active",
    });
  }, [editData, open]);

  const toggleCategory = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(
        categoryId
      )
        ? prev.categoryIds.filter(
            (id) => id !== categoryId
          )
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleSubmit = () => {
    if (!form.courseName.trim()) {
      alert("Course name required");
      return;
    }

    if (form.categoryIds.length === 0) {
      alert("Select at least one category");
      return;
    }

    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-6">
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl my-10">

          {/* HEADER */}

          <div className="sticky top-0 bg-white z-10 border-b px-6 py-5 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-3xl font-bold text-slate-800">
              {editData
                ? "Edit Course"
                : "Add Course"}
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

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Course Name
              </label>

              <input
                type="text"
                value={form.courseName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    courseName: e.target.value,
                  })
                }
                placeholder="Course name"
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows="5"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Course description"
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Thumbnail URL
              </label>

              <input
                type="text"
                placeholder="Course image URL"
                value={form.thumbnail}
                onChange={(e) =>
                  setForm({
                    ...form,
                    thumbnail: e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              />
            </div>

            <img
              src={form.thumbnail || DEFAULT_IMAGE}
              onError={(e) => {
                e.currentTarget.src =
                  DEFAULT_IMAGE;
              }}
              alt="preview"
              className="w-full h-72 object-cover rounded-3xl border border-slate-200"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: Number(
                        e.target.value
                      ),
                    })
                  }
                  placeholder="Price"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-slate-700">
                  Level
                </label>

                <select
                  value={form.level}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      level: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
                >
                  <option value="beginner">
                    Beginner
                  </option>

                  <option value="intermediate">
                    Intermediate
                  </option>

                  <option value="advanced">
                    Advanced
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-4 font-medium text-slate-700">
                Select Categories
              </label>

              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      toggleCategory(
                        category.id
                      )
                    }
                    className={`px-5 py-3 rounded-2xl border transition ${
                      form.categoryIds.includes(
                        category.id
                      )
                        ? "bg-slate-900 text-white border-slate-900"
                        : "border-slate-300 text-slate-700"
                    }`}
                  >
                    {category.categoryName}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3">
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

              <span className="font-medium text-slate-700">
                Active
              </span>
            </label>
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
              {editData ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCourse() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] = useState("");

  const [filterCategory, setFilterCategory] =
    useState("all");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [loading, setLoading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch Categories
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response =
      await getAllCategories();

    if (response.success) {
      const activeCategories =
        response.data.filter(
          (item) =>
            item.status === "active"
        );

      setCategories(activeCategories);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch Courses
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response =
        await getCourseList();

      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Category Map
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
  | Filter Courses
  |--------------------------------------------------------------------------
  */

  const filteredCourses = useMemo(() => {
    return courses
      .filter(
        (course) =>
          course.status === "active"
      )

      .filter((course) =>
        (
          course.courseName || ""
        )
          .toLowerCase()
          .includes(search.toLowerCase())
      )

      .filter((course) =>
        filterCategory === "all"
          ? true
          : (
              course.categoryIds || []
            ).includes(filterCategory)
      );
  }, [
    courses,
    search,
    filterCategory,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Save Course
  |--------------------------------------------------------------------------
  */

  const handleSaveCourse = async (
    data
  ) => {
    try {
      setLoading(true);

      if (selectedCourse) {
        const response =
          await updateCourse(
            selectedCourse.id,
            data
          );

        if (response.success) {
          setCourses((prev) =>
            prev.map((item) =>
              item.id ===
              selectedCourse.id
                ? response.data
                : item
            )
          );
        }
      } else {
        const response =
          await addCourse(data);

        if (response.success) {
          setCourses((prev) => [
            response.data,
            ...prev,
          ]);
        }
      }

      setModalOpen(false);

      setSelectedCourse(null);
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Course save failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Course
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    course
  ) => {
    try {
      const response =
        await deleteCourse(course.id);

      if (response.success) {
        setCourses((prev) =>
          prev.filter(
            (item) =>
              item.id !== course.id
          )
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Course delete failed"
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Courses
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all your courses
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
              placeholder="Search course..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(
                e.target.value
              )
            }
            className="px-4 py-3 rounded-xl border border-slate-300"
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

          <button
            onClick={() => {
              setSelectedCourse(null);

              setModalOpen(true);
            }}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl"
          >
            <Plus size={20} />

            Add Course
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">
          <h2 className="text-2xl font-bold text-slate-700">
            Loading...
          </h2>
        </div>
      ) : filteredCourses.length ===
        0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">
          <h2 className="text-2xl font-bold text-slate-700">
            No Courses Found
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
            >
              <img
                src={
                  course.thumbnail ||
                  DEFAULT_IMAGE
                }
                onError={(e) => {
                  e.currentTarget.src =
                    DEFAULT_IMAGE;
                }}
                alt={course.courseName}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {course.courseName}
                  </h2>

                  <BookOpen size={24} />
                </div>

                <p className="text-slate-500 mt-3 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {(
                    course.categoryIds ||
                    []
                  ).map(
                    (categoryId) => (
                      <span
                        key={categoryId}
                        className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700"
                      >
                        {categoryMap[
                          categoryId
                        ] || "Category"}
                      </span>
                    )
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="font-bold text-lg text-slate-800">
                    ₹{course.price}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm capitalize">
                    {course.level}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      setSelectedCourse(
                        course
                      );

                      setModalOpen(
                        true
                      );
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 py-3 rounded-xl"
                  >
                    <Pencil size={18} />
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        course
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-3 rounded-xl"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/admin/courses/${course.id}/content`
                    )
                  }
                  className="w-full mt-3 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl"
                >
                  <FilePlus2 size={18} />
                  Add Content
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CourseModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);

          setSelectedCourse(null);
        }}
        onSave={handleSaveCourse}
        editData={selectedCourse}
        categories={categories}
      />
    </div>
  );
}