import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Search,
} from "lucide-react";

import { getCourseList } from "../api/coursedb";
import { getAllCategories } from "../api/categorydb";

const DEFAULT_IMAGE =
  "https://ibps-so-it.web.app/static/media/course.224cfb65f934c2d40a3a.jpg";

export default function Home() {
  const [courses, setCourses] = useState([]);
const navigate = useNavigate();
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("all");

  /*
  |--------------------------------------------------------------------------
  | Fetch Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        courseResponse,
        categoryResponse,
      ] = await Promise.all([
        getCourseList(),
        getAllCategories(),
      ]);

      if (courseResponse.success) {
        const activeCourses =
          courseResponse.data.filter(
            (item) =>
              item.status === "active"
          );

        setCourses(activeCourses);
      }

      if (categoryResponse.success) {
        const activeCategories =
          categoryResponse.data.filter(
            (item) =>
              item.status === "active"
          );

        setCategories(
          activeCategories
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

      .filter((course) =>
        (
          course.courseName || ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      )

      .filter((course) =>
        selectedCategory === "all"
          ? true
          : (
              course.categoryIds || []
            ).includes(
              selectedCategory
            )
      );
  }, [
    courses,
    search,
    selectedCategory,
  ]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO */}

      <div className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-5xl md:text-6xl font-black leading-tight">
            Learn Modern
            <br />
            Development
          </h1>

          <p className="mt-6 text-slate-300 max-w-2xl text-lg">
            Explore high quality
            development courses with
            structured modules,
            lessons, and hands-on
            content.
          </p>

          {/* SEARCH */}

          <div className="mt-10 relative max-w-2xl">
            <Search
              size={22}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full bg-white text-slate-800 rounded-2xl pl-14 pr-5 py-5 outline-none text-lg"
            />
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER */}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-4">

          <button
            onClick={() =>
              setSelectedCategory(
                "all"
              )
            }
            className={`px-5 py-3 rounded-2xl transition font-medium ${
              selectedCategory ===
              "all"
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            All Courses
          </button>

          {categories.map(
            (category) => (
              <button
                key={category.id}
                onClick={() =>
                  setSelectedCategory(
                    category.id
                  )
                }
                className={`px-5 py-3 rounded-2xl transition font-medium ${
                  selectedCategory ===
                  category.id
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-700"
                }`}
              >
                {
                  category.categoryName
                }
              </button>
            )
          )}
        </div>
      </div>

      {/* COURSE SECTION */}

      <div className="max-w-7xl mx-auto px-6 pb-20">

        {loading ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-700">
              Loading Courses...
            </h2>
          </div>
        ) : filteredCourses.length ===
          0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-700">
              No Courses Found
            </h2>

            <p className="text-slate-500 mt-4">
              Try searching another
              keyword or category.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-800">
                  Courses
                </h2>

                <p className="text-slate-500 mt-2">
                  {filteredCourses.length}{" "}
                  course found
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {filteredCourses.map(
                (course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition"
                  >
                    {/* IMAGE */}

                    <img
                      src={
                        course.thumbnail ||
                        DEFAULT_IMAGE
                      }
                      onError={(e) => {
                        e.currentTarget.src =
                          DEFAULT_IMAGE;
                      }}
                      alt={
                        course.courseName
                      }
                      className="w-full h-60 object-cover"
                    />

                    {/* CONTENT */}

                    <div className="p-6">

                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                          {
                            course.courseName
                          }
                        </h2>

                        <BookOpen
                          size={24}
                        />
                      </div>

                      <p className="text-slate-500 mt-4 line-clamp-3">
                        {
                          course.description
                        }
                      </p>

                      {/* CATEGORY TAGS */}

                      <div className="flex flex-wrap gap-2 mt-5">

                        {(
                          course.categoryIds ||
                          []
                        ).map(
                          (
                            categoryId
                          ) => (
                            <span
                              key={
                                categoryId
                              }
                              className="px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700"
                            >
                              {categoryMap[
                                categoryId
                              ] ||
                                "Category"}
                            </span>
                          )
                        )}
                      </div>

                      {/* PRICE + LEVEL */}

                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-2xl font-black text-slate-800">
                          ₹
                          {
                            course.price
                          }
                        </span>

                        <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm capitalize font-medium">
                          {
                            course.level
                          }
                        </span>
                      </div>

                      {/* BUTTON */}

                      <button
  onClick={() =>
    navigate(`/course/${course.id}`)
  }
  className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-medium hover:opacity-90 transition"
>
  View Course
</button>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}