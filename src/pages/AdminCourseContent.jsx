import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Pencil,
  Plus,
  Trash2,
  X,
  Eye,
} from "lucide-react";

import {
  saveCourseModule,
  deleteCourseModule,
  updateCourseModule,
  getModuleList,
  addModuleLessons,
  getModuleLessons,
  deleteModuleLessons,
  updateModuleLessons,
} from "../api/moduledb";

function LessonModal({
  open,
  onClose,
  onSave,
  editData,
}) {
  const [form, setForm] = useState({
    lessonName: "",
    lessonContent: "",
  });

  useEffect(() => {
    setForm({
      lessonName:
        editData?.lessonName || "",

      lessonContent:
        editData?.lessonContent || "",
    });
  }, [editData, open]);

  const handleSubmit = () => {
    if (!form.lessonName.trim()) {
      return;
    }

    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-6">
        <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl my-10">
          
          {/* HEADER */}

          <div className="sticky top-0 bg-white z-10 border-b px-6 py-5 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-2xl font-bold text-slate-800">
              {editData
                ? "Update Lesson"
                : "Add Lesson"}
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
                Lesson Name
              </label>

              <input
                type="text"
                placeholder="Enter lesson name"
                value={form.lessonName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lessonName:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-slate-700">
                HTML + Tailwind + Script
              </label>

              <textarea
                rows="20"
                placeholder="Paste full HTML code here..."
                value={form.lessonContent}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lessonContent:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-300 rounded-2xl px-4 py-4 outline-none resize-none font-mono text-sm"
              />
            </div>

            {/* PREVIEW */}

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold text-slate-800">
                  Live Preview
                </h3>
              </div>

              <iframe
                title="lesson-preview"
                sandbox="allow-scripts allow-same-origin"
                srcDoc={form.lessonContent}
                className="w-full min-h-[700px] border border-slate-300 rounded-2xl bg-white"
              />
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
              Save Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleModal({
  open,
  onClose,
  onSave,
  editData,
}) {
  const [moduleName, setModuleName] =
    useState("");

  useEffect(() => {
    setModuleName(
      editData?.moduleName || ""
    );
  }, [editData, open]);

  const handleSubmit = () => {
    if (!moduleName.trim()) {
      return;
    }

    onSave({
      moduleName,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {editData
              ? "Update Module"
              : "Add Module"}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6">
          <input
            type="text"
            placeholder="Module Name"
            value={moduleName}
            onChange={(e) =>
              setModuleName(
                e.target.value
              )
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none"
          />
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
            Save Module
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCourseContent() {
  const navigate = useNavigate();

  const { courseId } = useParams();

  const [modules, setModules] =
    useState([]);

  const [moduleModal, setModuleModal] =
    useState(false);

  const [lessonModal, setLessonModal] =
    useState(false);

  const [selectedModule, setSelectedModule] =
    useState(null);

  const [selectedLesson, setSelectedLesson] =
    useState(null);

  const [previewLesson, setPreviewLesson] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Modules
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    const response =
      await getModuleList(courseId);

    if (!response.success) {
      return;
    }

    const modulesWithLessons =
      await Promise.all(
        response.data.map(
          async (module) => {
            const lessonsResponse =
              await getModuleLessons(
                courseId,
                module.id
              );

            return {
              ...module,
              lessons:
                lessonsResponse.data ||
                [],
            };
          }
        )
      );

    setModules(modulesWithLessons);
  };

  /*
  |--------------------------------------------------------------------------
  | Save Module
  |--------------------------------------------------------------------------
  */

  const handleSaveModule =
    async (data) => {
      if (selectedModule) {
        await updateCourseModule(
          courseId,
          selectedModule.id,
          data
        );
      } else {
        await saveCourseModule(
          courseId,
          data
        );
      }

      setModuleModal(false);

      setSelectedModule(null);

      fetchModules();
    };

  /*
  |--------------------------------------------------------------------------
  | Delete Module
  |--------------------------------------------------------------------------
  */

  const handleDeleteModule =
    async (moduleId) => {
      await deleteCourseModule(
        courseId,
        moduleId
      );

      fetchModules();
    };

  /*
  |--------------------------------------------------------------------------
  | Save Lesson
  |--------------------------------------------------------------------------
  */

  const handleSaveLesson =
    async (data) => {
      if (!selectedModule) {
        return;
      }

      if (selectedLesson) {
        await updateModuleLessons(
          courseId,
          selectedModule.id,
          selectedLesson.id,
          data
        );
      } else {
        await addModuleLessons(
          courseId,
          selectedModule.id,
          data
        );
      }

      setLessonModal(false);

      setSelectedLesson(null);

      fetchModules();
    };

  /*
  |--------------------------------------------------------------------------
  | Delete Lesson
  |--------------------------------------------------------------------------
  */

  const handleDeleteLesson =
    async (moduleId, lessonId) => {
      await deleteModuleLessons(
        courseId,
        moduleId,
        lessonId
      );

      fetchModules();
    };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() =>
              navigate("/admin/courses")
            }
            className="inline-flex items-center gap-2 text-slate-600 mb-4"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-4xl font-bold text-slate-800">
            Course Modules
          </h1>
        </div>

        <button
          onClick={() => {
            setSelectedModule(null);

            setModuleModal(true);
          }}
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl"
        >
          <Plus size={18} />
          Add Module
        </button>
      </div>

      <div className="space-y-6">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden"
          >
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {module.moduleName}
              </h2>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedModule(
                      module
                    );

                    setModuleModal(
                      true
                    );
                  }}
                  className="p-2 rounded-xl bg-blue-100 text-blue-600"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    handleDeleteModule(
                      module.id
                    )
                  }
                  className="p-2 rounded-xl bg-red-100 text-red-600"
                >
                  <Trash2 size={18} />
                </button>

                <button
                  onClick={() => {
                    setSelectedModule(
                      module
                    );

                    setSelectedLesson(
                      null
                    );

                    setLessonModal(
                      true
                    );
                  }}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl"
                >
                  <Plus size={18} />
                  Add Lesson
                </button>
              </div>
            </div>

            <div className="divide-y">
              {(
                module.lessons || []
              ).map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-6 flex items-start justify-between gap-5"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {
                        lesson.lessonName
                      }
                    </h3>

                    <p className="text-slate-500 mt-2">
                      HTML Lesson Content
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setPreviewLesson(
                          lesson
                        )
                      }
                      className="p-2 rounded-xl bg-green-100 text-green-600"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedModule(
                          module
                        );

                        setSelectedLesson(
                          lesson
                        );

                        setLessonModal(
                          true
                        );
                      }}
                      className="p-2 rounded-xl bg-blue-100 text-blue-600"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteLesson(
                          module.id,
                          lesson.id
                        )
                      }
                      className="p-2 rounded-xl bg-red-100 text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {(
                module.lessons || []
              ).length === 0 && (
                <div className="p-10 text-center text-slate-500">
                  No Lessons Added
                </div>
              )}
            </div>
          </div>
        ))}

        {modules.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">
            <h2 className="text-2xl font-bold text-slate-700">
              No Modules Added
            </h2>
          </div>
        )}
      </div>

      <ModuleModal
        open={moduleModal}
        onClose={() => {
          setModuleModal(false);

          setSelectedModule(null);
        }}
        onSave={handleSaveModule}
        editData={selectedModule}
      />

      <LessonModal
        open={lessonModal}
        onClose={() => {
          setLessonModal(false);

          setSelectedLesson(null);
        }}
        onSave={handleSaveLesson}
        editData={selectedLesson}
      />

      {previewLesson && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-7xl rounded-3xl overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {
                  previewLesson.lessonName
                }
              </h2>

              <button
                onClick={() =>
                  setPreviewLesson(null)
                }
              >
                <X />
              </button>
            </div>

            <iframe
              title="lesson-preview"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={
                previewLesson.lessonContent
              }
              className="w-full h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}