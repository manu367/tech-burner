export default class CategoryModel {
    constructor({
        id = null,
        categoryName = "",
        categoryImage = "",
        description = "",
        status = "active",
        createdAt = Date.now()
    }) {
        this.id = id;
        this.categoryName = categoryName;
        this.categoryImage = categoryImage;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
    }
}