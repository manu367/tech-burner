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
| ADD PROJECT
|--------------------------------------------------------------------------
|
| Structure:
|
| projects
|   projectId
|
| categoryProjects
|   categoryId
|      projectId : true
|
*/

export const addProject =
  async (project) => {
    try {
      const projectRef = push(
        ref(db, "projects")
      );

      const newProject = {
        id: projectRef.key,

        title:
          project.title || "",

        description:
          project.description ||
          "",

        image:
          project.image || "",

        category:
          project.category || "",

        techStack:
          project.techStack || "",

        github:
          project.github || "",

        live:
          project.live || "",

        documentation:
          project.documentation ||
          "",

        status:
          project.status ||
          "In Progress",

        createdAt: Date.now(),

        updatedAt: Date.now(),
      };

      /*
      |--------------------------------------------------------------------------
      | SAVE PROJECT
      |--------------------------------------------------------------------------
      */

      await set(
        projectRef,
        newProject
      );

      /*
      |--------------------------------------------------------------------------
      | CATEGORY MAPPING
      |--------------------------------------------------------------------------
      */

      if (
        newProject.category
      ) {
        await set(
          ref(
            db,
            `categoryProjects/${newProject.category}/${newProject.id}`
          ),
          true
        );
      }

      return {
        success: true,
        message:
          "Project added successfully",

        data: newProject,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| DELETE PROJECT
|--------------------------------------------------------------------------
*/

export const deleteProject =
  async (projectId) => {
    try {
      const projectRef = ref(
        db,
        `projects/${projectId}`
      );

      const snapshot =
        await get(projectRef);

      if (
        !snapshot.exists()
      ) {
        return {
          success: false,
          message:
            "Project not found",
        };
      }

      const project =
        snapshot.val();

      /*
      |--------------------------------------------------------------------------
      | REMOVE CATEGORY MAPPING
      |--------------------------------------------------------------------------
      */

      if (
        project.category
      ) {
        await remove(
          ref(
            db,
            `categoryProjects/${project.category}/${projectId}`
          )
        );
      }

      /*
      |--------------------------------------------------------------------------
      | REMOVE PROJECT
      |--------------------------------------------------------------------------
      */

      await remove(projectRef);

      return {
        success: true,
        message:
          "Project deleted successfully",
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| UPDATE PROJECT
|--------------------------------------------------------------------------
*/

export const updateProject =
  async (
    projectId,
    updatedProject
  ) => {
    try {
      const projectRef = ref(
        db,
        `projects/${projectId}`
      );

      const snapshot =
        await get(projectRef);

      if (
        !snapshot.exists()
      ) {
        return {
          success: false,
          message:
            "Project not found",
        };
      }

      const oldProject =
        snapshot.val();

      /*
      |--------------------------------------------------------------------------
      | REMOVE OLD CATEGORY MAPPING
      |--------------------------------------------------------------------------
      */

      if (
        oldProject.category
      ) {
        await remove(
          ref(
            db,
            `categoryProjects/${oldProject.category}/${projectId}`
          )
        );
      }

      const updatedData = {
        ...oldProject,
        ...updatedProject,

        updatedAt:
          Date.now(),
      };

      /*
      |--------------------------------------------------------------------------
      | UPDATE PROJECT
      |--------------------------------------------------------------------------
      */

      await update(
        projectRef,
        updatedData
      );

      /*
      |--------------------------------------------------------------------------
      | ADD NEW CATEGORY MAPPING
      |--------------------------------------------------------------------------
      */

      if (
        updatedData.category
      ) {
        await set(
          ref(
            db,
            `categoryProjects/${updatedData.category}/${projectId}`
          ),
          true
        );
      }

      return {
        success: true,
        message:
          "Project updated successfully",

        data: updatedData,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| GET ALL PROJECTS
|--------------------------------------------------------------------------
*/

export const getAllProjects =
  async () => {
    try {
      const snapshot =
        await get(
          ref(db, "projects")
        );

      if (
        !snapshot.exists()
      ) {
        return {
          success: true,
          data: [],
        };
      }

      const data =
        snapshot.val();

      return {
        success: true,

        data: Object.values(
          data
        ),
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| GET PROJECT BY ID
|--------------------------------------------------------------------------
*/

export const getProjectById =
  async (projectId) => {
    try {
      const snapshot =
        await get(
          ref(
            db,
            `projects/${projectId}`
          )
        );

      if (
        !snapshot.exists()
      ) {
        return {
          success: false,
          message:
            "Project not found",
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
        message:
          error.message,
      };
    }
  };

/*
|--------------------------------------------------------------------------
| GET PROJECTS BY CATEGORY
|--------------------------------------------------------------------------
*/

export const getProjectsByCategory =
  async (category) => {
    try {
      const mappingSnapshot =
        await get(
          ref(
            db,
            `categoryProjects/${category}`
          )
        );

      if (
        !mappingSnapshot.exists()
      ) {
        return {
          success: true,
          data: [],
        };
      }

      const projectIds =
        Object.keys(
          mappingSnapshot.val()
        );

      const projects = [];

      for (const id of projectIds) {
        const snapshot =
          await get(
            ref(
              db,
              `projects/${id}`
            )
          );

        if (
          snapshot.exists()
        ) {
          projects.push(
            snapshot.val()
          );
        }
      }

      return {
        success: true,
        data: projects,
      };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error.message,
      };
    }
  };