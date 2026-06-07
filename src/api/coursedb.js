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
| Add Course
|--------------------------------------------------------------------------
*/

export const addCourse = async (course) => {
  try {
    const courseRef = push(ref(db, "courses"));

    const newCourse = {
      id: courseRef.key,

      courseName: course.courseName || "",

      description: course.description || "",

      thumbnail: course.thumbnail || "",

      categoryIds: course.categoryIds || [],

      price: Number(course.price || 0),

      level: course.level || "beginner",

      status: course.status || "active",

      modules: [],

      createdAt: Date.now(),

      updatedAt: Date.now(),
    };

    await set(courseRef, newCourse);

    /*
    |--------------------------------------------------------------------------
    | Many To Many Mapping
    |--------------------------------------------------------------------------
    |
    | One course -> multiple categories
    | One category -> multiple courses
    |
    */

    for (const categoryId of newCourse.categoryIds) {
      await set(
        ref(
          db,
          `categoryCourses/${categoryId}/${newCourse.id}`
        ),
        true
      );
    }

    return {
      success: true,
      message: "Course added successfully",
      data: newCourse,
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
| Delete Course
|--------------------------------------------------------------------------
*/

export const deleteCourse = async (courseId) => {
  try {
    const courseRef = ref(db, `courses/${courseId}`);

    const snapshot = await get(courseRef);

    if (!snapshot.exists()) {
      return {
        success: false,
        message: "Course not found",
      };
    }

    const course = snapshot.val();

    /*
    |--------------------------------------------------------------------------
    | Remove Mapping
    |--------------------------------------------------------------------------
    */

    for (const categoryId of course.categoryIds || []) {
      await remove(
        ref(
          db,
          `categoryCourses/${categoryId}/${courseId}`
        )
      );
    }

    await remove(courseRef);

    return {
      success: true,
      message: "Course deleted successfully",
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
| Update Course
|--------------------------------------------------------------------------
*/

export const updateCourse = async (
  courseId,
  course
) => {
  try {
    const courseRef = ref(db, `courses/${courseId}`);

    const snapshot = await get(courseRef);

    if (!snapshot.exists()) {
      return {
        success: false,
        message: "Course not found",
      };
    }

    const oldCourse = snapshot.val();

    /*
    |--------------------------------------------------------------------------
    | Remove Old Mapping
    |--------------------------------------------------------------------------
    */

    for (const categoryId of oldCourse.categoryIds || []) {
      await remove(
        ref(
          db,
          `categoryCourses/${categoryId}/${courseId}`
        )
      );
    }

    const updatedCourse = {
      ...oldCourse,
      ...course,
      updatedAt: Date.now(),
    };

    await update(courseRef, updatedCourse);

    /*
    |--------------------------------------------------------------------------
    | Add New Mapping
    |--------------------------------------------------------------------------
    */

    for (const categoryId of updatedCourse.categoryIds || []) {
      await set(
        ref(
          db,
          `categoryCourses/${categoryId}/${courseId}`
        ),
        true
      );
    }

    return {
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
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
| Get Course List
|--------------------------------------------------------------------------
*/

export const getCourseList = async () => {
  try {
    const snapshot = await get(ref(db, "courses"));

    if (!snapshot.exists()) {
      return {
        success: true,
        data: [],
      };
    }

    const data = snapshot.val();

    const courses = Object.values(data);

    return {
      success: true,
      data: courses,
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
| Get Course By Id
|--------------------------------------------------------------------------
*/

export const getCourseById = async (courseId) => {
  try {
    const snapshot = await get(
      ref(db, `courses/${courseId}`)
    );

    if (!snapshot.exists()) {
      return {
        success: false,
        message: "Course not found",
      };
    }

    return {
      success: true,
      data: snapshot.val(),
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
| Get Category Wise Courses
|--------------------------------------------------------------------------
*/

export const getCoursesByCategory = async (
  categoryId
) => {
  try {
    const mappingSnapshot = await get(
      ref(db, `categoryCourses/${categoryId}`)
    );

    if (!mappingSnapshot.exists()) {
      return {
        success: true,
        data: [],
      };
    }

    const courseIds = Object.keys(
      mappingSnapshot.val()
    );

    const courses = [];

    for (const courseId of courseIds) {
      const courseSnapshot = await get(
        ref(db, `courses/${courseId}`)
      );

      if (courseSnapshot.exists()) {
        const course = courseSnapshot.val();

        if (course.status === "active") {
          courses.push(course);
        }
      }
    }

    return {
      success: true,
      data: courses,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: error.message,
    };
  }
};