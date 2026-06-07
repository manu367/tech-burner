export default class ProjectModel {
    constructor({
        id = null,
        projectName = "",
        description = "",
        thumbnail = "",
        categoryId = "",
        courseId = "",
        techStack = [],
        githubUrl = "",
        liveUrl = "",
        documentationUrl = "",
        difficulty = "medium",
        projectStatus = "active",
        createdAt = Date.now()
    }) {
        this.id = id;
        this.projectName = projectName;
        this.description = description;
        this.thumbnail = thumbnail;
        this.categoryId = categoryId;
        this.courseId = courseId;
        this.techStack = techStack;
        this.githubUrl = githubUrl;
        this.liveUrl = liveUrl;
        this.documentationUrl = documentationUrl;
        this.difficulty = difficulty;
        this.projectStatus = projectStatus;
        this.createdAt = createdAt;
    }
}