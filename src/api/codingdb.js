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
| Add Coding Question
|--------------------------------------------------------------------------
*/

export const addCodingQuestion =
  async (question) => {
    try {
      const questionRef = push(
        ref(db, "codingQuestions")
      );

      const newQuestion = {
        id: questionRef.key,

        title:
          question.title || "",

        categoryId:
          question.categoryId ||
          "",

        courseId:
          question.courseId || "",

        questionList:
          question.questionList ||
          [],

        status:
          question.status ||
          "active",

        createdAt: Date.now(),

        updatedAt: Date.now(),
      };

      await set(
        questionRef,
        newQuestion
      );

      return {
        success: true,
        data: newQuestion,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| Delete Coding Question
|--------------------------------------------------------------------------
*/

export const deleteCodingQuestion =
  async (questionId) => {
    try {
      await remove(
        ref(
          db,
          `codingQuestions/${questionId}`
        )
      );

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| Update Coding Question
|--------------------------------------------------------------------------
*/

export const updateCodingQuestin =
  async (
    questionId,
    updatedQuestion
  ) => {
    try {
      const questionRef = ref(
        db,
        `codingQuestions/${questionId}`
      );

      const snapshot =
        await get(questionRef);

      if (
        !snapshot.exists()
      ) {
        return {
          success: false,
          message:
            "Question not found",
        };
      }

      const oldData =
        snapshot.val();

      const updatedData = {
        ...oldData,
        ...updatedQuestion,
        updatedAt: Date.now(),
      };

      await update(
        questionRef,
        updatedData
      );

      return {
        success: true,
        data: updatedData,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

export const getCodingById =
  async (questionId) => {
    try {
      const snapshot =
        await get(
          ref(
            db,
            `codingQuestions/${questionId}`
          )
        );

      if (
        !snapshot.exists()
      ) {
        return {
          success: false,
        };
      }

      return {
        success: true,
        data: snapshot.val(),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export const getAllCodingQuestion =
  async () => {
    try {
      const snapshot =
        await get(
          ref(
            db,
            "codingQuestions"
          )
        );

      if (
        !snapshot.exists()
      ) {
        return {
          success: true,
          data: [],
        };
      }

      return {
        success: true,
        data: Object.values(
          snapshot.val()
        ),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };