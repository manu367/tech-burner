import { useEffect, useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  PlayCircle,
} from "lucide-react";

import { useParams } from "react-router-dom";

import {
  getModuleList,
  getModuleLessons,
} from "../api/moduledb";

import { getCourseById } from "../api/coursedb";

export default function CourseViewer() {
  const { courseId } = useParams();

  const [course, setCourse] =
    useState(null);

  const [modules, setModules] =
    useState([]);

  const [expandedModules, setExpandedModules] =
    useState({});

  const [selectedLesson, setSelectedLesson] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | Fetch Modules + Lessons
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchCourseContent();
  }, []);

  const fetchCourseContent =
    async () => {
      try {
        setLoading(true);

        /*
        |--------------------------------------------------------------------------
        | Fetch Course
        |--------------------------------------------------------------------------
        */

        const courseResponse =
          await getCourseById(
            courseId
          );

        if (
          courseResponse.success
        ) {
          setCourse(
            courseResponse.data
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Fetch Modules
        |--------------------------------------------------------------------------
        */

        const moduleResponse =
          await getModuleList(
            courseId
          );

        if (
          !moduleResponse.success
        ) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | Fetch Lessons
        |--------------------------------------------------------------------------
        */

        const moduleData =
          await Promise.all(
            moduleResponse.data.map(
              async (module) => {
                const lessonResponse =
                  await getModuleLessons(
                    courseId,
                    module.id
                  );

                return {
                  ...module,
                  lessons:
                    lessonResponse.data ||
                    [],
                };
              }
            )
          );

        setModules(moduleData);

        /*
        |--------------------------------------------------------------------------
        | Auto Select First Lesson
        |--------------------------------------------------------------------------
        */

        if (
          moduleData.length > 0 &&
          moduleData[0]
            .lessons.length > 0
        ) {
          setSelectedLesson(
            moduleData[0]
              .lessons[0]
          );

          setExpandedModules({
            [moduleData[0].id]:
              true,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Toggle Module
  |--------------------------------------------------------------------------
  */

  const toggleModule = (
    moduleId
  ) => {
    setExpandedModules(
      (prev) => ({
        ...prev,
        [moduleId]:
          !prev[moduleId],
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-slate-700">
          Loading Course...
        </h1>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-slate-100">

      {/* SIDEBAR */}

      <div className="w-[380px] bg-white border-r border-slate-200 flex flex-col">

        {/* HEADER */}

        <div className="p-6 border-b border-slate-200">
          <h1 className="text-3xl font-black text-slate-800">
            {course?.courseName ||
              "Course"}
          </h1>

          <p className="text-slate-500 mt-2">
            Modules & Lessons
          </p>

          {course?.description && (
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              {
                course.description
              }
            </p>
          )}
        </div>

        {/* MODULES */}

        <div className="flex-1 overflow-y-auto">

          {modules.map((module) => {
            const isExpanded =
              expandedModules[
                module.id
              ];

            return (
              <div
                key={module.id}
                className="border-b border-slate-100"
              >
                {/* MODULE */}

                <button
                  onClick={() =>
                    toggleModule(
                      module.id
                    )
                  }
                  className="w-full flex items-center justify-between px-5 py-5 hover:bg-slate-50 transition"
                >
                  <div className="text-left">
                    <h2 className="font-bold text-slate-800 text-lg">
                      {
                        module.moduleName
                      }
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      {
                        module
                          .lessons
                          .length
                      }{" "}
                      lessons
                    </p>
                  </div>

                  {isExpanded ? (
                    <ChevronDown
                      size={22}
                    />
                  ) : (
                    <ChevronRight
                      size={22}
                    />
                  )}
                </button>

                {/* LESSONS */}

                {isExpanded && (
                  <div className="pb-3">

                    {(
                      module.lessons ||
                      []
                    ).map(
                      (lesson) => (
                        <button
                          key={
                            lesson.id
                          }
                          onClick={() =>
                            setSelectedLesson(
                              lesson
                            )
                          }
                          className={`w-full flex items-center gap-3 px-6 py-4 text-left transition ${
                            selectedLesson?.id ===
                            lesson.id
                              ? "bg-slate-900 text-white"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <PlayCircle
                            size={20}
                          />

                          <span className="font-medium">
                            {
                              lesson.lessonName
                            }
                          </span>
                        </button>
                      )
                    )}

                    {(
                      module.lessons ||
                      []
                    ).length ===
                      0 && (
                      <div className="px-6 py-4 text-sm text-slate-400">
                        No lessons
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {modules.length === 0 && (
            <div className="p-10 text-center text-slate-500">
              No Modules Found
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 overflow-hidden flex flex-col">

        {/* TOP BAR */}

        <div className="bg-white border-b border-slate-200 px-8 py-5">
          <h2 className="text-3xl font-black text-slate-800">
            {selectedLesson
              ?.lessonName ||
              "Select Lesson"}
          </h2>
        </div>

        {/* LESSON CONTENT */}

        <div className="flex-1 overflow-y-auto p-8">

          {selectedLesson ? (
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">

              <iframe
                title="lesson-content"
                sandbox="allow-scripts allow-same-origin"
                srcDoc={`
                  <html>
                    <head>

                      <script src="https://cdn.tailwindcss.com"></script>

                      <style>
                        body {
                          padding: 30px;
                          font-family: sans-serif;
                          background: #ffffff;
                        }

                        * {
                          box-sizing: border-box;
                        }

                        img {
                          max-width: 100%;
                        }
                      </style>

                    </head>

                    <body>
                      ${selectedLesson.lessonContent}
                    </body>
                  </html>
                `}
                className="w-full h-[85vh]"
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">

                <h2 className="text-4xl font-black text-slate-700">
                  No Lesson Selected
                </h2>

                <p className="text-slate-500 mt-4 text-lg">
                  Select lesson from
                  sidebar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}