export default class CodingQuestionModel {
    constructor({
        id = null,
        title = "",
        question = "",
        answers = [],
        imageUrl = "",
        categoryId = "",
        courseId = "",
        difficulty = "easy",
        status = "active",
        createdAt = Date.now()
    }) {
        this.id = id;
        this.title = title;
        this.question = question;
        this.answers = answers;
        this.imageUrl = imageUrl;
        this.categoryId = categoryId;
        this.courseId = courseId;
        this.difficulty = difficulty;
        this.status = status;
        this.createdAt = createdAt;
    }
}