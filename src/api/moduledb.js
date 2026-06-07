import {
  ref,
  push,
  set,
  get,
  update,
  remove,
} from "firebase/database";

import { db } from "../firebase";

/*
|--------------------------------------------------------------------------
| Save Course Module
|--------------------------------------------------------------------------
*/

export const saveCourseModule = async (
  courseId,
  moduleData
) => {
  try {
    const moduleRef = push(
      ref(db, `courseModules/${courseId}`)
    );

    const newModule = {
      id: moduleRef.key,
      moduleName:
        moduleData.moduleName || "",
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await set(moduleRef, newModule);

    return {
      success: true,
      data: newModule,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/*
|--------------------------------------------------------------------------
| Delete Course Module
|--------------------------------------------------------------------------
*/

export const deleteCourseModule =
  async (courseId, moduleId) => {
    try {
      await remove(
        ref(
          db,
          `courseModules/${courseId}/${moduleId}`
        )
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| Update Course Module
|--------------------------------------------------------------------------
*/

export const updateCourseModule =
  async (
    courseId,
    moduleId,
    moduleData
  ) => {
    try {
      const updatedData = {
        ...moduleData,
        updatedAt: Date.now(),
      };

      await update(
        ref(
          db,
          `courseModules/${courseId}/${moduleId}`
        ),
        updatedData
      );

      return {
        success: true,
        data: updatedData,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| Get Module List
|--------------------------------------------------------------------------
*/

export const getModuleList = async (
  courseId
) => {
  try {
    const snapshot = await get(
      ref(db, `courseModules/${courseId}`)
    );

    if (!snapshot.exists()) {
      return {
        success: true,
        data: [],
      };
    }

    const data = snapshot.val();

    return {
      success: true,
      data: Object.values(data),
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
};

/*
|--------------------------------------------------------------------------
| Add Module Lesson
|--------------------------------------------------------------------------
*/

export const addModuleLessons =
  async (
    courseId,
    moduleId,
    lesson
  ) => {
    try {
      const lessonRef = push(
        ref(
          db,
          `moduleLessons/${courseId}/${moduleId}`
        )
      );

      const newLesson = {
        id: lessonRef.key,
        lessonName:
          lesson.lessonName || "",

        lessonContent:
          lesson.lessonContent || "",

        status: "active",

        createdAt: Date.now(),

        updatedAt: Date.now(),
      };

      await set(lessonRef, newLesson);

      return {
        success: true,
        data: newLesson,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| Get Module Lessons
|--------------------------------------------------------------------------
*/

export const getModuleLessons =
  async (courseId, moduleId) => {
    try {
      const snapshot = await get(
        ref(
          db,
          `moduleLessons/${courseId}/${moduleId}`
        )
      );

      if (!snapshot.exists()) {
        return {
          success: true,
          data: [],
        };
      }

      return {
        success: true,
        data: Object.values(snapshot.val()),
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| Delete Module Lesson
|--------------------------------------------------------------------------
*/

export const deleteModuleLessons =
  async (
    courseId,
    moduleId,
    lessonId
  ) => {
    try {
      await remove(
        ref(
          db,
          `moduleLessons/${courseId}/${moduleId}/${lessonId}`
        )
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| Update Module Lesson
|--------------------------------------------------------------------------
*/

export const updateModuleLessons =
  async (
    courseId,
    moduleId,
    lessonId,
    lesson
  ) => {
    try {
      const updatedData = {
        ...lesson,
        updatedAt: Date.now(),
      };

      await update(
        ref(
          db,
          `moduleLessons/${courseId}/${moduleId}/${lessonId}`
        ),
        updatedData
      );

      return {
        success: true,
        data: updatedData,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }
  };