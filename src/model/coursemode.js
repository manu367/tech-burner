export default class CourseModel {
    constructor({
        id = null,
        courseName = "",
        description = "",
        thumbnail = "",
        categoryIds = [],
        price = 0,
        level = "beginner",
        status = "active",
        createdBy = "",
        createdAt = Date.now()
    }) {
        this.id = id;
        this.courseName = courseName;
        this.description = description;
        this.thumbnail = thumbnail;
        this.categoryIds = categoryIds;
        this.price = price;
        this.level = level;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }
}